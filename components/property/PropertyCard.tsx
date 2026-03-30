import Image from "next/image";
import { useState } from "react";
import { MapPin, Bed, Bath, SquareStack, Heart } from "lucide-react";
import { cn, formatPrice, formatArea } from "@/lib/utils";
import type { PropertyListing } from "@/lib/types";

interface PropertyCardProps {
  property: PropertyListing;
}

const TYPE_COLORS: Record<string, string> = {
  penthouse:       "bg-violet-100 text-violet-700",
  condo:           "bg-sky-100 text-sky-700",
  apartment:       "bg-blue-100 text-blue-700",
  bungalow:        "bg-amber-100 text-amber-700",
  townhouse:       "bg-orange-100 text-orange-700",
  terrace:         "bg-lime-100 text-lime-700",
  "semi-detached": "bg-indigo-100 text-indigo-700",
  flat:            "bg-cyan-100 text-cyan-700",
  room:            "bg-pink-100 text-pink-700",
};

export function PropertyCard({ property }: PropertyCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const typeColor = TYPE_COLORS[property.type] ?? "bg-gray-100 text-gray-700";

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl overflow-hidden",
        "border-t-2 border-t-indigo-600 border border-gray-100",
        "shadow-md hover:shadow-xl",
        "transition-all duration-300 ease-out hover:-translate-y-1",
        "cursor-pointer"
      )}
    >
      {/* ── Image ───────────────────────────────────────────────────── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={property.image}
          alt={property.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient — heavier at the bottom for badge legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        {/* Type badge */}
        <span className={cn("absolute top-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize tracking-wide", typeColor)}>
          {property.type}
        </span>

        {/* Section badge */}
        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-black/50 text-white backdrop-blur-sm">
          {property.section}
        </span>

        {/* Bookmark */}
        <button
          onClick={(e) => { e.stopPropagation(); setBookmarked((v) => !v); }}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark property"}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center",
            "bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-110",
            bookmarked ? "text-rose-500" : "text-gray-500 hover:text-rose-400"
          )}
        >
          <Heart size={15} className={cn(bookmarked && "fill-rose-500")} />
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <p className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
          {formatPrice(property.price)}
        </p>
        <h3 className="text-base font-semibold text-gray-800 leading-snug line-clamp-2">
          {property.name}
        </h3>
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <MapPin size={12} className="shrink-0 text-indigo-500" />
          <span className="truncate">{property.city}, {property.state}</span>
        </div>

        {/* Stats row */}
        <div className="mt-auto bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-gray-600">
            <Bed size={13} className="text-gray-400" />
            <span className="font-semibold text-gray-700">{property.bedRooms}</span>
            <span className="text-gray-400">bed</span>
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="flex items-center gap-1.5 text-gray-600">
            <Bath size={13} className="text-gray-400" />
            <span className="font-semibold text-gray-700">{property.bathRooms}</span>
            <span className="text-gray-400">bath</span>
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="flex items-center gap-1.5 text-gray-600">
            <SquareStack size={13} className="text-gray-400" />
            <span className="font-semibold text-gray-700">{formatArea(property.floorSize)}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
