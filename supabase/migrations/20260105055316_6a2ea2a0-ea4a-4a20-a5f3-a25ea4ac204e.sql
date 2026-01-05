-- Add social media and additional profile fields to team_members table
ALTER TABLE public.team_members 
ADD COLUMN linkedin_url text,
ADD COLUMN twitter_url text,
ADD COLUMN email text,
ADD COLUMN website_url text,
ADD COLUMN years_experience integer DEFAULT 0,
ADD COLUMN projects_completed integer DEFAULT 0,
ADD COLUMN certifications integer DEFAULT 0,
ADD COLUMN awards integer DEFAULT 0,
ADD COLUMN tagline text,
ADD COLUMN career_milestones jsonb DEFAULT '[]'::jsonb,
ADD COLUMN testimonials jsonb DEFAULT '[]'::jsonb,
ADD COLUMN portfolio_highlights jsonb DEFAULT '[]'::jsonb;