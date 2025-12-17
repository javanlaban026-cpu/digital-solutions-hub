import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Globe, Code2, ShoppingCart, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  tags: string[];
  image_url: string | null;
  project_url: string | null;
  technologies: string[];
}

const categoryIcons: Record<string, typeof Globe> = {
  Website: Globe,
  "E-commerce": ShoppingCart,
  Software: Code2,
  Education: GraduationCap,
  "Web App": Code2,
};

const Portfolio = () => {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      setProjects(data || []);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const getIcon = (category: string) => categoryIcons[category] || Code2;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
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
          {loading ? (
            <div className="text-center text-muted-foreground">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-muted-foreground">No projects published yet. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => {
                const Icon = getIcon(project.category);
                return (
                  <div
                    key={project.id}
                    className="group glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <Icon className="w-16 h-16 text-primary/50 group-hover:scale-110 transition-transform duration-300" />
                      )}
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-4 right-4 p-2 bg-card/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </a>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                        {project.category}
                      </span>
                      <h3 className="text-xl font-heading font-semibold text-foreground mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="px-2 py-1 rounded-md bg-secondary text-xs text-muted-foreground">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 lg:py-28 bg-muted/30">
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
      <section className="py-24 lg:py-32 relative overflow-hidden bg-primary/5">
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
