import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { SortOption } from "@/lib/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "createdAt",  label: "Default (Oldest First)" },
  { value: "-createdAt", label: "Newest First"                     },
  { value: "price",      label: "Price: Low to High"               },
  { value: "-price",     label: "Price: High to Low"               },
];

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const currentLabel = SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Sort by";

  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      {/* Render the human-readable label directly — bypasses Base UI SelectValue
          which can display the raw value string instead of the item label */}
      <SelectTrigger className="h-9 text-sm bg-white border-gray-200 text-gray-700 hover:border-gray-300 w-auto min-w-[172px]">
        <span className="flex flex-1 text-left text-sm truncate">{currentLabel}</span>
      </SelectTrigger>
      <SelectContent className="border-gray-200 shadow-lg">
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-gray-700 text-sm">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
