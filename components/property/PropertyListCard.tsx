import Image from "next/image";
import { useState } from "react";
import { MapPin, Bed, Bath, SquareStack, Heart, ArrowRight } from "lucide-react";
import { cn, formatPrice, formatArea } from "@/lib/utils";
import type { PropertyListing } from "@/lib/types";

interface PropertyListCardProps {
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

export function PropertyListCard({ property }: PropertyListCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const typeColor = TYPE_COLORS[property.type] ?? "bg-gray-100 text-gray-700";

  return (
    <article
      className={cn(
        "group relative flex bg-white rounded-2xl overflow-hidden",
        "border-l-4 border-l-indigo-600 border border-gray-100",
        "shadow-md hover:shadow-xl",
        "transition-all duration-300 ease-out hover:-translate-y-0.5",
        "cursor-pointer h-[180px]"
      )}
    >
      {/* ── Image — fixed 280px wide ─────────────────────────────────── */}
      <div className="relative w-[280px] shrink-0 overflow-hidden bg-gray-100">
        <Image
          src={property.image}
          alt={property.name}
          fill
          sizes="280px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />

        {/* Type badge */}
        <span className={cn("absolute top-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize tracking-wide", typeColor)}>
          {property.type}
        </span>

        {/* Section badge */}
        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-black/50 text-white backdrop-blur-sm">
          {property.section}
        </span>
      </div>

      {/* ── Details ──────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 px-5 py-4">
        {/* Top row: price + bookmark */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-xl font-bold text-gray-900 leading-tight tracking-tight">
            {formatPrice(property.price)}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); setBookmarked((v) => !v); }}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark property"}
            className={cn(
              "shrink-0 w-7 h-7 rounded-full flex items-center justify-center",
              "bg-gray-100 transition-all duration-200 hover:scale-110",
              bookmarked ? "text-rose-500" : "text-gray-400 hover:text-rose-400"
            )}
          >
            <Heart size={14} className={cn(bookmarked && "fill-rose-500")} />
          </button>
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-1 mt-1">
          {property.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
          <MapPin size={12} className="shrink-0 text-indigo-500" />
          <span className="truncate">{property.city}, {property.state}</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom row: stats + view details */}
        <div className="flex items-center justify-between gap-3">
          <div className="bg-gray-50 rounded-lg px-3 py-1.5 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-gray-600">
              <Bed size={12} className="text-gray-400" />
              <span className="font-semibold text-gray-700">{property.bedRooms}</span>
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1 text-gray-600">
              <Bath size={12} className="text-gray-400" />
              <span className="font-semibold text-gray-700">{property.bathRooms}</span>
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1 text-gray-600">
              <SquareStack size={12} className="text-gray-400" />
              <span className="font-semibold text-gray-700">{formatArea(property.floorSize)}</span>
            </span>
          </div>

          <button className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors">
            View Details
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </article>
  );
}
