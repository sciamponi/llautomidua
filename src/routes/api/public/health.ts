import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/prisma.server';

export const Route = createFileRoute('/api/public/health')({
  server: {
    handlers: {
      GET: async () => {
        let dbStatus = 'ok';
        
        try {
          // Check database connectivity using Prisma
          // Simple raw query that works on PostgreSQL
          await prisma.$queryRaw`SELECT 1`;
        } catch (err) {
          console.error('[HealthCheck] Database error:', err);
          dbStatus = 'error';
        }

        const status = dbStatus === 'ok' ? 200 : 503;

        return new Response(
          JSON.stringify({
            status: dbStatus === 'ok' ? 'ok' : 'error',
            database: dbStatus,
            timestamp: new Date().toISOString()
          }),
          {
            status,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }
  }
});
