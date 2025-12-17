import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ShoppingCart, GraduationCap, Settings, Check, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const posFeatures = [
  "Sales & Billing Management",
  "Real-time Inventory Tracking",
  "Customer Management & CRM",
  "Comprehensive Reports & Analytics",
  "Multi-branch Support",
  "Employee Management",
  "Barcode & Receipt Printing",
  "Multiple Payment Methods",
];

const schoolFeatures = [
  "Student & Teacher Management",
  "Attendance Tracking System",
  "Fees & Payment Processing",
  "Examination & Results Management",
  "Timetable & Scheduling",
  "Reports & Notifications",
  "Parent Portal Access",
  "Library Management",
];

const Products = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    product: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.product) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("demo_requests").insert({
      name: formData.name,
      company: formData.company || null,
      email: formData.email,
      phone: formData.phone || null,
      product: formData.product,
      message: formData.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: "Failed to submit request. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "Your demo request has been submitted. We'll contact you soon." });
      setFormData({ name: "", company: "", email: "", phone: "", product: "", message: "" });
    }
  };

  const scrollToDemo = () => {
    document.getElementById("demo-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader
            label="Our Products"
            title="Ready-to-Deploy Solutions"
            description="Pre-built systems designed for specific industries. Fully customizable and ready to scale with your business."
          />
        </div>
      </section>

      {/* JL POS System */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-6">
                <ShoppingCart className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Retail & Service
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                JL POS System
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                A complete point-of-sale solution designed for retail and service businesses. Streamline your sales, manage inventory, and grow your business with powerful analytics.
              </p>
              <Button variant="hero" size="lg" onClick={scrollToDemo}>
                Get a Demo <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-6">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {posFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JL School Management */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="glass-card rounded-2xl p-8 order-2 lg:order-1">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-6">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {schoolFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Education
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                JL School Management
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                A comprehensive digital platform for managing educational institutions. From enrollment to graduation, manage every aspect of your school efficiently.
              </p>
              <Button variant="hero" size="lg" onClick={scrollToDemo}>
                Get a Demo <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Systems */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-6 mx-auto">
              <Settings className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Tailored Solutions
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Custom Digital Systems
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Need something unique? We build custom systems tailored exactly to your business processes. From concept to deployment, we create solutions that fit your workflow perfectly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button variant="hero" size="lg">
                  Discuss Your Project <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Request Form */}
      <section id="demo-form" className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Request a Demo
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll schedule a personalized demo for you.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Name *</label>
                  <Input
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Company</label>
                  <Input
                    placeholder="Your company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                  <Input
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Product *</label>
                <Select value={formData.product} onValueChange={(v) => setFormData({ ...formData, product: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JL POS System">JL POS System</SelectItem>
                    <SelectItem value="JL School Management">JL School Management</SelectItem>
                    <SelectItem value="Custom System">Custom System</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                <Textarea
                  placeholder="Tell us about your requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 relative overflow-hidden bg-primary/5">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Get a personalized demo and see how our products can streamline your operations.
          </p>
          <Button variant="hero" size="xl" onClick={scrollToDemo}>
            Request a Demo <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
