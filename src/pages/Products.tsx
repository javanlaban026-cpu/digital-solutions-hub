import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart, GraduationCap, Settings, Check, ArrowRight } from "lucide-react";

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
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(192_91%_52%_/_0.1),_transparent_50%)]" />
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mb-6">
                <ShoppingCart className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Retail & Service
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
                JL POS System
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                A complete point-of-sale solution designed for retail and service businesses. Streamline your sales, manage inventory, and grow your business with powerful analytics.
              </p>
              <Link to="/contact">
                <Button variant="hero" size="lg">
                  Get a Demo <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
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
      <section className="py-20 lg:py-28 bg-card/50">
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mb-6">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Education
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
                JL School Management
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                A comprehensive digital platform for managing educational institutions. From enrollment to graduation, manage every aspect of your school efficiently.
              </p>
              <Link to="/contact">
                <Button variant="hero" size="lg">
                  Get a Demo <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Systems */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mb-6 mx-auto">
              <Settings className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Tailored Solutions
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
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

      {/* CTA */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Get a personalized demo and see how our products can streamline your operations.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl">
              Request a Demo <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
