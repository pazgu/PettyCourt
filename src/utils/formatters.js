// Pure utility functions executing common formatting chores
// like localized dates, dynamic text clamping, and currency shapes.

// The sections the AI Judge is prompted to emit, in display order.
const VERDICT_SECTIONS = [
  { key: "CASE SUMMARY", label: "Case Summary" },
  { key: "FINDINGS", label: "Findings" },
  { key: "VERDICT", label: "Verdict" },
  { key: "SENTENCE", label: "Sentence" },
];

// Splits a judge's `verdict_text` into labeled sections for a friendlier layout.
// Matches each header on its own line, tolerating markdown emphasis / a trailing
// colon (e.g. "FINDINGS", "**FINDINGS:**"). Returns [] when the expected headers
// aren't found, so callers can fall back to rendering the raw text.
export function parseVerdict(text) {
  if (!text) return [];

  const keys = VERDICT_SECTIONS.map((s) => s.key).join("|");
  // Headers appear anywhere ("... stock. FINDINGS: The court ...") — the model
  // often emits the whole ruling on one line — so we match each label + colon
  // wherever it occurs rather than anchoring to line starts. Tolerates markdown
  // emphasis ("**VERDICT:**"). Case-sensitive (labels are upper-case) so body
  // prose never trips a match; any missing section is simply omitted.
  const headerPattern = new RegExp(`\\**\\s*(${keys})\\s*:\\s*\\**\\s*`, "g");

  const matches = [...text.matchAll(headerPattern)];

  if (!matches.length) return [];

  return matches.reduce((sections, match, i) => {
    const key = match[1].toUpperCase();
    const label = VERDICT_SECTIONS.find((s) => s.key === key)?.label ?? key;
    const start = match.index + match[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const body = text.slice(start, end).trim();

    if (body) sections.push({ label, body });
    
    return sections;
  }, []);
}
