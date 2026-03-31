import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { MapPin, Bed, Bath, SquareStack, Heart, Calendar, Sofa, Eye } from "lucide-react";
import { cn, formatPrice, formatArea } from "@/lib/utils";
import type { PropertyListing } from "@/lib/types";

function whatsappUrl(phone: string, agentName: string, propertyName: string): string {
  const normalized = phone.replace(/\D/g, "");
  const intl = normalized.startsWith("0") ? "60" + normalized.slice(1) : normalized;
  const message = `Hi ${agentName},\nIm interest to know more about this property : ${propertyName}\nThank you!`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface PropertyCardProps {
  property: PropertyListing;
  index?: number;
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

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PropertyCard({ property, index = 99 }: PropertyCardProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [imgError, setImgError] = useState(false);
  const typeColor = TYPE_COLORS[property.type] ?? "bg-gray-100 text-gray-700";
  const isPriority = index < 3;

  return (
    <article
      onClick={() => router.push(`/properties/${property.id}`)}
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
        {imgError ? (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        ) : (
          <Image
            src={property.image}
            alt={property.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={isPriority}
            loading={isPriority ? "eager" : "lazy"}
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        <span className={cn("absolute top-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize tracking-wide", typeColor)}>
          {property.type}
        </span>
        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-black/50 text-white backdrop-blur-sm">
          {property.section}
        </span>

        {/* Bookmark — stopPropagation so it doesn't trigger card navigation */}
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
      <div className="flex flex-col flex-1 p-4 gap-2">
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

        {property.address && (
          <p className="text-xs text-gray-400 truncate pl-[17px]">{property.address}</p>
        )}

        {property.furnishings && (
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-medium capitalize">
              <Sofa size={10} />
              {property.furnishings}
            </span>
          </div>
        )}

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

        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <Calendar size={10} className="shrink-0" />
          <span>Listed {formatShortDate(property.createdAt)}</span>
        </div>
      </div>

      {/* ── Blue agent footer ────────────────────────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-500"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              {property.account.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
            </div>
            <span className="text-white text-xs font-medium truncate">{property.account.name}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={whatsappUrl(property.account.phone, property.account.name, property.name)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-colors"
              aria-label="WhatsApp agent"
            >
              <WhatsAppIcon size={14} />
            </a>
            <Link
              href={`/agents/${property.account.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-colors"
              aria-label="View agent listings"
            >
              <Eye size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
