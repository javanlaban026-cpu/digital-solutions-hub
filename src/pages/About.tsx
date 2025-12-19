import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Target, Heart, ArrowRight, Code2, UserCircle } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string | null;
  image_url: string | null;
}

const workProcess = [
  { step: "01", title: "Requirement Analysis", description: "Understanding your business needs" },
  { step: "02", title: "Planning & Architecture", description: "Designing the system structure" },
  { step: "03", title: "UI/UX Design", description: "Creating intuitive interfaces" },
  { step: "04", title: "Development", description: "Building robust solutions" },
  { step: "05", title: "Testing & QA", description: "Ensuring quality & reliability" },
  { step: "06", title: "Deployment", description: "Launching your solution" },
  { step: "07", title: "Ongoing Support", description: "Continuous maintenance & updates" },
];

const technologies = {
  frontend: ["HTML", "CSS", "JavaScript", "React", "Vue", "Next.js"],
  backend: ["Node.js", "PHP", "Python"],
  database: ["MySQL", "PostgreSQL", "MongoDB"],
  cloud: ["AWS", "Azure", "DigitalOcean"],
  tools: ["Git", "Docker", "CI/CD Pipelines"],
};

const About = () => {
  const { data: teamMembers } = useQuery({
    queryKey: ["public-team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("id, name, role, description, image_url")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader
            label="About Us"
            title="Who We Are"
            description="JL Software & Digital Systems (JavaLab) is a focused team of developers and designers passionate about building reliable, scalable, and secure digital solutions."
          />
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To deliver technology solutions that help businesses operate smarter and grow faster.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">Our Values</h3>
              <p className="text-muted-foreground">
                Quality over quantity, clear communication, and long-term partnerships with our clients.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">Our Approach</h3>
              <p className="text-muted-foreground">
                We operate as a lean but highly skilled team, focused on delivering exceptional results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About JavaLab */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              About JavaLab
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              JavaLab is the parent brand behind JL Software & Digital Systems. Founded with a vision to bridge the gap between cutting-edge technology and practical business solutions, JavaLab represents our commitment to innovation, quality, and client success.
            </p>
            <p className="text-muted-foreground">
              Under the JavaLab umbrella, we've built a reputation for delivering robust, scalable solutions that empower businesses across various industries. Our name reflects our roots in software development and our laboratory-like approach to solving complex technical challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Our Team"
            title="Meet the Experts"
            description="A lean but highly skilled team dedicated to building exceptional digital solutions."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {teamMembers && teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div key={member.id} className="glass-card rounded-2xl p-6 text-center">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <UserCircle className="w-12 h-12 text-primary" />
                    </div>
                  )}
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                  {member.description && (
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Team members coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Our Process"
            title="How We Work"
            description="A proven methodology that ensures successful project delivery."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {workProcess.slice(0, 4).map((item, index) => (
              <div key={index} className="relative">
                <div className="glass-card rounded-2xl p-6 h-full">
                  <span className="text-5xl font-heading font-bold gradient-text opacity-50">{item.step}</span>
                  <h3 className="text-lg font-heading font-semibold text-foreground mt-4 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {workProcess.slice(4).map((item, index) => (
              <div key={index} className="glass-card rounded-2xl p-6">
                <span className="text-5xl font-heading font-bold gradient-text opacity-50">{item.step}</span>
                <h3 className="text-lg font-heading font-semibold text-foreground mt-4 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Tech Stack"
            title="Technologies We Use"
            description="Modern technologies and tools that power our solutions."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-16">
            {Object.entries(technologies).map(([category, techs]) => (
              <div key={category} className="glass-card rounded-2xl p-6">
                <h3 className="text-sm font-medium text-primary uppercase tracking-wider mb-4">{category}</h3>
                <ul className="space-y-2">
                  {techs.map((tech) => (
                    <li key={tech} className="text-foreground text-sm">{tech}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 relative overflow-hidden bg-primary/5">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Ready to Work Together?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Let's discuss how we can help bring your ideas to life.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl">
              Get in Touch <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default About;
