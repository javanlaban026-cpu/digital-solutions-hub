import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tag, X, Sparkles } from "lucide-react";
import { useState } from "react";

interface Offer {
  id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
}

export const FloatingOfferBadge = () => {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { data: offers } = useQuery({
    queryKey: ["active-offers"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("offers")
        .select("id, title, description, discount_percentage")
        .eq("is_active", true)
        .or(`valid_from.is.null,valid_from.lte.${now}`)
        .or(`valid_until.is.null,valid_until.gte.${now}`)
        .limit(1);
      if (error) throw error;
      return data as Offer[];
    },
  });

  const offer = offers?.[0];

  if (!offer || dismissed) return null;

  return (
    <>
      {/* Floating Badge Icon */}
      <div
        className={`fixed bottom-24 right-6 z-50 cursor-pointer transition-all duration-300 ${
          expanded ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={() => setExpanded(true)}
      >
        <div className="relative animate-bounce">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-full blur-lg opacity-60 animate-pulse" />
          
          {/* Main badge */}
          <div className="relative bg-gradient-to-br from-red-500 via-yellow-400 to-red-600 p-4 rounded-full shadow-2xl border-2 border-yellow-300">
            <div className="relative">
              <Tag className="w-7 h-7 text-white" />
              <Sparkles className="w-4 h-4 text-yellow-200 absolute -top-1 -right-1 animate-ping" />
            </div>
          </div>
          
          {/* Discount bubble */}
          {offer.discount_percentage && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-xs font-black px-2 py-1 rounded-full shadow-lg animate-pulse border border-red-500">
              {offer.discount_percentage}%
            </div>
          )}
        </div>
      </div>

      {/* Expanded Offer Card */}
      <div
        className={`fixed bottom-24 right-6 z-50 transition-all duration-300 ${
          expanded ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <div className="relative bg-gradient-to-br from-red-600 via-yellow-500 to-red-500 p-1 rounded-2xl shadow-2xl">
          <div className="bg-card rounded-2xl p-4 min-w-[280px] max-w-[320px]">
            {/* Close button */}
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dismiss button */}
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-2 left-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Dismiss
            </button>

            {/* Content */}
            <div className="text-center pt-4">
              {/* Special Offer Header */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Special Offer
                </span>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>

              {/* Discount */}
              {offer.discount_percentage && (
                <div className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent text-4xl font-black mb-2">
                  {offer.discount_percentage}% OFF
                </div>
              )}

              {/* Title */}
              <h3 className="text-lg font-bold text-foreground mb-2">
                {offer.title}
              </h3>

              {/* Description */}
              {offer.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {offer.description}
                </p>
              )}

              {/* CTA */}
              <a
                href="/contact"
                className="inline-block bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-6 py-2 rounded-full text-sm hover:shadow-lg transition-all hover:scale-105"
              >
                Claim Offer
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
