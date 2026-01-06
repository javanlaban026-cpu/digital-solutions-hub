-- Create page_views table for tracking visitor stats
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_path TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  country TEXT
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views (for tracking)
CREATE POLICY "Anyone can insert page views"
ON public.page_views
FOR INSERT
WITH CHECK (true);

-- Only admins can view page views
CREATE POLICY "Admins can view page views"
ON public.page_views
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for page_views
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;