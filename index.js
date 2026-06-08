export default {
  async fetch(request, env) {
    // Define explicit headers allowing cross-origin requests
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 1. Handle browser preflight checks (OPTIONS request)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 2. Handle data retrievals (GET request)
      if (request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT * FROM messages ORDER BY id DESC LIMIT 10"
        ).all();
        
        return new Response(JSON.stringify(results), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      // 3. Handle data entry submissions (POST request)
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
};
