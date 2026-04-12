/**
 * Vercel Serverless Function — Dalux API Proxy
 *
 * Proxies requests to Dalux Build/Field API to avoid CORS issues.
 * The API key is sent from the client and forwarded server-side.
 *
 * Usage: POST /api/dalux/proxy
 * Body: { apiKey, baseUrl, endpoint, method? }
 */

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const { apiKey, baseUrl, endpoint, method, body } = req.body || {};

    if (!apiKey || !baseUrl || !endpoint) {
        return res.status(400).json({
            error: 'Missing required fields: apiKey, baseUrl, endpoint'
        });
    }

    // Validate baseUrl — only allow known Dalux domains
    const allowedDomains = [
        'field.dalux.com',
        'fm-api.dalux.com',
        'fm-stage-api.dalux.com',
        'fm.dalux.com',
    ];

    let parsedUrl;
    try {
        parsedUrl = new URL(baseUrl);
    } catch (e) {
        return res.status(400).json({ error: 'Invalid baseUrl' });
    }

    if (!allowedDomains.includes(parsedUrl.hostname)) {
        return res.status(403).json({
            error: 'Domain not allowed. Only Dalux domains are permitted.',
            allowed: allowedDomains
        });
    }

    const fullUrl = baseUrl.replace(/\/+$/, '') + '/' + endpoint.replace(/^\/+/, '');

    try {
        const fetchOptions = {
            method: method || 'GET',
            headers: {
                'X-API-KEY': apiKey,
                'Accept': 'application/json',
            },
        };

        if (body && (method === 'POST' || method === 'PATCH')) {
            fetchOptions.headers['Content-Type'] = 'application/json';
            fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(fullUrl, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            const data = await response.json();
            return res.status(response.status).json(data);
        } else {
            const text = await response.text();
            return res.status(response.status).json({
                _raw: true,
                status: response.status,
                body: text
            });
        }
    } catch (err) {
        return res.status(502).json({
            error: 'Failed to reach Dalux API',
            details: err.message
        });
    }
};
