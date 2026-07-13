// User profile dashboard tracking authored lawsuits,
// active defenses, or bookmarked community jury decisions.
import { caseStore } from "@/store/CaseStore";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import AddCaseModal from "@/components/shared/cases/AddCaseModal";
import { authStore } from "@/store/AuthStore";

export const MyCasesPage = observer(() => {
  const navigate = useNavigate();
  useEffect(() => {
    caseStore.loadMyCases();
  }, [authStore.user]);

  if (caseStore.isLoadingCase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Summoning case files from the archive...
          </p>
        </div>
      </div>
    );
  }

  const myCases = caseStore.myCases;

  if (!myCases) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          Case file not found or has been shredded.
        </p>
        <Button onClick={() => navigate("/")} variant="outline">
          Return to The Grand Hall
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors gap-1 cursor-pointer group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to The Grand Hall
        </button>
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-red-600" />

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
            My Cases
          </h1>

          <div className="ml-auto">
            <AddCaseModal />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {myCases.map((c) => (
            <Card
              key={c.id}
              className="border-t-1 border-t-orange-600 shadow-sm bg-white rounded-xl overflow-hidden"
            >
              <CardContent className="p-5 pt-0 text-lg text-slate-600 leading-relaxed font-bold">
                <div className="flex">
                  <div>
                    <div>{c.complaint}</div>

                    <div className="flex items-center gap-1 font-medium text-xs text-muted-foreground italic">
                      <span>{c.category}</span>
                      <span>•</span>
                      <span>
                        {new Date(c.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1 ml-auto">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-700 border border-emerald-200 gap-1 rounded-full text-xs py-0.5 px-3 font-medium"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {c.winner}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
});
