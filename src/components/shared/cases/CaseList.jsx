import { observer } from "mobx-react-lite";
import { caseStore } from "../../../store/CaseStore";
import { CaseCard } from "./CaseCard";
import { useEffect } from "react";

export const CaseList = observer(() => {
  useEffect(() => {
    caseStore.resetPagination();
    caseStore.loadAllCases();
  }, []);

  const cases = caseStore.filteredCases;

  if (cases.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 max-w-4xl mx-auto shadow-sm">
        <p className="text-slate-400 text-base font-medium">
          No cases found matching your criteria. ⚖️
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-sm font-normal text-slate-500 px-2 select-none">
        Showing{" "}
        <span className="font-semibold text-slate-800">{cases.length}</span> of{" "}
        <span className="font-semibold text-slate-800">
          {caseStore.cases.length}
        </span>{" "}
        cases
      </div>

      <div className="space-y-6">
        {cases.map((caseItem) => (
          <CaseCard key={caseItem.id} caseItem={caseItem} />
        ))}
      </div>

      {caseStore.hasMoreCases && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => caseStore.nextPage()}
            disabled={caseStore.isLoadingCases}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {caseStore.isLoadingCases ? "Loading..." : "Load More Cases"}
          </button>
        </div>
      )}
    </div>
  );
});
