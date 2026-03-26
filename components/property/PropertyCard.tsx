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
        "shadow-[0_1px_4px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]",
        "hover:shadow-[0_12px_32px_rgba(79,70,229,0.12),0_2px_8px_rgba(0,0,0,0.06)]",
        "border border-gray-100",
        "transition-all duration-300 ease-out hover:-translate-y-1.5",
        "cursor-pointer"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={property.image}
          alt={property.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* Type badge */}
        <span className={cn("absolute top-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize tracking-wide", typeColor)}>
          {property.type}
        </span>

        {/* Section badge */}
        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-black/40 text-white backdrop-blur-sm">
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

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-xl font-bold text-gray-900 leading-tight tracking-tight">
          {formatPrice(property.price)}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
          {property.name}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <MapPin size={12} className="shrink-0 text-indigo-500" />
          <span className="truncate">{property.city}, {property.state}</span>
        </div>

        <div className="border-t border-gray-100 mt-auto pt-3">
          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <span className="flex items-center gap-1.5">
              <Bed size={13} className="shrink-0 text-gray-400" />
              <span className="font-medium text-gray-700">{property.bedRooms}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Bath size={13} className="shrink-0 text-gray-400" />
              <span className="font-medium text-gray-700">{property.bathRooms}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <SquareStack size={13} className="shrink-0 text-gray-400" />
              <span className="font-medium text-gray-700">{formatArea(property.floorSize)}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
