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

type TursoResponse = {
  results?: Array<{
    type?: string;
    error?: { message?: string };
  }>;
};

const DEFAULT_TURSO_DATABASE_URL =
  "libsql://database-indigo-river-vercel-icfg-qivv1kbkreujp9aduvoqvzh0.aws-us-east-1.turso.io";

const toHttpLibsqlUrl = (libsqlUrl: string) => {
  if (libsqlUrl.startsWith("https://") || libsqlUrl.startsWith("http://")) {
    return libsqlUrl;
  }
  if (libsqlUrl.startsWith("libsql://")) {
    return `https://${libsqlUrl.slice("libsql://".length)}`;
  }
  return `https://${libsqlUrl}`;
};

const runTursoStatement = async (
  libsqlUrl: string,
  authToken: string,
  sql: string,
  args: Array<string | number | null> = [],
) => {
  const httpUrl = toHttpLibsqlUrl(libsqlUrl);
  const response = await fetch(`${httpUrl}/v2/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        {
          type: "execute",
          stmt: {
            sql,
            args,
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Turso request failed (${response.status}): ${text}`);
  }

  const body = (await response.json()) as TursoResponse;
  const firstResult = body.results?.[0];
  if (firstResult?.type === "error") {
    throw new Error(firstResult.error?.message || "Turso execution failed");
  }
};

const ensureTursoTables = async (libsqlUrl: string, authToken: string) => {
  await runTursoStatement(
    libsqlUrl,
    authToken,
    `CREATE TABLE IF NOT EXISTS chat_analytics (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      model TEXT NOT NULL,
      words INTEGER NOT NULL,
      message_count INTEGER NOT NULL,
      preview TEXT NOT NULL
    )`,
  );

  await runTursoStatement(
    libsqlUrl,
    authToken,
    `CREATE TABLE IF NOT EXISTS ollama_model_registry (
      id TEXT PRIMARY KEY,
      model_name TEXT NOT NULL UNIQUE,
      storage_target TEXT NOT NULL,
      sync_status TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
  );
};

const persistTursoAnalytics = async (messages: ChatMessage[], model: string) => {
  const tursoUrl = Deno.env.get("TURSO_DATABASE_URL") || DEFAULT_TURSO_DATABASE_URL;
  const tursoToken = Deno.env.get("TURSO_AUTH_TOKEN");

  if (!tursoToken) {
    return;
  }

  await ensureTursoTables(tursoUrl, tursoToken);

  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const words = lastUserMessage?.content.trim().split(/\s+/).filter(Boolean).length ?? 0;
  const now = new Date().toISOString();

  await runTursoStatement(
    tursoUrl,
    tursoToken,
    `INSERT INTO chat_analytics (id, created_at, model, words, message_count, preview)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      crypto.randomUUID(),
      now,
      model,
      words,
      messages.length,
      lastUserMessage?.content.slice(0, 140) ?? "",
    ],
  );

  const ollamaModel = Deno.env.get("OLLAMA_APP_BUILDER_MODEL") || "qwen2.5-coder:32b";
  await runTursoStatement(
    tursoUrl,
    tursoToken,
    `INSERT INTO ollama_model_registry (id, model_name, storage_target, sync_status, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(model_name) DO UPDATE SET
       storage_target = excluded.storage_target,
       sync_status = excluded.sync_status,
       updated_at = excluded.updated_at`,
    [
      crypto.randomUUID(),
      ollamaModel,
      "cloud-storage",
      "pending_download",
      now,
    ],
  );
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

    await persistTursoAnalytics(requestMessages, selectedModel).catch((error) => {
      console.error("Turso persistence error:", error);
    });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
    });

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
