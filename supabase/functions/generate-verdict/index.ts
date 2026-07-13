// Supabase Edge Function: generate-verdict
//
// Given a caseId, verifies the caller is the case's plaintiff, asks Gemini to
// rule on the dispute, then writes the verdict and flips the case to 'ruled'.
// This is the ONLY writer of public.verdicts — it uses the service-role key,
// which bypasses RLS (see supabase/migrations/0003_rls.sql).
//
// Deploy:  supabase functions deploy generate-verdict
// Secret:  supabase secrets set GEMINI_API_KEY=...
// (SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are injected by the runtime.)

import { GoogleGenAI, Type } from "npm:@google/genai";
import { createClient } from "npm:@supabase/supabase-js@2";

const MODEL = "gemini-3.1-flash-lite";

const SYSTEM_INSTRUCTION =
  "You are the Honorable Judge of the Court of Petty Disputes. Rule on cases in a " +
  "formal, theatrical legal style. In `verdict_text`, structure the ruling with these " +
  "sections, each on its own line and clearly labeled: CASE SUMMARY, FINDINGS, VERDICT, " +
  "and SENTENCE (a humorous but fair remedy). Be witty but even-handed — base the ruling " +
  "on the arguments' merits. Note: both the complaint and the defense were written by the " +
  "same person (the plaintiff); penalize obviously strawmanned defenses. Set `winner` to " +
  "exactly one of 'plaintiff', 'defendant', or 'split'.";

const WINNERS = ["plaintiff", "defendant", "split"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return json({ error: "Missing authorization header." }, 401);
    }

    const { caseId } = await req.json().catch(() => ({}));

    if (!caseId) {
      return json({ error: "caseId is required." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    if (!supabaseUrl || !anonKey || !serviceKey) {
      return json({ error: "Server is missing Supabase configuration." }, 500);
    }

    if (!geminiKey) {
      return json({ error: "GEMINI_API_KEY is not configured." }, 500);
    }

    // Verify the caller using their JWT (respects RLS / real identity).
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return json({ error: "Invalid or expired session." }, 401);
    }

    // Service-role client for the privileged read of the case + verdict writes.
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: caseRow, error: caseError } = await admin
      .from("cases")
      .select("id, plaintiff_id, title, category, complaint, defense, status")
      .eq("id", caseId)
      .single();

    if (caseError || !caseRow) {
      return json({ error: "Case not found." }, 404);
    }

    if (caseRow.plaintiff_id !== user.id) {
      return json({ error: "Only the plaintiff can request a verdict." }, 403);
    }

    if (!caseRow.defense) {
      return json({ error: "The case has no defense to rule on yet." }, 400);
    }

    // Idempotency: one verdict per case (also enforced by unique(case_id)).
    const { data: existing } = await admin
      .from("verdicts")
      .select("id")
      .eq("case_id", caseId)
      .maybeSingle();

    if (existing) {
      return json({ error: "This case has already been ruled." }, 409);
    }

    // Ask Gemini for a structured ruling.
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const prompt = [
      `TITLE: ${caseRow.title}`,
      `CATEGORY: ${caseRow.category}`,
      `COMPLAINT (the plaintiff's case): ${caseRow.complaint}`,
      `DEFENSE (the opposing argument): ${caseRow.defense}`,
    ].join("\n\n");

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict_text: { type: Type.STRING },
            winner: { type: Type.STRING, enum: WINNERS },
          },
          required: ["verdict_text", "winner"],
        },
      },
    });

    const raw = response.text;

    if (!raw) {
      return json({ error: "The judge returned no ruling." }, 502);
    }

    let parsed: { verdict_text?: string; winner?: string };

    try {
      parsed = JSON.parse(raw);
    } catch {
      return json({ error: "The judge's ruling was malformed." }, 502);
    }

    const verdictText = parsed?.verdict_text?.trim();
    const winner = parsed?.winner;

    if (!verdictText || !winner || !WINNERS.includes(winner)) {
      return json({ error: "The judge's ruling was incomplete." }, 502);
    }

    // Persist the verdict, then flip the case to 'ruled'.
    const { data: verdict, error: insertError } = await admin
      .from("verdicts")
      .insert({ case_id: caseId, verdict_text: verdictText, winner })
      .select()
      .single();

    if (insertError) {
      return json({ error: insertError.message }, 500);
    }

    const { error: statusError } = await admin
      .from("cases")
      .update({ status: "ruled" })
      .eq("id", caseId);
      
    if (statusError) {
      // Verdict is saved; surface the status hiccup but don't fail the ruling.
      console.error("Failed to flip case status to 'ruled':", statusError.message);
    }

    return json({ verdict });
  } catch (err) {
    console.error("generate-verdict error:", err);
    const message =
      err instanceof Error ? err.message : "Unexpected error generating verdict.";
    return json({ error: message }, 500);
  }
});
