"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "residential", label: "Residential" },
  { value: "commercial",  label: "Commercial"  },
  { value: "industrial",  label: "Industrial"  },
];

const TYPES = [
  { value: "apartment",      label: "Apartment"     },
  { value: "condo",          label: "Condo"          },
  { value: "flat",           label: "Flat"           },
  { value: "room",           label: "Room"           },
  { value: "penthouse",      label: "Penthouse"      },
  { value: "townhouse",      label: "Townhouse"      },
  { value: "bungalow",       label: "Bungalow"       },
  { value: "semi-detached",  label: "Semi-Detached"  },
  { value: "terrace",        label: "Terrace"        },
];

interface PropertyTypeFilterProps {
  categories: string[];
  types: string[];
  onCategoriesChange: (v: string[]) => void;
  onTypesChange: (v: string[]) => void;
}

function toggle(arr: string[], val: string) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

export function PropertyTypeFilter({ categories, types, onCategoriesChange, onTypesChange }: PropertyTypeFilterProps) {
  const [open, setOpen] = useState(false);
  const count = categories.length + types.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            className={cn(
              "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-medium transition-all",
              "bg-white text-gray-700 border-gray-200",
              "hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50",
              count > 0 && "border-indigo-500 text-indigo-600 bg-indigo-50"
            )}
          >
            <span>Property Type</span>
            {count > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
            <ChevronDown size={13} className="text-gray-400" />
          </button>
        }
      />
      <PopoverContent className="w-72 border-gray-200 shadow-lg" align="start">
        <div className="space-y-3">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Category</p>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => (
                <label key={cat.value} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                  <Checkbox
                    checked={categories.includes(cat.value)}
                    onCheckedChange={() => onCategoriesChange(toggle(categories, cat.value))}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Type</p>
            <div className="grid grid-cols-2 gap-1">
              {TYPES.map((type) => (
                <label key={type.value} className="flex items-center gap-2 cursor-pointer group py-0.5">
                  <Checkbox
                    checked={types.includes(type.value)}
                    onCheckedChange={() => onTypesChange(toggle(types, type.value))}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-400 hover:text-gray-700 text-xs h-7"
              onClick={() => { onCategoriesChange([]); onTypesChange([]); }}
            >
              Clear selection
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
