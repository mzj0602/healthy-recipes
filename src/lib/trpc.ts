import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../worker/src/router';

const workerUrl = import.meta.env.VITE_WORKER_URL ?? 'http://localhost:8787';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${workerUrl}/trpc`,
    }),
  ],
});
