-- Create site_settings table for editable settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read site settings
CREATE POLICY "Anyone can read site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Only admins can update
CREATE POLICY "Admins can update site settings"
  ON public.site_settings
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert
CREATE POLICY "Admins can insert site settings"
  ON public.site_settings
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('company_name', 'JL Software & Digital Systems'),
  ('contact_email', 'info@jlsoftware.com'),
  ('contact_phone', '+1 (234) 567-890'),
  ('contact_address', 'Your City, Country'),
  ('timezone', 'UTC'),
  ('language', 'English');

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Storage policies for portfolio bucket
CREATE POLICY "Anyone can view portfolio images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio');

CREATE POLICY "Admins can upload portfolio images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'portfolio' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update portfolio images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'portfolio' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete portfolio images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'portfolio' AND has_role(auth.uid(), 'admin'::app_role));