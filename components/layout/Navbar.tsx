import Image from "next/image";
import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavedSearchesSheet } from "@/components/saved-searches/SavedSearchesSheet";

export function Navbar() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="/" className="shrink-0">
          <Image src="/logo.webp" alt="PropertyGenie" width={120} height={40} priority />
        </a>

        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-sm font-medium text-gray-600 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all"
          onClick={() => setSheetOpen(true)}
        >
          <Bookmark size={14} />
          <span className="hidden sm:inline">Saved Searches</span>
        </Button>
      </div>

      <SavedSearchesSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </header>
  );
}
