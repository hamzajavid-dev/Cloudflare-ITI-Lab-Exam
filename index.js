export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // GET Request routing
    if (request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM messages ORDER BY id DESC LIMIT 10").all();
      return new Response(JSON.stringify(results), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // POST Request routing
    if (request.method === "POST") {
      const { content } = await request.json();
      await env.DB.prepare("INSERT INTO messages (content) VALUES (?)").bind(content).run();
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }
  }
};
