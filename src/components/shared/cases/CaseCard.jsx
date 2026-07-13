// Reusable UI card summarizing an active legal case.
// Features titles, dynamic status tags, and quick click-through navigation.

import { observer } from "mobx-react-lite";
import { caseStore } from "../../../store/CaseStore";
import { ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import { CATEGORIES } from "../../../utils/categories";

export const CaseCard = observer(({ caseItem }) => {
  const currentCategory = CATEGORIES.find((c) => c.id === caseItem.category);
  const categoryIcon = currentCategory ? currentCategory.icon : "⚖️";

  const votes = caseStore.caseVotes?.get(caseItem.id) || {
    justice: 0,
    mistrial: 0,
  };
  const totalVotes = (votes.justice || 0) + (votes.mistrial || 0);

  const justicePercent =
    totalVotes > 0 ? (votes.justice / totalVotes) * 100 : 50;

  let verdictText = "Awaiting verdict";
  if (totalVotes > 0) {
    verdictText =
      votes.justice >= votes.mistrial
        ? "Ruled for the plaintiff"
        : "Ruled a mistrial";
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-[0_2px_14px_rgba(0,0,0,0.02)] p-6 sm:p-8 space-y-5 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight leading-snug">
        {caseItem.title || 'He "borrowed" my charger 3 weeks ago'}
      </h2>
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-50 pb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-100/50">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Verdict delivered
          </span>

          <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-slate-200/60">
            <span>{categoryIcon}</span>
            {caseItem.category || "General"}
          </span>
        </div>

        <span className="text-xs font-mono tracking-widest text-slate-400 font-medium">
          No. {String(caseItem.id || "0417").slice(-4)}
        </span>
      </div>

      <p className="text-sm sm:text-base text-slate-500/90 leading-relaxed font-normal">
        {caseItem.complaint ||
          'Defendant cites "communal electronics." Plaintiff produced a receipt and a phone at 3%.'}
      </p>

      <div className="space-y-2.5 pt-2">
        <p className="text-sm font-serif italic font-medium text-slate-700">
          {verdictText}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm shrink-0 select-none">
            <ThumbsUp className="h-4 w-4 stroke-[2.5]" />
            <span>{votes.justice}</span>
          </div>

          <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 rounded-l-full transition-all duration-500 ease-out"
              style={{ width: `${justicePercent}%` }}
            />
          </div>

          <div className="flex items-center gap-1 text-rose-500 font-semibold text-sm shrink-0 select-none">
            <ThumbsDown className="h-4 w-4 stroke-[2.5]" />
            <span>{votes.mistrial}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
