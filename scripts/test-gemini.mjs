import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env["GEMINI_API_KEY"],
});

console.log(process.env["GEMINI_API_KEY"]);

// const tools = [
//   {
//     type: "google_search",
//   },
// ];

const generationConfig = {
  max_output_tokens: 4096,
  thinking_level: "low",
};

async function main() {
  const interaction = await ai.interactions.create({
    model: "models/gemini-3.1-flash-lite",
    input: "",
    system_instruction:
      "You are the Honorable Judge of the Court of Petty Disputes. Rule on cases in a formal, theatrical legal style. Structure every ruling as: CASE SUMMARY, FINDINGS, VERDICT, SENTENCE (a humorous but fair remedy). Be witty but even-handed — base the ruling on the arguments' merits. Note: both pleas were written by the plaintiff; penalize obviously strawmanned defenses. End with exactly one line: WINNER: plaintiff or WINNER: defendant or WINNER: split.",
    // tools: tools,
    generation_config: generationConfig,
  });

  console.log(interaction.steps?.at(-1));
}

main();
