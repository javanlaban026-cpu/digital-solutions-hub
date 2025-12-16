import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ServiceCard } from "@/components/shared/ServiceCard";
import {
  Globe,
  Code2,
  Smartphone,
  Palette,
  Server,
  Headphones,
  Building2,
  GraduationCap,
  ShoppingCart,
  Briefcase,
  Users,
  ArrowRight,
  Check,
} from "lucide-react";

const coreServices = [
  {
    icon: Globe,
    title: "Website Design & Development",
    description: "Fast, secure, and visually stunning websites tailored to your business needs.",
  },
  {
    icon: Code2,
    title: "Custom Software & Digital Systems",
    description: "Scalable software solutions that automate processes and improve efficiency.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Powerful Android, iOS, and cross-platform applications for your business.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Clean, intuitive interfaces designed for real users and real results.",
  },
  {
    icon: Server,
    title: "Technical & API Services",
    description: "Robust backend systems, API integrations, and cloud deployments.",
  },
  {
    icon: Headphones,
    title: "Maintenance & Support",
    description: "Ongoing support, updates, security monitoring, and bug fixes.",
  },
];

const clientTypes = [
  { icon: Briefcase, label: "Startups & Entrepreneurs" },
  { icon: Building2, label: "Small & Medium Businesses" },
  { icon: GraduationCap, label: "Schools & Institutions" },
  { icon: ShoppingCart, label: "Retail & POS Businesses" },
  { icon: Users, label: "Enterprises & Organizations" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(192_91%_52%_/_0.15),_transparent_50%)]" />
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Web Design, Software Development & Digital Systems
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-foreground mb-6 animate-slide-up">
              JL Software &{" "}
              <span className="gradient-text">Digital Systems</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              We build modern websites, powerful software, and intelligent digital systems that help businesses operate smarter and grow faster.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/contact">
                <Button variant="hero" size="xl">
                  Start Your Project
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="heroOutline" size="xl">
                  Free Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="What We Do"
            title="Digital Solutions That Work"
            description="At JL Software & Digital Systems, we design and develop digital solutions that solve real-world business problems. From high-performance websites to enterprise-grade software systems, we deliver technology that works."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {coreServices.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="lg">
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-24 lg:py-32 bg-card/50">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Our Clients"
            title="Who We Work With"
            description="We partner with businesses of all sizes, from ambitious startups to established enterprises."
          />
          
          <div className="flex flex-wrap justify-center gap-6 mt-16">
            {clientTypes.map((client, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-4 glass-card rounded-xl hover:border-primary/30 transition-all duration-300"
              >
                <client.icon className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">{client.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Our Products"
            title="Ready-to-Deploy Solutions"
            description="Pre-built systems designed for specific industries, fully customizable to match your workflow."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
            {/* POS System */}
            <div className="glass-card rounded-2xl p-8 lg:p-10 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mb-6">
                <ShoppingCart className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">JL POS System</h3>
              <p className="text-muted-foreground mb-6">
                A complete point-of-sale solution designed for retail and service businesses.
              </p>
              <ul className="space-y-3 mb-8">
                {["Sales & Billing", "Inventory Management", "Customer Management", "Reports & Analytics", "Multi-branch Support"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-foreground">
                    <Check className="w-5 h-5 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/products">
                <Button variant="outline" className="group-hover:border-primary/50">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* School Management */}
            <div className="glass-card rounded-2xl p-8 lg:p-10 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">JL School Management</h3>
              <p className="text-muted-foreground mb-6">
                A comprehensive digital platform for managing educational institutions.
              </p>
              <ul className="space-y-3 mb-8">
                {["Student & Teacher Management", "Attendance Tracking", "Fees & Payments", "Exams & Results", "Reports & Notifications"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-foreground">
                    <Check className="w-5 h-5 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/products">
                <Button variant="outline" className="group-hover:border-primary/50">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Let's discuss your ideas and turn them into powerful digital solutions.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="xl">
                Get Free Consultation
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
