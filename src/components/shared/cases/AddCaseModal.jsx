import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CaseForm } from "./CaseForm";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AddCaseModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90 text-white gap-2 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        New Case
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[750px] w-[95vw] max-h-[90vh] overflow-y-auto p-8 rounded-2xl bg-white">
          <CaseForm onSuccess={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
