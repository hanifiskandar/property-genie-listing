import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Phone, Mail, ArrowLeft, Building2 } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { propertyCache } from "@/lib/propertyCache";
import { findPropertiesByAgent } from "@/lib/api";
import type { PropertyListing } from "@/lib/types";

function AgentInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl shrink-0">
      {initials}
    </div>
  );
}

export default function AgentPage() {
  const router = useRouter();
  const agentId = typeof router.query.agentId === "string" ? router.query.agentId : "";

  const [items, setItems] = useState<PropertyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) return;
    setIsLoading(true);
    setError(null);

    findPropertiesByAgent(agentId)
      .then((results) => {
        // Also seed the main cache with these results
        propertyCache.set(results);
        setItems(results);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load listings.");
      })
      .finally(() => setIsLoading(false));
  }, [agentId]);

  const agent = items[0]?.account;
  const agentName = agent?.name ?? "";
  const agentEmail = agent?.email ?? "";
  const agentPhone = agent?.phone ?? "";

  return (
    <>
      <Head>
        <title>{agentName ? `${agentName} — PropertyGenie` : "Agent Listings — PropertyGenie"}</title>
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
            <ArrowLeft size={15} /> Back
          </button>

          {/* Agent profile card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
            {isLoading ? (
              <div className="animate-pulse flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-48" />
                  <div className="h-4 bg-gray-200 rounded w-64" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <AgentInitials name={agentName || "?"} />
                <div className="flex-1 min-w-0 space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">{agentName || "Agent"}</h1>
                  <div className="flex flex-wrap gap-4">
                    {agentPhone && (
                      <a
                        href={`tel:${agentPhone}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        <Phone size={14} className="text-gray-400" />
                        {agentPhone}
                      </a>
                    )}
                    {agentEmail && (
                      <a
                        href={`mailto:${agentEmail}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        <Mail size={14} className="text-gray-400" />
                        {agentEmail}
                      </a>
                    )}
                  </div>
                </div>
                {!error && (
                  <div className="flex items-center gap-2 bg-indigo-50 rounded-xl px-4 py-3 text-indigo-700 shrink-0">
                    <Building2 size={18} />
                    <div className="text-right">
                      <p className="text-2xl font-bold leading-none">{items.length}</p>
                      <p className="text-xs mt-0.5">listings</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Listings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-5">All Listings</h2>
            <PropertyGrid
              items={items}
              isLoading={isLoading}
              error={error}
              onRetry={() => router.replace(router.asPath)}
              onClearFilters={() => router.push("/")}
              viewMode="grid"
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
