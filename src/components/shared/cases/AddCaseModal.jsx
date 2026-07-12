import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CaseForm } from "./CaseForm";
import { Plus } from "lucide-react";

export default function AddCaseModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#D94414] hover:bg-[#BF3A0F] text-white gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          File New Case
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[750px] w-[95vw] max-h-[90vh] overflow-y-auto p-8 rounded-2xl bg-white">
        <CaseForm />
      </DialogContent>
    </Dialog>
  );
}
