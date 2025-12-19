import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tag, X } from "lucide-react";
import { useState } from "react";

interface Offer {
  id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
}

export const OffersBar = () => {
  const [dismissed, setDismissed] = useState(false);

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
    <div className="bg-primary text-primary-foreground py-2 px-4 relative">
      <div className="container mx-auto flex items-center justify-center gap-3 text-sm">
        <Tag className="w-4 h-4" />
        <span className="font-medium">{offer.title}</span>
        {offer.discount_percentage && (
          <span className="bg-primary-foreground/20 px-2 py-0.5 rounded-full text-xs font-bold">
            {offer.discount_percentage}% OFF
          </span>
        )}
        {offer.description && (
          <span className="hidden md:inline text-primary-foreground/80">— {offer.description}</span>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-primary-foreground/20 rounded p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
