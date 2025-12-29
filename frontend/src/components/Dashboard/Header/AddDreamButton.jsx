import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState, Suspense, lazy } from "react";
import OverlayLoader from "../../loaders/OverlayLoader";

const DreamForm = lazy(() => import("../../DreamForm"));

export default function AddDreamButton() {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full h-full gap-2 shadow-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition"
          onClick={() => setFormOpen(true)}
        >
          <PlusCircle className="w-5 h-5" />
          Add Dream
        </Button>
      </DialogTrigger>
      {formOpen && (
        <Suspense fallback={<OverlayLoader />}>
          <DreamForm onClose={() => setFormOpen(false)} />
        </Suspense>
      )}
    </Dialog>
  );
}
