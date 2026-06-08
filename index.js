export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 1. Handle browser safety preflight checks
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. DATABASE API ROUTING
    // If the request goes to /api/messages, talk to Cloudflare D1
    if (url.pathname === "/api/messages") {
      try {
        if (request.method === "GET") {
          const { results } = await env.DB.prepare("SELECT * FROM messages ORDER BY id DESC LIMIT 10").all();
          return new Response(JSON.stringify(results), { 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          });
        }

        if (request.method === "POST") {
          const { content } = await request.json();
          await env.DB.prepare("INSERT INTO messages (content) VALUES (?)").bind(content).run();
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // 3. Fallback: If you are hosting the frontend HTML directly inside this worker, 
    // let it fall through to your asset serving logic here.
    return new Response("Frontend Asset Fallback - API paths require /api/messages", { status: 404 });
  }
};
