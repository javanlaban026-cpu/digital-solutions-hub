import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Globe,
  Code2,
  Smartphone,
  Palette,
  Server,
  Headphones,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Mail,
  Image,
} from "lucide-react";

const websiteTypes = [
  "Business & Corporate Websites",
  "E-commerce Websites",
  "Portfolio & Personal Websites",
  "Landing Pages",
  "Blogs & Content Platforms",
  "Web Applications & SaaS Platforms",
  "Progressive Web Apps (PWA)",
];

const websiteFeatures = [
  { icon: Palette, label: "Modern UI/UX design" },
  { icon: Smartphone, label: "Mobile-first responsiveness" },
  { icon: Zap, label: "SEO-friendly structure" },
  { icon: ShieldCheck, label: "High performance & security" },
];

const softwareSolutions = [
  "POS (Point of Sale) Systems",
  "School Management Systems",
  "Inventory Management Systems",
  "ERP & CRM Systems",
  "Billing & Accounting Software",
  "HR & Payroll Systems",
  "Custom Business Software",
];

const mobileApps = [
  "Android Applications",
  "iOS Applications",
  "Cross-Platform Apps (Flutter / React Native)",
  "Admin Dashboards & Control Panels",
];

const uiuxServices = [
  "Website UI Design",
  "Software & Dashboard UI",
  "Mobile App UI Design",
  "Wireframes & Prototypes",
  "Brand & Design Systems",
];

const graphicDesignServices = [
  "Brand Identity Design",
  "Logo Design & Branding",
  "UI Graphics & Icons",
  "Marketing Materials",
  "Social Media Graphics",
  "Print Design",
  "Digital Advertisements",
];

const emailServices = [
  "Business Email Setup",
  "Domain-based Email Configuration",
  "Email Security & DNS Setup",
  "Email Migration & Support",
  "Microsoft 365 Setup",
  "Google Workspace Setup",
  "Email Hosting Solutions",
];

const technicalServices = [
  "API Development & Integration",
  "Payment Gateway Integration",
  "Authentication & Security Systems",
  "Database Architecture & Optimization",
  "Cloud Deployment (AWS, Azure, DigitalOcean)",
  "Server Setup & Maintenance",
  "DevOps & CI/CD Pipelines",
  "Performance Optimization",
];

const supportServices = [
  "Website & Software Maintenance",
  "Bug Fixes & Updates",
  "Security Monitoring",
  "Performance Monitoring",
  "Long-term Support Plans",
];

const Services = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader
            label="Our Services"
            title="What We Offer"
            description="From stunning websites to complex enterprise systems, we deliver digital solutions that drive results."
          />
        </div>
      </section>

      {/* Website Design & Development */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Website Design & Development
              </h2>
              <p className="text-muted-foreground mb-6">
                We create fast, secure, and visually stunning websites tailored to your business needs. Every website we build is optimized for performance and designed to convert.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {websiteFeatures.map((feature) => (
                  <div key={feature.label} className="flex items-center gap-3">
                    <feature.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-foreground">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-6">Types of Websites We Build</h3>
              <ul className="space-y-3">
                {websiteTypes.map((type) => (
                  <li key={type} className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Software Development */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="glass-card rounded-2xl p-8 order-2 lg:order-1">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-6">Software Solutions</h3>
              <ul className="space-y-3">
                {softwareSolutions.map((solution) => (
                  <li key={solution} className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    {solution}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-primary font-medium">
                All systems are fully customizable to match your workflow.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Code2 className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Software Development & Digital Systems
              </h2>
              <p className="text-muted-foreground">
                We develop scalable software solutions that automate processes and improve efficiency. Our systems are built to grow with your business, ensuring long-term value and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Development */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Mobile App Development
              </h2>
              <p className="text-muted-foreground mb-8">
                Extend your business to mobile platforms with powerful applications. We build native and cross-platform apps that deliver exceptional user experiences.
              </p>
              <ul className="space-y-3">
                {mobileApps.map((app) => (
                  <li key={app} className="flex items-center gap-3 text-foreground">
                    <Check className="w-5 h-5 text-primary" />
                    {app}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-6 text-center">
                <div className="text-4xl font-heading font-bold gradient-text mb-2">iOS</div>
                <p className="text-sm text-muted-foreground">Native Swift Apps</p>
              </div>
              <div className="glass-card rounded-xl p-6 text-center">
                <div className="text-4xl font-heading font-bold gradient-text mb-2">Android</div>
                <p className="text-sm text-muted-foreground">Native Kotlin Apps</p>
              </div>
              <div className="glass-card rounded-xl p-6 text-center col-span-2">
                <div className="text-4xl font-heading font-bold gradient-text mb-2">Cross-Platform</div>
                <p className="text-sm text-muted-foreground">Flutter & React Native</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UI/UX Design */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
              <Palette className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              UI/UX Design
            </h2>
            <p className="text-muted-foreground">
              We design interfaces that are clean, intuitive, and built for real users. Great design isn't just about looks—it's about creating experiences that drive results.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {uiuxServices.map((service) => (
              <div key={service} className="glass-card rounded-xl p-6 text-center">
                <p className="text-foreground font-medium">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Graphic Design Services - NEW */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Image className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Graphic Design Services
              </h2>
              <p className="text-muted-foreground mb-8">
                Create a strong visual identity for your brand. From logos to marketing materials, we design graphics that capture attention and communicate your message effectively.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-6">What We Design</h3>
              <ul className="space-y-3">
                {graphicDesignServices.map((service) => (
                  <li key={service} className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Email Setup & Configuration - NEW */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="glass-card rounded-2xl p-8 order-2 lg:order-1">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-6">Email Services</h3>
              <ul className="space-y-3">
                {emailServices.map((service) => (
                  <li key={service} className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Email Setup & Configuration
              </h2>
              <p className="text-muted-foreground">
                Professional email solutions for your business. We set up, configure, and migrate your business email with proper security, DNS settings, and seamless integration with your domain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Services */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
              <Server className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Technical & Nerd Services
            </h2>
            <p className="text-muted-foreground">
              Behind every great product is solid engineering. We handle the complex technical work so you can focus on your business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {technicalServices.map((service) => (
              <div key={service} className="flex items-center gap-3 glass-card rounded-xl p-4">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground text-sm">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maintenance & Support */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Headphones className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Maintenance & Support
              </h2>
              <p className="text-muted-foreground mb-8">
                We don't just build and disappear. Our long-term support ensures your systems stay secure, updated, and performing at their best.
              </p>
              <ul className="space-y-3">
                {supportServices.map((service) => (
                  <li key={service} className="flex items-center gap-3 text-foreground">
                    <Check className="w-5 h-5 text-primary" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="text-6xl font-heading font-bold gradient-text mb-4">24/7</div>
              <p className="text-xl text-foreground font-medium mb-2">Support Available</p>
              <p className="text-muted-foreground">We're here when you need us</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 relative overflow-hidden bg-primary/5">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Let's discuss your project requirements and create something amazing together.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl">
              Start Your Project <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
