// API client handlers dealing with direct remote RPC calls
// or Supabase Edge Functions like triggering AI engine verdicts.

import { supabase } from "@/utils/supabase";

// Invoke the `generate-verdict` Edge Function for a case: it rules on the
// dispute with Gemini, writes the verdict, and flips the case to 'ruled'.
// Returns { verdict, error } where exactly one field is non-null.
export async function requestVerdict(caseId) {
  const { data, error } = await supabase.functions.invoke("generate-verdict", {
    body: { caseId },
  });

  if (error) {
    // On a non-2xx the function's JSON body ({ error }) rides on error.context.
    let message = error.message || "The court could not reach a verdict.";

    try {
      const body = await error.context?.json?.();
      
      if (body?.error) message = body.error;
    } catch {
      // context wasn't JSON (e.g. a network failure) — keep the default message.
    }
    return { verdict: null, error: message };
  }

  if (data?.error) {
    return { verdict: null, error: data.error };
  }

  return { verdict: data?.verdict ?? null, error: null };
}
