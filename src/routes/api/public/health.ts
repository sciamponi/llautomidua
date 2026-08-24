import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/health')({
  server: {
    handlers: {
      GET: async () => {
        const databaseUrl = process.env['DATABASE_URL'];

        // Sem DATABASE_URL (ex.: preview do Lovable), a app está saudável,
        // apenas sem banco configurado. Não é um erro.
        if (!databaseUrl) {
          return Response.json(
            {
              status: 'ok',
              app: 'ok',
              database: 'unconfigured',
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
          database = 'error';
        }

        return Response.json(
          {
            status: database === 'ok' ? 'ok' : 'degraded',
            app: 'ok',
            database,
            timestamp: new Date().toISOString(),
          },
          { status: database === 'ok' ? 200 : 503 },
        );
      },
    },
  },
});
