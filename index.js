export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Explicit headers allowing your GitHub page to fetch data safely
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle browser security checks
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Capture traffic heading to your specific data path
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

    // Fallback if the path is wrong
    return new Response("API Path Not Found. Use /api/messages", { status: 404 });
  }
};
