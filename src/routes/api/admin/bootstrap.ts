import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { bootstrapMaster } from '@/lib/auth.functions';

const BootstrapSchema = z.object({
  secret: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(12),
});

export const Route = createFileRoute('/api/admin/bootstrap')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const data = BootstrapSchema.parse(body);
          
          // Use the existing server function logic
          // We wrap it because bootstrapMaster is a createServerFn
          const result = await bootstrapMaster({ data });
          
          return Response.json(result, { status: 200 });
        } catch (err) {
          console.error('[Bootstrap] Failed:', err);
          return Response.json(
            { 
              success: false, 
              error: err instanceof Error ? err.message : "Bootstrap failed" 
            }, 
            { status: 400 }
          );
        }
      },
    },
  },
});
