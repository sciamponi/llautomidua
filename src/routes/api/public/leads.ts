import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/public/leads')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          
          // Log simple representation (would normally save to DB)
          console.log('Lead capture received:', body);

          // In a real scenario, this would call a server function or directly the DB
          // return await saveLead(body);

          return new Response(JSON.stringify({ 
            success: true, 
            message: 'Lead captured successfully' 
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ 
            success: false, 
            message: 'Internal server error' 
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }
  }
})
