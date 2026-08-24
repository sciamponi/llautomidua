import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/health')({
  server: {
    handlers: {
      GET: async () => {
        const databaseUrl = process.env['DATABASE_URL'];
        const isProduction = process.env['NODE_ENV'] === 'production';

        // 1. Se NODE_ENV não for production e DATABASE_URL não existir (Preview)
        if (!isProduction && !databaseUrl) {
          return Response.json(
            {
              status: 'ok',
              database: 'not_configured',
            },
            { status: 200 },
          );
        }

        // 2. Se NODE_ENV = production e DATABASE_URL não existir
        if (isProduction && !databaseUrl) {
          return Response.json(
            {
              status: 'error',
              database: 'not_configured',
            },
            { status: 503 },
          );
        }

        // 3. Se DATABASE_URL existir: tentar conexão real
        try {
          const { prisma } = await import('@/lib/prisma.server');
          // Timeout implícito pela execução do queryRaw
          await prisma.$queryRaw`SELECT 1`;
          
          return Response.json(
            {
              status: 'ok',
              database: 'ok',
            },
            { status: 200 },
          );
        } catch (err) {
          // Log interno, não exposto na resposta
          console.error('[HealthCheck] Connection failed');
          
          return Response.json(
            {
              status: 'error',
              database: 'unavailable',
            },
            { status: 503 },
          );
        }
      },
    },
  },
});
