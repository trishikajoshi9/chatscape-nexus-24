import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const persistChatAnalytics = async (messages: ChatMessage[], model: string) => {
  const kvUrl = Deno.env.get("KV_REST_API_URL");
  const kvToken = Deno.env.get("KV_REST_API_TOKEN");

  if (!kvUrl || !kvToken) {
    return;
  }

  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const words = lastUserMessage?.content.trim().split(/\s+/).filter(Boolean).length ?? 0;
  const payload = {
    createdAt: new Date().toISOString(),
    model,
    words,
    messageCount: messages.length,
    preview: lastUserMessage?.content.slice(0, 140) ?? "",
  };

  const key = `chat:analytics:${crypto.randomUUID()}`;
  const response = await fetch(`${kvUrl}/set/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${kvToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value: JSON.stringify(payload) }),
  });

  if (!response.ok) {
    const txt = await response.text();
    console.error("Vercel KV persistence failed:", response.status, txt);
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const selectedModel = model || "google/gemini-3-flash-preview";
    const requestMessages = messages as ChatMessage[];

    await persistChatAnalytics(requestMessages, selectedModel).catch((error) => {
      console.error("Vercel KV error:", error);
    });

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: "system",
              content:
                "You are TRITEC AI, a powerful coding assistant focused on premium product quality. You help users generate code, debug issues, and build production-ready features with UI/UX analysis. Provide clear, concise, and well-structured responses. When generating code, use markdown code blocks with language hints. Keep answers focused and actionable.",
            },
            ...requestMessages,
          ],
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
