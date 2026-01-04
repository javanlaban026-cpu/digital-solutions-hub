import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { useState } from "react";
import specialOfferIcon from "@/assets/special-offer-icon.png";

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
          expanded ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        onClick={() => setExpanded(true)}
      >
        <div className="relative animate-bounce hover:animate-none hover:scale-110 transition-transform">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-lg blur-xl opacity-50 animate-pulse" />
          
          {/* Main badge image */}
          <img 
            src={specialOfferIcon} 
            alt="Special Offer" 
            className="relative w-24 h-24 object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Expanded Offer Card */}
      <div
        className={`fixed bottom-24 right-6 z-50 transition-all duration-300 ${
          expanded ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative">
          {/* Close button */}
          <button
            onClick={() => setExpanded(false)}
            className="absolute -top-2 -right-2 z-10 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Card with gradient border */}
          <div className="bg-gradient-to-br from-red-500 via-yellow-400 to-red-600 p-1 rounded-2xl shadow-2xl">
            <div className="bg-card rounded-2xl p-4 min-w-[300px] max-w-[340px]">
              {/* Offer Icon */}
              <div className="flex justify-center -mt-16 mb-3">
                <img 
                  src={specialOfferIcon} 
                  alt="Special Offer" 
                  className="w-28 h-28 object-contain drop-shadow-xl"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-foreground text-center mb-2">
                {offer.title}
              </h3>

              {/* Discount Badge */}
              {offer.discount_percentage && (
                <div className="flex justify-center mb-3">
                  <span className="bg-gradient-to-r from-red-500 to-yellow-500 text-white text-2xl font-black px-4 py-2 rounded-full shadow-lg">
                    {offer.discount_percentage}% OFF
                  </span>
                </div>
              )}

              {/* Description */}
              {offer.description && (
                <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
                  {offer.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <a
                  href="/contact"
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-6 py-3 rounded-full text-sm text-center hover:shadow-lg transition-all hover:scale-105"
                >
                  Claim This Offer
                </a>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors text-center py-1"
                >
                  No thanks, dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
