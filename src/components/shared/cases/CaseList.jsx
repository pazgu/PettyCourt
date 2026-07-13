import { observer } from "mobx-react-lite";
import { caseStore } from "../../../store/CaseStore";
import { CaseCard } from "./CaseCard";

export const CaseList = observer(() => {
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
    </div>
  );
});
