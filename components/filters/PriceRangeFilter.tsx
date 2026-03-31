"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

const MIN_PRICE = 0;
const MAX_PRICE = 5_000_000;

interface PriceRangeFilterProps {
  minPrice: number | null;
  maxPrice: number | null;
  onMinPriceChange: (v: number | null) => void;
  onMaxPriceChange: (v: number | null) => void;
}

export function PriceRangeFilter({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }: PriceRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [localMin, setLocalMin] = useState(minPrice ?? MIN_PRICE);
  const [localMax, setLocalMax] = useState(maxPrice ?? MAX_PRICE);
  const isActive = minPrice !== null || maxPrice !== null;

  useEffect(() => {
    setLocalMin(minPrice ?? MIN_PRICE);
    setLocalMax(maxPrice ?? MAX_PRICE);
  }, [minPrice, maxPrice]);

  const handleSliderChange = (values: number | readonly number[]) => {
    if (Array.isArray(values)) {
      setLocalMin((values as number[])[0]);
      setLocalMax((values as number[])[1]);
    }
  };

  const handleApply = () => {
    onMinPriceChange(localMin === MIN_PRICE ? null : localMin);
    onMaxPriceChange(localMax === MAX_PRICE ? null : localMax);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalMin(MIN_PRICE); setLocalMax(MAX_PRICE);
    onMinPriceChange(null); onMaxPriceChange(null);
    setOpen(false);
  };

  const label = isActive
    ? minPrice && maxPrice
      ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
      : minPrice ? `From ${formatPrice(minPrice)}` : `Up to ${formatPrice(maxPrice!)}`
    : "Price Range";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            className={cn(
              "inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border text-sm font-medium transition-all max-w-[220px] shrink-0",
              "bg-white text-gray-700 border-gray-200",
              "hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50",
              isActive && "border-indigo-200 border-l-4 border-l-indigo-600 text-indigo-600 bg-indigo-50"
            )}
          >
            <span className="truncate">{label}</span>
            <ChevronDown size={13} className="shrink-0 text-gray-400" />
          </button>
        }
      />
      <PopoverContent className="w-80 border-gray-200 shadow-lg" align="start">
        <div className="space-y-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Price Range</p>

          <Slider
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={50_000}
            value={[localMin, localMax]}
            onValueChange={handleSliderChange}
          />

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatPrice(localMin)}</span>
            <span>{formatPrice(localMax)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Min (RM)", val: localMin, min: MIN_PRICE, max: localMax, set: setLocalMin },
              { label: "Max (RM)", val: localMax, min: localMin,  max: MAX_PRICE, set: setLocalMax },
            ].map(({ label, val, min, max, set }) => (
              <div key={label}>
                <label className="text-xs text-gray-500 block mb-1">{label}</label>
                <input
                  type="number"
                  value={val}
                  min={min}
                  max={max}
                  step={50000}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!isNaN(v) && v >= min && v <= max) set(v);
                  }}
                  className="w-full h-8 px-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs text-gray-500 hover:text-gray-700" onClick={handleClear}>
              Clear
            </Button>
            <button
              onClick={handleApply}
              className="flex-1 h-8 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
