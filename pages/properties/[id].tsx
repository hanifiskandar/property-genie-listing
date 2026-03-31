import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { MapPin, Bed, Bath, SquareStack, Phone, Mail, ArrowLeft, Calendar, Eye } from "lucide-react";

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

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { propertyCache } from "@/lib/propertyCache";
import { findPropertyById } from "@/lib/api";
import { formatPrice, formatArea, cn } from "@/lib/utils";
import type { PropertyDetail } from "@/lib/types";

const PropertyMap = dynamic(() => import("@/components/property/PropertyMap"), { ssr: false });


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

function formatListedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PropertyDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;

    // 1. Try the in-memory cache first (populated when listing page was visited)
    const cached = propertyCache.get(id);
    if (cached) {
      setProperty(cached as PropertyDetail);
      return;
    }

    // 2. Fall back: paginate through the list API to find the property
    findPropertyById(id)
      .then((p) => {
        setProperty(p);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load property.");
      });
  }, [id]);

  if (!router.isReady || (!property && !error)) {
    return (
      <>
        <Head><title>Loading… — PropertyGenie</title></Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Navbar />
          <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-20">
            <div className="animate-pulse space-y-6">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="aspect-[16/7] w-full bg-gray-200 rounded-2xl" />
              <div className="flex gap-8">
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
                <div className="w-80 h-48 bg-gray-200 rounded-2xl" />
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Head><title>Property Not Found — PropertyGenie</title></Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Navbar />
          <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-20 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Property not found</h1>
            <p className="text-gray-500 mb-6">{error ?? "This property may no longer be available."}</p>
            <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
              <ArrowLeft size={16} /> Back to listings
            </Link>
          </main>
        </div>
      </>
    );
  }

  const typeColor = TYPE_COLORS[property.type] ?? "bg-gray-100 text-gray-700";
  const hasCoords = property.coordinates?.latitude && property.coordinates?.longitude;

  return (
    <>
      <Head>
        <title>{property.name} — PropertyGenie</title>
        <meta
          name="description"
          content={`${property.name} for ${property.section} at ${formatPrice(property.price)} in ${property.city}, ${property.state}.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />

        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-8">

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={15} /> Back to listings
          </button>

          {/* ── Hero image ────────────────────────────────────────────── */}
          <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden bg-gray-200 shadow-md">
            {imgError ? (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            ) : (
              <Image
                src={property.image}
                alt={property.name}
                fill
                sizes="100vw"
                className="object-cover"
                priority
                onError={() => setImgError(true)}
              />
            )}
          </div>

          {/* ── Two-column layout ─────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left column — property details */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Title + badges */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize", typeColor)}>
                    {property.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-indigo-600 text-white">
                    For {property.section}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
                <p className="text-3xl font-bold text-indigo-600">{formatPrice(property.price)}</p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} className="text-indigo-500 shrink-0" />
                <span>{property.address}, {property.city}, {property.state} {property.postcode}</span>
              </div>

              {/* Specs row */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm">
                  <Bed size={15} className="text-gray-500" />
                  <span className="font-semibold text-gray-800">{property.bedRooms}</span>
                  <span className="text-gray-500">Beds</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm">
                  <Bath size={15} className="text-gray-500" />
                  <span className="font-semibold text-gray-800">{property.bathRooms}</span>
                  <span className="text-gray-500">Baths</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm">
                  <SquareStack size={15} className="text-gray-500" />
                  <span className="font-semibold text-gray-800">{formatArea(property.floorSize)}</span>
                </div>
                {property.furnishings && (
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm">
                    <span className="font-semibold text-gray-800 capitalize">{property.furnishings}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800">Description</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {/* Listed date */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={14} />
                <span>Listed on {formatListedDate(property.createdAt)}</span>
              </div>
            </div>

            {/* Right column — agent card */}
            <div className="w-full lg:w-80 shrink-0 sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 space-y-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Listed by</h2>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl shrink-0">
                    {property.account.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{property.account.name}</p>
                    <p className="text-xs text-gray-500 truncate">{property.account.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <a
                    href={`tel:${property.account.phone}`}
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    {property.account.phone}
                  </a>
                  <a
                    href={`mailto:${property.account.email}`}
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{property.account.email}</span>
                  </a>
                </div>

                <div className="flex gap-2">
                  <a
                    href={whatsappUrl(property.account.phone, property.account.name, property.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
                  >
                    <WhatsAppIcon size={16} />
                    WhatsApp
                  </a>
                  <Link
                    href={`/agents/${property.account.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    <Eye size={16} />
                    Listings
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Map ───────────────────────────────────────────────────── */}
          {hasCoords && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Location</h2>
              <div className="rounded-2xl overflow-hidden shadow-md">
                <PropertyMap
                  latitude={property.coordinates.latitude}
                  longitude={property.coordinates.longitude}
                  title={property.name}
                  price={property.price}
                />
              </div>
            </div>
          )}

        </main>

        <Footer />
      </div>
    </>
  );
}
