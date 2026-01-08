-- Create services table with categories, descriptions, and process info
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  process_steps JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  starting_price DECIMAL(10,2),
  delivery_time TEXT,
  icon TEXT DEFAULT 'Code2',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- Create service appointments/bookings table
CREATE TABLE public.service_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT
);

-- Enable RLS on both tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_appointments ENABLE ROW LEVEL SECURITY;

-- Policies for services (public read, admin manage)
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all services" ON public.services
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policies for appointments (public insert, admin manage)
CREATE POLICY "Anyone can book appointments" ON public.service_appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all appointments" ON public.service_appointments
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update appointments" ON public.service_appointments
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete appointments" ON public.service_appointments
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_service_appointments_updated_at
  BEFORE UPDATE ON public.service_appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Insert default services with categories and detailed info
INSERT INTO public.services (name, slug, category, short_description, full_description, process_steps, features, icon, display_order) VALUES
('Business Website', 'business-website', 'Website Development', 'Professional websites for businesses', 'We create fast, secure, and visually stunning business websites tailored to your needs. Every website we build is optimized for performance and designed to convert visitors into customers.', 
 '[{"step": 1, "title": "Discovery", "description": "We learn about your business, goals, and target audience"}, {"step": 2, "title": "Design", "description": "Create mockups and wireframes for your approval"}, {"step": 3, "title": "Development", "description": "Build your website with modern technologies"}, {"step": 4, "title": "Testing", "description": "Thorough testing across devices and browsers"}, {"step": 5, "title": "Launch", "description": "Deploy your website and provide training"}]'::jsonb,
 '["Responsive design", "SEO optimized", "Fast loading", "Secure hosting", "Analytics integration"]'::jsonb,
 'Globe', 1),
 
('E-commerce Website', 'ecommerce-website', 'Website Development', 'Full-featured online stores', 'Build your online store with secure payment processing, inventory management, and a seamless shopping experience for your customers.',
 '[{"step": 1, "title": "Requirements", "description": "Define products, payment methods, and shipping"}, {"step": 2, "title": "Design", "description": "Create an engaging storefront design"}, {"step": 3, "title": "Integration", "description": "Set up payment gateways and inventory"}, {"step": 4, "title": "Testing", "description": "Test checkout flow and security"}, {"step": 5, "title": "Launch", "description": "Go live with full support"}]'::jsonb,
 '["Product management", "Secure payments", "Order tracking", "Inventory sync", "Customer accounts"]'::jsonb,
 'ShoppingCart', 2),
 
('POS System', 'pos-system', 'Software Development', 'Point of Sale solutions', 'Complete POS systems for retail and hospitality. Manage sales, inventory, and customer data all in one place.',
 '[{"step": 1, "title": "Analysis", "description": "Understand your business workflow"}, {"step": 2, "title": "Customization", "description": "Tailor the system to your needs"}, {"step": 3, "title": "Setup", "description": "Install and configure hardware/software"}, {"step": 4, "title": "Training", "description": "Train your staff on the system"}, {"step": 5, "title": "Support", "description": "Ongoing maintenance and updates"}]'::jsonb,
 '["Sales tracking", "Inventory management", "Customer loyalty", "Reports & analytics", "Multi-location support"]'::jsonb,
 'CreditCard', 3),
 
('School Management System', 'school-management', 'Software Development', 'Complete school administration', 'Comprehensive school management covering admissions, attendance, grades, fees, and parent communication.',
 '[{"step": 1, "title": "Assessment", "description": "Evaluate current processes"}, {"step": 2, "title": "Configuration", "description": "Set up classes, subjects, and users"}, {"step": 3, "title": "Migration", "description": "Import existing student data"}, {"step": 4, "title": "Training", "description": "Train teachers and administrators"}, {"step": 5, "title": "Launch", "description": "Go live with full support"}]'::jsonb,
 '["Student management", "Attendance tracking", "Grade management", "Fee collection", "Parent portal"]'::jsonb,
 'GraduationCap', 4),
 
('Mobile App Development', 'mobile-app', 'Mobile Development', 'iOS and Android applications', 'Native and cross-platform mobile apps that deliver exceptional user experiences on any device.',
 '[{"step": 1, "title": "Planning", "description": "Define features and user flows"}, {"step": 2, "title": "UI Design", "description": "Create beautiful app interfaces"}, {"step": 3, "title": "Development", "description": "Build for iOS and/or Android"}, {"step": 4, "title": "Testing", "description": "QA on multiple devices"}, {"step": 5, "title": "Launch", "description": "Submit to app stores"}]'::jsonb,
 '["Native performance", "Push notifications", "Offline support", "App store optimization", "Analytics"]'::jsonb,
 'Smartphone', 5),
 
('UI/UX Design', 'ui-ux-design', 'Design', 'User interface and experience design', 'We design interfaces that are clean, intuitive, and built for real users. Great design drives results.',
 '[{"step": 1, "title": "Research", "description": "User research and competitor analysis"}, {"step": 2, "title": "Wireframes", "description": "Create low-fidelity layouts"}, {"step": 3, "title": "Design", "description": "High-fidelity visual designs"}, {"step": 4, "title": "Prototype", "description": "Interactive prototype for testing"}, {"step": 5, "title": "Handoff", "description": "Developer-ready design files"}]'::jsonb,
 '["User research", "Wireframing", "Visual design", "Prototyping", "Design systems"]'::jsonb,
 'Palette', 6),
 
('Brand Identity Design', 'brand-identity', 'Design', 'Complete branding packages', 'Create a strong visual identity for your brand with logos, colors, typography, and guidelines.',
 '[{"step": 1, "title": "Discovery", "description": "Understand your brand values"}, {"step": 2, "title": "Concepts", "description": "Multiple design concepts"}, {"step": 3, "title": "Refinement", "description": "Refine chosen direction"}, {"step": 4, "title": "Assets", "description": "Create all brand assets"}, {"step": 5, "title": "Guidelines", "description": "Brand usage guidelines"}]'::jsonb,
 '["Logo design", "Color palette", "Typography", "Brand guidelines", "Stationery design"]'::jsonb,
 'Image', 7),
 
('Email Setup & Configuration', 'email-setup', 'Technical Services', 'Professional email solutions', 'Set up, configure, and migrate your business email with proper security and DNS settings.',
 '[{"step": 1, "title": "Assessment", "description": "Review current email setup"}, {"step": 2, "title": "Domain Setup", "description": "Configure DNS records"}, {"step": 3, "title": "Migration", "description": "Migrate existing emails"}, {"step": 4, "title": "Security", "description": "Set up SPF, DKIM, DMARC"}, {"step": 5, "title": "Training", "description": "User setup and training"}]'::jsonb,
 '["Domain email", "Microsoft 365", "Google Workspace", "Email security", "Migration support"]'::jsonb,
 'Mail', 8);