import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { daluxFetch, DaluxApiError } from '@/lib/dalux';

/**
 * Secure Dalux API proxy — requires authentication.
 * API keys are read from env, never from the client.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { endpoint, type, method, body } = await req.json();

    if (!endpoint || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: endpoint, type (fm|build)' },
        { status: 400 }
      );
    }

    const apiKey =
      type === 'fm'
        ? process.env.DALUX_FM_API_KEY
        : process.env.DALUX_BUILD_API_KEY;

    const baseUrl =
      type === 'fm'
        ? process.env.DALUX_FM_BASE_URL || 'https://fm-api.dalux.com/api'
        : process.env.DALUX_BUILD_BASE_URL || 'https://node2.field.dalux.com/service/api';

    if (!apiKey) {
      return NextResponse.json(
        { error: `No API key configured for Dalux ${type.toUpperCase()}` },
        { status: 422 }
      );
    }

    const data = await daluxFetch(apiKey, baseUrl, endpoint, { method, body });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof DaluxApiError) {
      console.error(`[dalux-proxy] ${err.status}: ${err.message}`);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('[dalux-proxy] Unexpected error:', (err as Error).message);
    return NextResponse.json(
      { error: 'Failed to reach Dalux API. Please try again later.' },
      { status: 502 }
    );
  }
}
