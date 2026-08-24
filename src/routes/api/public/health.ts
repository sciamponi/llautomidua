import { createFileRoute } from '@tanstack/react-router';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

export const Route = createFileRoute('/api/public/health')({
  server: {
    handlers: {
      GET: async () => {
        let dbStatus = 'ok';
        
        try {
          // Check database connectivity
          // Usando uma query simples para verificar se o banco responde
          const { error } = await supabaseAdmin.from('Product').select('count', { count: 'exact', head: true });
          
          if (error) {
            console.error('[HealthCheck] Database error:', error);
            dbStatus = 'error';
          }
        } catch (err) {
          console.error('[HealthCheck] Connection error:', err);
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
