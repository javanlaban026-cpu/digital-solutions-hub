import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Linkedin, 
  Twitter, 
  Mail, 
  Globe, 
  Award, 
  Briefcase, 
  Calendar,
  Star,
  ExternalLink
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Json } from "@/integrations/supabase/types";

interface Milestone {
  year: string;
  title: string;
  description?: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  avatar?: string;
}

interface PortfolioItem {
  title: string;
  description: string;
  image?: string;
  url?: string;
  tags?: string[];
}

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{count}{suffix}</span>;
};

const parseJsonArray = <T,>(json: Json | null): T[] => {
  if (!json) return [];
  if (Array.isArray(json)) return json as T[];
  return [];
};

const ExpertProfile = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: expert, isLoading } = useQuery({
    queryKey: ['team-member', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  if (!expert) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-serif text-foreground">Expert not found</h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const milestones = parseJsonArray<Milestone>(expert.career_milestones);
  const testimonials = parseJsonArray<Testimonial>(expert.testimonials);
  const portfolioItems = parseJsonArray<PortfolioItem>(expert.portfolio_highlights);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-expertise-gold/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10">
          {/* Back Button */}
          <div className="container mx-auto px-4 py-6">
            <Link to="/#expertise">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Team
              </Button>
            </Link>
          </div>

          {/* Hero Section */}
          <section className="container mx-auto px-4 pb-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Profile Image */}
                <div className="md:col-span-1">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-expertise-gold/20 to-primary/20 rounded-2xl blur-xl" />
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-expertise-gold/30 shadow-2xl">
                      {expert.image_url ? (
                        <img 
                          src={expert.image_url} 
                          alt={expert.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-expertise-navy to-expertise-charcoal flex items-center justify-center">
                          <span className="text-6xl font-serif text-expertise-gold">
                            {expert.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4 mt-6">
                    {expert.linkedin_url && (
                      <a 
                        href={expert.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-expertise-navy/50 border border-expertise-gold/30 text-expertise-gold hover:bg-expertise-gold hover:text-expertise-navy transition-all"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {expert.twitter_url && (
                      <a 
                        href={expert.twitter_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-expertise-navy/50 border border-expertise-gold/30 text-expertise-gold hover:bg-expertise-gold hover:text-expertise-navy transition-all"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {expert.email && (
                      <a 
                        href={`mailto:${expert.email}`}
                        className="p-3 rounded-full bg-expertise-navy/50 border border-expertise-gold/30 text-expertise-gold hover:bg-expertise-gold hover:text-expertise-navy transition-all"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    )}
                    {expert.website_url && (
                      <a 
                        href={expert.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-expertise-navy/50 border border-expertise-gold/30 text-expertise-gold hover:bg-expertise-gold hover:text-expertise-navy transition-all"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-2">{expert.name}</h1>
                    <p className="text-xl text-expertise-gold font-medium mb-4">{expert.role}</p>
                    {expert.tagline && (
                      <p className="text-lg text-muted-foreground italic border-l-4 border-expertise-gold/50 pl-4">
                        "{expert.tagline}"
                      </p>
                    )}
                  </div>

                  {expert.description && (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-muted-foreground leading-relaxed">{expert.description}</p>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {expert.years_experience && expert.years_experience > 0 && (
                      <div className="bg-expertise-navy/30 border border-expertise-gold/20 rounded-xl p-4 text-center">
                        <Calendar className="w-6 h-6 text-expertise-gold mx-auto mb-2" />
                        <div className="text-2xl font-bold text-foreground">
                          <AnimatedCounter value={expert.years_experience} suffix="+" />
                        </div>
                        <div className="text-xs text-muted-foreground">Years Experience</div>
                      </div>
                    )}
                    {expert.projects_completed && expert.projects_completed > 0 && (
                      <div className="bg-expertise-navy/30 border border-expertise-gold/20 rounded-xl p-4 text-center">
                        <Briefcase className="w-6 h-6 text-expertise-gold mx-auto mb-2" />
                        <div className="text-2xl font-bold text-foreground">
                          <AnimatedCounter value={expert.projects_completed} suffix="+" />
                        </div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                    )}
                    {expert.certifications && expert.certifications > 0 && (
                      <div className="bg-expertise-navy/30 border border-expertise-gold/20 rounded-xl p-4 text-center">
                        <Award className="w-6 h-6 text-expertise-gold mx-auto mb-2" />
                        <div className="text-2xl font-bold text-foreground">
                          <AnimatedCounter value={expert.certifications} />
                        </div>
                        <div className="text-xs text-muted-foreground">Certifications</div>
                      </div>
                    )}
                    {expert.awards && expert.awards > 0 && (
                      <div className="bg-expertise-navy/30 border border-expertise-gold/20 rounded-xl p-4 text-center">
                        <Star className="w-6 h-6 text-expertise-gold mx-auto mb-2" />
                        <div className="text-2xl font-bold text-foreground">
                          <AnimatedCounter value={expert.awards} />
                        </div>
                        <div className="text-xs text-muted-foreground">Awards</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Career Timeline */}
          {milestones.length > 0 && (
            <section className="py-16 bg-expertise-navy/20">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-serif text-foreground mb-8 text-center">Career Journey</h2>
                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-expertise-gold/30" />
                    <div className="space-y-8">
                      {milestones.map((milestone, index) => (
                        <div 
                          key={index}
                          className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                        >
                          <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                            <div className="bg-card/50 backdrop-blur-sm border border-expertise-gold/20 rounded-xl p-4">
                              <span className="text-expertise-gold font-bold">{milestone.year}</span>
                              <h3 className="text-foreground font-medium mt-1">{milestone.title}</h3>
                              {milestone.description && (
                                <p className="text-sm text-muted-foreground mt-2">{milestone.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-expertise-gold border-4 border-background" />
                          <div className="w-1/2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Portfolio Highlights */}
          {portfolioItems.length > 0 && (
            <section className="py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif text-foreground mb-8 text-center">Portfolio Highlights</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {portfolioItems.map((item, index) => (
                    <div 
                      key={index}
                      className="group bg-card/50 backdrop-blur-sm border border-expertise-gold/20 rounded-xl overflow-hidden hover:border-expertise-gold/50 transition-all"
                    >
                      {item.image && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-foreground font-medium mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {item.url && (
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-expertise-gold hover:underline"
                          >
                            View Project <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <section className="py-16 bg-expertise-navy/20">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif text-foreground mb-8 text-center">What People Say</h2>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {testimonials.map((testimonial, index) => (
                    <div 
                      key={index}
                      className="bg-card/50 backdrop-blur-sm border border-expertise-gold/20 rounded-xl p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-expertise-gold/20 flex items-center justify-center shrink-0">
                          {testimonial.avatar ? (
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-expertise-gold font-serif">
                              {testimonial.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-muted-foreground italic mb-4">"{testimonial.text}"</p>
                          <div>
                            <p className="text-foreground font-medium">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-serif text-foreground mb-4">Want to work with {expert.name.split(' ')[0]}?</h2>
              <Link to="/contact">
                <Button size="lg" className="bg-expertise-gold text-expertise-navy hover:bg-expertise-gold/90">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ExpertProfile;
