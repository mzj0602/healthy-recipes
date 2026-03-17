import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './router';

interface Env {
  DEEPSEEK_API_KEY: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname.startsWith('/trpc')) {
      const response = await fetchRequestHandler({
        endpoint: '/trpc',
        req: request,
        router: appRouter,
        createContext: () => ({ apiKey: env.DEEPSEEK_API_KEY }),
      });

      const newHeaders = new Headers(response.headers);
      Object.entries(CORS_HEADERS).forEach(([k, v]) => newHeaders.set(k, v));

      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    return new Response(JSON.stringify({ name: 'Healthy Recipes API', status: 'ok' }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  },
};
