import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { caseStore } from "../../store/CaseStore";
import { ChevronLeft, Gavel, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VoteButtons } from "../../components/shared/VoteButtons";
import { cn } from "@/lib/utils";
import { parseVerdict } from "../../utils/formatters";

export const CaseDetailsPage = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      caseStore.loadCaseById(id);
    }
  }, [id]);

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

  const activeCase = caseStore.currentCase;

  if (!activeCase) {
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

  const verdict = caseStore.currentVerdict;
  const verdictSections = verdict ? parseVerdict(verdict.verdict_text) : [];

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

        <div className="space-y-3">
          <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
            CASE No. {activeCase.id ? activeCase.id.slice(0, 8) : ""}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight⚓">
            {activeCase.title}
          </h1>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 border border-emerald-200 gap-1 rounded-full text-xs py-0.5 px-3 font-medium"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {activeCase.status}
            </Badge>
            {activeCase.category && (
              <Badge
                variant="outline"
                className="bg-orange-50/60 text-orange-700 border-orange-200 rounded-full text-xs py-0.5 px-3"
              >
                {activeCase.category}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-t-4 border-t-orange-600 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-start space-x-4 space-y-0 p-5 pb-3">
              <Avatar className="h-10 w-10 bg-orange-600 text-white font-bold">
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold font-mono tracking-wider text-orange-600 uppercase block">
                  PLAINTIFF
                </span>
                <span className="font-semibold text-sm text-slate-800">
                  Filer
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-sm text-slate-600 leading-relaxed font-normal">
              {activeCase.complaint}
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-indigo-400 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-start space-x-4 space-y-0 p-5 pb-3">
              <Avatar className="h-10 w-10 bg-slate-200 text-slate-600 font-bold border border-slate-300">
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase block">
                  THE DEFENSE
                </span>
                <span className="font-medium text-xs text-muted-foreground italic block">
                  {activeCase.defendant_email
                    ? `Respondent: ${activeCase.defendant_email}`
                    : "The Filer's Perspective"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-sm text-slate-600 leading-relaxed font-normal">
              {activeCase.defense ||
                "No formal defense submitted yet. Relying on court investigation."}
            </CardContent>
          </Card>
        </div>

        <Card className="border border-amber-200/80 bg-[#fdfbf7] shadow-md rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 border-[6px] border-amber-800/5 m-2 pointer-events-none rounded-xl" />

          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 border border-amber-200 shadow-inner">
              <Gavel className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold tracking-widest text-amber-800/80 font-mono uppercase">
                COURT OF PETTY DISPUTES
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800">
                Verdict of the Court of Petty Disputes
              </h2>
              <p className="text-xs italic text-muted-foreground font-serif">
                In the matter of the filed dispute · No.{" "}
                {activeCase.id ? activeCase.id.slice(0, 8) : ""}
              </p>
            </div>

            <hr className="w-full border-t border-amber-200/80 my-2" />

            {verdict ? (
              <>
                {verdictSections.length ? (
                  <div className="w-full text-left space-y-4 font-serif text-slate-700 text-sm sm:text-base leading-relaxed px-2 sm:px-6">
                    {verdictSections.map((section) => (
                      <div key={section.label}>
                        <strong className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 block mb-1">
                          {section.label}
                        </strong>
                        <p className="whitespace-pre-line">{section.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full text-left font-serif text-slate-700 text-sm sm:text-base leading-relaxed px-2 sm:px-6 whitespace-pre-line">
                    {verdict.verdict_text}
                  </div>
                )}

                <div className="w-full pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground px-2 sm:px-6">
                  <Badge
                    className={cn(
                      "font-sans font-semibold border rounded-md px-2 py-0.5 capitalize",
                      verdict.winner === "split"
                        ? "bg-yellow-100 hover:bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-emerald-100 hover:bg-emerald-100 text-emerald-800 border-emerald-200",
                    )}
                  >
                    Winner: {verdict.winner}
                  </Badge>
                  <span className="italic font-serif text-slate-500">
                    Ruled {new Date(verdict.created_at).toLocaleDateString()}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground font-serif italic py-4">
                The court has not yet ruled on this matter.
              </p>
            )}
          </div>
        </Card>

        <Card className="shadow-sm bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-base font-medium text-slate-800 font-sans">
              Was justice served?
            </span>
            <VoteButtons caseId={activeCase.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
