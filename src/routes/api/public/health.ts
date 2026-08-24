import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/health')({
  server: {
    handlers: {
      GET: async () => {
        const databaseUrl = process.env['DATABASE_URL'];

        // Preview / Desenvolvimento (DATABASE_URL ausente)
        if (!databaseUrl) {
          return Response.json(
            {
              status: 'ok',
              database: 'not_configured',
              timestamp: new Date().toISOString(),
            },
            { status: 200 },
          );
        }

        let database = 'ok';
        try {
          const { prisma } = await import('@/lib/prisma.server');
          await prisma.$queryRaw`SELECT 1`;
        } catch (err) {
          console.error('[HealthCheck] Database error:', err);
          database = 'unavailable';
        }

        return Response.json(
          {
            status: database === 'ok' ? 'ok' : 'degraded',
            database,
            timestamp: new Date().toISOString(),
          },
          { status: database === 'ok' ? 200 : 503 },
        );
      },
    },
  },
});
