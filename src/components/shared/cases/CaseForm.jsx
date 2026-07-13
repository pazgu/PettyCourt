import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gavel, FolderPlus, Info, Loader2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { caseStore } from "../../../store/CaseStore";
import { CATEGORIES } from "../../../utils/categories";

export const CaseForm = observer(({ onSuccess }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await caseStore.submitCase();
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6 text-right" dir="ltr">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <FolderPlus className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          File a new case
        </h2>
        <p className="text-sm text-neutral-500">
          Two sides, one impartial(ish) judge. Make your case.
        </p>
      </div>

      <hr className="border-neutral-200" />

      {caseStore.error?.submit && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
          {caseStore.error.submit}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="text-sm font-medium text-neutral-700"
          >
            Case title
          </Label>
          <Input
            id="title"
            value={caseStore.title}
            onChange={(e) => caseStore.setField("title", e.target.value)}
            placeholder="My roommate ate my clearly labeled leftovers"
            className="focus-visible:ring-primary"
            disabled={caseStore.isSubmitting}
          />
          {caseStore.error?.title && (
            <p className="text-xs text-red-500 mt-1">{caseStore.error.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="category"
            className="text-sm font-medium text-neutral-700"
          >
            Category
          </Label>
          <Select
            value={caseStore.category}
            onValueChange={(value) => caseStore.setField("category", value)}
            disabled={caseStore.isSubmitting}
          >
            <SelectTrigger
              id="category"
              className="focus:ring-primary rounded-xl"
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="complaint"
            className="text-sm font-medium text-neutral-700"
          >
            The complaint
          </Label>
          <Textarea
            id="complaint"
            value={caseStore.complaint}
            onChange={(e) => caseStore.setField("complaint", e.target.value)}
            placeholder="State the facts of the case. The court values detail and drama in equal measure."
            className="min-h-[140px] resize-none focus-visible:ring-primary"
            disabled={caseStore.isSubmitting}
          />
          {caseStore.error?.complaint && (
            <p className="text-xs text-red-500 mt-1">
              {caseStore.error.complaint}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="defense"
            className="text-sm font-medium text-neutral-700"
          >
            The defense
          </Label>
          <Textarea
            id="defense"
            value={caseStore.defense}
            onChange={(e) => caseStore.setField("defense", e.target.value)}
            placeholder="Now argue the other side. Represent them fairly — the judge punishes strawman defenses."
            className="min-h-[140px] resize-none focus-visible:ring-primary"
            disabled={caseStore.isSubmitting}
          />
          {caseStore.error?.defense && (
            <p className="text-xs text-red-500 mt-1">
              {caseStore.error.defense}
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-neutral-400 flex items-center gap-1.5 justify-center">
        <Info className="h-4 w-4" /> You write both pleas; the judge rules on
        the arguments' merits.
      </p>

      <Button
        onClick={handleSubmit}
        disabled={caseStore.isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-base font-medium transition-colors flex items-center justify-center gap-2 rounded-xl cursor-pointer disabled:opacity-50"
      >
        {caseStore.isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting case...
          </>
        ) : (
          <>
            <Gavel className="h-5 w-5" />
            Submit to the court
          </>
        )}
      </Button>
    </div>
  );
});
