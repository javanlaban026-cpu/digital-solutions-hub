import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  timezone: string;
  language: string;
}

const defaultSettings: SiteSettings = {
  company_name: "JL Software & Digital Systems",
  contact_email: "info@jlsoftware.com",
  contact_phone: "+1 (234) 567-890",
  contact_address: "Your City, Country",
  timezone: "UTC",
  language: "English",
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (!error && data) {
        const settingsMap: Partial<SiteSettings> = {};
        data.forEach((s: { key: string; value: string | null }) => {
          if (s.key in defaultSettings) {
            settingsMap[s.key as keyof SiteSettings] = s.value || defaultSettings[s.key as keyof SiteSettings];
          }
        });
        setSettings({ ...defaultSettings, ...settingsMap });
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};
