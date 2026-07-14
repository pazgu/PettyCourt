// Reusable UI card summarizing an active legal case.
// Features titles, dynamic status tags, and quick click-through navigation.

import { observer } from "mobx-react-lite";
import { caseStore } from "../../../store/CaseStore";
import { authStore } from "../../../store/AuthStore";
import {
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { CATEGORIES } from "../../../utils/categories";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export const CaseCard = observer(({ caseItem }) => {
  const isAuthenticated = !!authStore.user;
  const caseId = caseItem.id;

  useEffect(() => {
    if (caseId && !caseStore.votesCache[caseId]) {
      caseStore.loadVotesForCase(caseId);
    }
  }, [caseId]);

  const currentCategory = CATEGORIES.find((c) => c.id === caseItem.category);
  const categoryIcon = currentCategory ? currentCategory.icon : "⚖️";

  const voteData = caseStore.votesCache[caseId] || {
    justice: 0,
    mistrial: 0,
    userVote: null,
  };

  const totalVotes = voteData.justice + voteData.mistrial;
  const justicePercent =
    totalVotes > 0 ? (voteData.justice / totalVotes) * 100 : 50;

  const renderVerdictBadge = () => {
    if (totalVotes === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200">
          <HelpCircle className="h-3.5 w-3.5" />
          Awaiting Verdict
        </span>
      );
    }

    if (voteData.justice > voteData.mistrial) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200/60">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          Winner: plaintiff
        </span>
      );
    }

    if (voteData.mistrial > voteData.justice) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full text-xs font-bold border border-rose-200/60">
          <XCircle className="h-3.5 w-3.5 text-rose-600" />
          Ruled: Mistrial
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-200/60">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
        Ruled: Tie / Undecided
      </span>
    );
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Link
      to={`/case/${caseId}`}
      className=" block w-full max-w-4xl mx-auto bg-card balanced-card rounded-3xl border border-slate-100 shadow-[0_2px_14px_rgba(0,0,0,0.02)] p-6 sm:p-8 space-y-4 transition-all duration-300 cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
    >
      <div className="flex justify-between items-start gap-4">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight leading-snug">
          {caseItem.title}
        </h2>
        <span className="text-xs font-mono tracking-widest text-slate-400 font-medium shrink-0 pt-1">
          No. {String(caseId || "0417").slice(-4)}
        </span>
      </div>

      <div className="flex items-center gap-3 flex-wrap border-b border-slate-50 pb-3 m-0">
        {renderVerdictBadge()}

        <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200/60">
          <span>{categoryIcon}</span>
          {caseItem.category || "General"}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <div className="h-5 w-5 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase shrink-0 select-none">
          {caseItem.plaintiff_id?.username
            ? caseItem.plaintiff_id.username[0]
            : "A"}
        </div>

        <span className="text-xs font-medium text-slate-500 select-none">
          {" "}
          <span className="font-semibold text-slate-600">
            {caseItem.plaintiff_id?.username || "Anonymous"}
          </span>
        </span>
        <span className="text-xs font-medium text-slate-500 select-none ml-3">
          {new Date(caseItem.created_at).toLocaleDateString("en-US")}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="bg-orange-50/60 rounded-2xl p-4 border border-orange-200/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Complaint (Plaintiff)
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
            {truncateText(caseItem.complaint)}
          </p>
        </div>

        <div className="bg-orange-50/60 rounded-2xl p-4 border border-orange-200/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Defense
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
            {truncateText(caseItem.defense)}
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2" onClick={(e) => e.preventDefault()}>
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={!isAuthenticated}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              caseStore.vote(caseId, "justice");
            }}
            className={`flex items-center gap-1.5 font-semibold text-sm shrink-0 select-none p-2 rounded-xl transition-all ${
              !isAuthenticated
                ? "text-slate-300 cursor-not-allowed opacity-60"
                : voteData.userVote === "justice"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm cursor-pointer"
                  : "text-emerald-600 hover:bg-emerald-50 active:scale-95 cursor-pointer"
            }`}
          >
            <ThumbsUp
              className={`h-4 w-4 stroke-[2.5] ${voteData.userVote === "justice" ? "fill-emerald-600 text-emerald-700" : "text-emerald-600"}`}
            />
            <span>{voteData.justice}</span>
          </button>

          <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 rounded-l-full transition-all duration-500 ease-out"
              style={{ width: `${justicePercent}%` }}
            />
          </div>

          <button
            type="button"
            disabled={!isAuthenticated}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              caseStore.vote(caseId, "mistrial");
            }}
            className={`flex items-center gap-1.5 font-semibold text-sm shrink-0 select-none p-2 rounded-xl transition-all ${
              !isAuthenticated
                ? "text-slate-300 cursor-not-allowed opacity-60"
                : voteData.userVote === "mistrial"
                  ? "bg-rose-100 text-rose-800 border border-rose-300 shadow-sm cursor-pointer"
                  : "text-rose-500 hover:bg-rose-50 active:scale-95 cursor-pointer"
            }`}
          >
            <ThumbsDown
              className={`h-4 w-4 stroke-[2.5] ${voteData.userVote === "mistrial" ? "fill-rose-500 text-rose-700" : "text-rose-600"}`}
            />
            <span>{voteData.mistrial}</span>
          </button>
        </div>
      </div>
    </Link>
  );
});
