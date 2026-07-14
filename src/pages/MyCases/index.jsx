// User profile dashboard tracking authored lawsuits,
// active defenses, or bookmarked community jury decisions.
import { caseStore } from "@/store/CaseStore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Loader2, ChevronLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import AddCaseModal from "@/components/shared/cases/AddCaseModal";
import { authStore } from "@/store/AuthStore";
import { toast } from "@/hooks/useToast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const MyCasesPage = observer(() => {
  const navigate = useNavigate();
  const [pendingDeleteCase, setPendingDeleteCase] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    caseStore.loadMyCases().then((ok) => {
      if (ok === false)
        toast.error("Couldn't load your cases. Please try again.");
    });
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

  if (myCases.length === 0) {
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

          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 max-w-4xl mx-auto shadow-sm">
            <p className="text-slate-400 text-base font-medium">
              No cases found. ⚖️
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function handleDeleteCase() {
    if (!pendingDeleteCase) return;

    setDeleteError("");
    const success = await caseStore.deleteCase(pendingDeleteCase.id);

    if (success) {
      setPendingDeleteCase(null);
      toast.success("Case deleted successfully.");
    } else {
      setDeleteError("The case could not be deleted. Please try again.");
      toast.error("The case could not be deleted. Please try again.");
    }
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
          {myCases.map((myCase) => (
            <Card
              key={myCase.id}
              onClick={() => navigate(`/case/${myCase.id}`)}
              className="border-t-1 border-t-orange-600 shadow-sm bg-card glass-card rounded-xl overflow-hidden cursor-pointer hover:bg-slate-50 transition"
            >
              <CardContent className="p-5 pt-0 text-lg text-slate-600 leading-relaxed font-bold">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>{myCase.complaint}</div>

                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-700 border border-emerald-200 gap-1 rounded-full text-xs py-0.5 px-3 font-medium shrink-0"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {myCase.winner}
                    </Badge>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-2">
                    <div className="flex items-center gap-1 font-medium text-xs text-muted-foreground italic">
                      <span>{myCase.category}</span>
                      <span>•</span>
                      <span>
                        {new Date(myCase.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPendingDeleteCase(myCase);
                        setDeleteError("");
                      }}
                      aria-label={`Delete case ${myCase.complaint}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog
          open={!!pendingDeleteCase}
          onOpenChange={(open) => {
            if (!open) {
              setPendingDeleteCase(null);
              setDeleteError("");
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this case?</DialogTitle>
              <DialogDescription>
                This action will permanently remove the case from your docket. This cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {deleteError ? (
              <p className="text-sm text-destructive">{deleteError}</p>
            ) : null}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setPendingDeleteCase(null);
                  setDeleteError("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteCase}
                disabled={caseStore.isLoadingCase}
              >
                {caseStore.isLoadingCase ? "Deleting..." : "Delete case"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
});
