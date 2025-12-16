import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Code2, ShoppingCart, GraduationCap, ArrowRight, ExternalLink } from "lucide-react";

const portfolioProjects = [
  {
    category: "Website",
    title: "Corporate Business Website",
    description: "A modern, responsive website for a consulting firm featuring dynamic content management and lead generation forms.",
    tags: ["React", "Next.js", "Tailwind CSS"],
    icon: Globe,
  },
  {
    category: "E-commerce",
    title: "Online Retail Store",
    description: "Full-featured e-commerce platform with inventory management, payment processing, and order tracking.",
    tags: ["React", "Node.js", "PostgreSQL"],
    icon: ShoppingCart,
  },
  {
    category: "Software",
    title: "POS Implementation",
    description: "Complete point-of-sale system deployment for a multi-location retail chain with real-time inventory sync.",
    tags: ["React", "Node.js", "MySQL"],
    icon: ShoppingCart,
  },
  {
    category: "Education",
    title: "School Management Platform",
    description: "Comprehensive school management system serving 2000+ students with attendance, grades, and parent portal.",
    tags: ["React", "Python", "PostgreSQL"],
    icon: GraduationCap,
  },
  {
    category: "Web App",
    title: "SaaS Dashboard",
    description: "Analytics dashboard for a B2B SaaS platform with real-time data visualization and reporting.",
    tags: ["React", "TypeScript", "D3.js"],
    icon: Code2,
  },
  {
    category: "Software",
    title: "Inventory Management System",
    description: "Custom inventory and warehouse management solution for a manufacturing company.",
    tags: ["React", "Node.js", "MongoDB"],
    icon: Code2,
  },
];

const Portfolio = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(192_91%_52%_/_0.1),_transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader
            label="Our Work"
            title="Portfolio"
            description="Explore our collection of websites, software systems, and digital solutions we've built for real clients."
          />
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioProjects.map((project, index) => (
              <div
                key={index}
                className="group glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-48 bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                  <project.icon className="w-16 h-16 text-primary/50 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-md bg-secondary text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 lg:py-28 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-heading font-bold gradient-text mb-2">50+</div>
              <p className="text-muted-foreground">Projects Delivered</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-heading font-bold gradient-text mb-2">40+</div>
              <p className="text-muted-foreground">Happy Clients</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-heading font-bold gradient-text mb-2">5+</div>
              <p className="text-muted-foreground">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-heading font-bold gradient-text mb-2">99%</div>
              <p className="text-muted-foreground">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Want to Be Our Next Success Story?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Let's create something amazing together. Reach out to discuss your project.
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

export default Portfolio;
