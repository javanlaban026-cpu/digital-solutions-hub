import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useServices, useServiceCategories } from "@/hooks/useServices";
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
  Loader2,
  GraduationCap,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import * as Icons from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "Website Development": <Globe className="w-7 h-7 text-primary" />,
  "Software Development": <Code2 className="w-7 h-7 text-primary" />,
  "Mobile Development": <Smartphone className="w-7 h-7 text-primary" />,
  Design: <Palette className="w-7 h-7 text-primary" />,
  "Technical Services": <Server className="w-7 h-7 text-primary" />,
  Support: <Headphones className="w-7 h-7 text-primary" />,
};

const Services = () => {
  const { data: services, isLoading } = useServices();
  const categories = useServiceCategories();

  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return Code2;
    const icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
    return icon || Code2;
  };

  const servicesByCategory = categories.reduce((acc, category) => {
    acc[category] = services?.filter((s) => s.category === category) || [];
    return acc;
  }, {} as Record<string, typeof services>);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

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

      {/* Service Categories */}
      {categories.map((category, categoryIndex) => {
        const categoryServices = servicesByCategory[category] || [];
        const isEven = categoryIndex % 2 === 0;

        return (
          <section
            key={category}
            className={`py-20 lg:py-28 ${isEven ? "" : "bg-muted/30"}`}
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  {categoryIcons[category] || <Code2 className="w-7 h-7 text-primary" />}
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                    {category}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {categoryServices.length} service{categoryServices.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service) => {
                  const IconComponent = getIconComponent(service.icon);
                  return (
                    <Link
                      key={service.id}
                      to={`/services/${service.slug}`}
                      className="group glass-card rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all duration-300">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {service.short_description}
                      </p>
                      {service.features.length > 0 && (
                        <div className="space-y-1.5">
                          {service.features.slice(0, 3).map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {service.features.length > 3 && (
                            <p className="text-xs text-primary font-medium mt-2">
                              +{service.features.length - 3} more features
                            </p>
                          )}
                        </div>
                      )}
                      <div className="mt-4 flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                        Learn More <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* No Services Fallback */}
      {(!services || services.length === 0) && (
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground text-lg">
              Services are being updated. Please check back soon or contact us for more information.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg" className="mt-6">
                Contact Us <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}

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
