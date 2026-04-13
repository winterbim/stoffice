/**
 * Dalux API client — server-side only.
 * API keys are read from the database, never from the client.
 */

const ALLOWED_DOMAINS = [
  'field.dalux.com',
  'node2.field.dalux.com',
  'fm-api.dalux.com',
  'fm-stage-api.dalux.com',
  'fm.dalux.com',
];

export class DaluxApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'DaluxApiError';
  }
}

function validateBaseUrl(baseUrl: string): URL {
  const parsed = new URL(baseUrl);
  if (!ALLOWED_DOMAINS.includes(parsed.hostname)) {
    throw new DaluxApiError(
      'Domain not allowed. Only Dalux domains are permitted.',
      403
    );
  }
  return parsed;
}

export async function daluxFetch(
  apiKey: string,
  baseUrl: string,
  endpoint: string,
  options?: { method?: string; body?: unknown; signal?: AbortSignal }
): Promise<unknown> {
  validateBaseUrl(baseUrl);

  const url = `${baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  const method = options?.method || 'GET';

  const headers: Record<string, string> = {
    'X-API-KEY': apiKey,
    Accept: 'application/json',
  };

  const fetchOptions: RequestInit = { method, headers, signal: options?.signal };

  if (options?.body && (method === 'POST' || method === 'PATCH')) {
    headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    let errorMsg = `Dalux API returned ${response.status}`;
    if (contentType.includes('application/json')) {
      try {
        const errData = await response.json();
        errorMsg = errData.message || errData.error || errorMsg;
      } catch {
        // ignore parse errors
      }
    }
    throw new DaluxApiError(errorMsg, response.status);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export function extractCount(data: unknown): number {
  if (
    data &&
    typeof data === 'object' &&
    'metadata' in data &&
    (data as { metadata: { totalItems?: number } }).metadata?.totalItems
  ) {
    return (data as { metadata: { totalItems: number } }).metadata.totalItems;
  }
  if (data && typeof data === 'object' && 'items' in data) {
    return (data as { items: unknown[] }).items.length;
  }
  if (Array.isArray(data)) {
    return data.length;
  }
  return 0;
}
