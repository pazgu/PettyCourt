// Main dashboard page showcasing public court feeds,
// case discovery, global keyword search, and structural filters.

import { useEffect } from "react";
import { CaseFilters } from "../../components/shared/caseFilters";
import { CaseList } from "../../components/shared/cases/CaseList";
import { caseStore } from "../../store/CaseStore";
import { toast } from "@/hooks/useToast";

export const HomePage = () => {
  useEffect(() => {
    caseStore.loadAllCases().then((ok) => {
      if (ok === false) toast.error("Couldn't load cases. Please try again.");
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <CaseFilters />
        <CaseList />
      </div>
    </div>
  );
};
