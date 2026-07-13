import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { caseStore } from "../../store/CaseStore";
import { authStore } from "../../store/AuthStore";

export const VoteButtons = observer(({ caseId }) => {
  const isAuthenticated = !!authStore.user;

  useEffect(() => {
    if (!caseStore.votesCache[caseId]) {
      caseStore.loadVotesForCase(caseId);
    }
  }, [caseId]);

  const voteData = caseStore.votesCache[caseId] || {
    justice: 0,
    mistrial: 0,
    userVote: null,
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        disabled={!isAuthenticated}
        onClick={(e) => {
          e.stopPropagation();
          caseStore.vote(caseId, "justice");
        }}
        className={`border rounded-xl text-sm font-medium px-4 py-2 gap-2 transition-all duration-200 ${
          !isAuthenticated ? "cursor-not-allowed opacity-70" : "cursor-pointer"
        } ${
          voteData.userVote === "justice"
            ? "bg-emerald-100 border-emerald-400 text-emerald-800 hover:bg-emerald-200"
            : "bg-emerald-50/40 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        }`}
      >
        <ThumbsUp
          className={`h-4 w-4 ${voteData.userVote === "justice" ? "fill-emerald-600 text-emerald-700" : "text-emerald-600"}`}
        />
        <span>Justice Served ({voteData.justice})</span>
      </Button>

      <Button
        variant="outline"
        disabled={!isAuthenticated}
        onClick={(e) => {
          e.stopPropagation();
          caseStore.vote(caseId, "mistrial");
        }}
        className={`border rounded-xl text-sm font-medium px-4 py-2 gap-2 transition-all duration-200 ${
          !isAuthenticated ? "cursor-not-allowed opacity-70" : "cursor-pointer"
        } ${
          voteData.userVote === "mistrial"
            ? "bg-rose-100 border-rose-400 text-rose-800 hover:bg-rose-200"
            : "bg-rose-50/40 border-rose-200 text-rose-700 hover:bg-rose-50"
        }`}
      >
        <ThumbsDown
          className={`h-4 w-4 ${voteData.userVote === "mistrial" ? "fill-rose-600 text-rose-700" : "text-rose-600"}`}
        />
        <span>Mistrial ({voteData.mistrial})</span>
      </Button>
    </div>
  );
});
