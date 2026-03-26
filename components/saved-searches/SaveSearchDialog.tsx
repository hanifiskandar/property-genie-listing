import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import type { FilterState, SortOption } from "@/lib/types";

interface SaveSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  sort: SortOption;
}

export function SaveSearchDialog({
  open,
  onOpenChange,
  filters,
  sort,
}: SaveSearchDialogProps) {
  const [name, setName] = useState("");
  const { save } = useSavedSearches();

  const handleSave = () => {
    save(name || "My Search", filters, sort);
    setName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Save Search</DialogTitle>
          <DialogDescription>
            Give this search a name so you can quickly apply it later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. KL Condos under RM 1M"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />

          <div className="flex gap-2 pt-1">
            <DialogClose
              render={
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              }
            />
            <Button className="flex-1" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
