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
import { Gavel, FolderPlus } from "lucide-react";

export function CaseForm() {
  return (
    <div className="space-y-6 text-right">
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
            placeholder="My roommate ate my clearly labeled leftovers"
            className="focus-visible:ring-orange-500"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="category"
            className="text-sm font-medium text-neutral-700"
          >
            Category
          </Label>
          <Select>
            <SelectTrigger id="category" className="focus:ring-orange-500">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">Food crimes</SelectItem>
              <SelectItem value="romance">Romantic disputes</SelectItem>
              <SelectItem value="cleanliness">Roommate hygiene</SelectItem>
              <SelectItem value="other">Other petty business</SelectItem>
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
            placeholder="State the facts of the case. The court values detail and drama in equal measure."
            className="min-h-[100px] resize-none focus-visible:ring-orange-500"
          />
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
            placeholder="Now argue the other side. Represent them fairly — the judge punishes strawman defenses."
            className="min-h-[100px] resize-none focus-visible:ring-orange-500"
          />
        </div>
      </div>

      <p className="text-xs text-neutral-400 flex items-center gap-1.5 justify-center">
        <span>ⓘ</span> You write both pleas; the judge rules on the arguments'
        merits.
      </p>

      <Button className="w-full bg-[#D94414] hover:bg-[#BF3A0F] text-white py-6 text-base font-medium transition-colors flex items-center justify-center gap-2 rounded-xl cursor-pointer">
        <Gavel className="h-5 w-5" />
        Submit to the court
      </Button>
    </div>
  );
}
