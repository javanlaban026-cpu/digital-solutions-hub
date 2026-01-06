import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Linkedin, Mail, Twitter, Award, Briefcase, Calendar, Star, UserCircle, Globe } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  linkedin_url: string | null;
  twitter_url: string | null;
  email: string | null;
  website_url: string | null;
  years_experience: number | null;
  projects_completed: number | null;
  certifications: number | null;
  awards: number | null;
  tagline: string | null;
}

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

const AnimatedStat = ({ value, suffix = "", label, delay = 0 }: AnimatedStatProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => {
            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let current = 0;
            const interval = setInterval(() => {
              current += increment;
              if (current >= value) {
                setCount(value);
                clearInterval(interval);
              } else {
                setCount(Math.floor(current));
              }
            }, duration / steps);
          }, delay);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl md:text-3xl font-heading font-bold text-gold">
        {count}{suffix}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
};

// Skill tags based on role
const getSkillTags = (role: string): string[] => {
  const roleLower = role.toLowerCase();
  
  // Base skills everyone likely has
  const baseSkills = ['Strategy', 'Leadership'];
  
  if (roleLower.includes('founder') || roleLower.includes('ceo')) {
    return ['Vision', 'Strategy', 'Innovation', 'Leadership'];
  }
  if (roleLower.includes('cto') || roleLower.includes('chief technology')) {
    return ['Architecture', 'Cloud', 'DevOps', 'AI/ML'];
  }
  if (roleLower.includes('developer') || roleLower.includes('engineer')) {
    if (roleLower.includes('frontend') || roleLower.includes('front-end')) {
      return ['React', 'TypeScript', 'UI/UX', 'Tailwind'];
    }
    if (roleLower.includes('backend') || roleLower.includes('back-end')) {
      return ['Node.js', 'Python', 'APIs', 'Databases'];
    }
    if (roleLower.includes('full')) {
      return ['React', 'Node.js', 'TypeScript', 'Cloud'];
    }
    return ['JavaScript', 'TypeScript', 'React', 'APIs'];
  }
  if (roleLower.includes('designer') || roleLower.includes('ux') || roleLower.includes('ui')) {
    return ['Figma', 'UI/UX', 'Prototyping', 'Design Systems'];
  }
  if (roleLower.includes('product')) {
    return ['Agile', 'Roadmaps', 'Analytics', 'User Research'];
  }
  if (roleLower.includes('marketing') || roleLower.includes('cmo')) {
    return ['SEO', 'Analytics', 'Content', 'Growth'];
  }
  if (roleLower.includes('data') || roleLower.includes('analyst')) {
    return ['SQL', 'Python', 'Visualization', 'ML'];
  }
  if (roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('infrastructure')) {
    return ['AWS', 'Docker', 'Kubernetes', 'CI/CD'];
  }
  if (roleLower.includes('lead') || roleLower.includes('manager')) {
    return ['Team Lead', 'Agile', 'Mentoring', 'Architecture'];
  }
  
  // Default skills
  return ['Solutions', 'Innovation', 'Consulting', 'Tech'];
};

// Badge configuration based on role
const getRoleBadge = (role: string): { label: string; gradient: string; textColor: string } | null => {
  const roleLower = role.toLowerCase();
  
  if (roleLower.includes('co-founder') || roleLower.includes('co founder')) {
    return { label: 'CO-FOUNDER', gradient: 'from-gold via-gold-muted to-gold', textColor: 'text-navy' };
  }
  if (roleLower.includes('founder') || roleLower.includes('ceo')) {
    return { label: roleLower.includes('ceo') ? 'CEO' : 'FOUNDER', gradient: 'from-gold to-gold-muted', textColor: 'text-navy' };
  }
  if (roleLower.includes('cto') || roleLower.includes('chief technology')) {
    return { label: 'CTO', gradient: 'from-blue-500 to-cyan-400', textColor: 'text-white' };
  }
  if (roleLower.includes('coo') || roleLower.includes('chief operating')) {
    return { label: 'COO', gradient: 'from-emerald-500 to-teal-400', textColor: 'text-white' };
  }
  if (roleLower.includes('cfo') || roleLower.includes('chief financial')) {
    return { label: 'CFO', gradient: 'from-purple-500 to-violet-400', textColor: 'text-white' };
  }
  if (roleLower.includes('lead') || roleLower.includes('head')) {
    return { label: 'LEAD', gradient: 'from-orange-500 to-amber-400', textColor: 'text-white' };
  }
  if (roleLower.includes('senior') || roleLower.includes('sr.')) {
    return { label: 'SENIOR', gradient: 'from-slate-600 to-slate-500', textColor: 'text-white' };
  }
  if (roleLower.includes('director')) {
    return { label: 'DIRECTOR', gradient: 'from-rose-500 to-pink-400', textColor: 'text-white' };
  }
  if (roleLower.includes('manager')) {
    return { label: 'MANAGER', gradient: 'from-indigo-500 to-blue-400', textColor: 'text-white' };
  }
  
  return null;
};

const ExpertCard = ({ 
  member, 
  animationDelay = 0 
}: { 
  member: TeamMember; 
  animationDelay?: number;
}) => {
  const badge = getRoleBadge(member.role);
  const isHighlighted = badge !== null;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setIsVisible(true), animationDelay);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [animationDelay]);

  // Use real stats from database if available
  const stats = {
    years: member.years_experience || Math.floor(Math.random() * 10) + 5,
    projects: member.projects_completed || Math.floor(Math.random() * 50) + 20,
    awards: member.awards || Math.floor(Math.random() * 5) + 1,
  };

  return (
    <Link to={`/expert/${member.id}`} className="block">
      <div
        ref={cardRef}
        className={`
          relative group cursor-pointer
          transform transition-all duration-700 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
        style={{ transitionDelay: `${animationDelay}ms` }}
      >
        {/* Animated background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-primary/20 to-gold/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Card */}
      <div className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-charcoal to-navy
        border border-gold/10 hover:border-gold/30
        shadow-premium
        transition-all duration-500
        hover:-translate-y-2 hover:shadow-[0_20px_60px_hsl(0_0%_0%_/_0.5),0_0_100px_hsl(43_74%_49%_/_0.12)]
        ${isHighlighted ? 'p-6 lg:p-8 ring-2 ring-gold/20' : 'p-6 lg:p-8'}
      `}>
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10">
          {/* Portrait with 3D effect */}
          <div className="relative mx-auto mb-6">
            <div className={`
              relative ${isHighlighted ? 'w-36 h-36' : 'w-32 h-32'} mx-auto
              rounded-2xl overflow-hidden
              shadow-[0_8px_32px_rgba(0,0,0,0.4)]
              border-2 border-gold/20
              transform transition-transform duration-500 group-hover:scale-105
              before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:via-white/10 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity
            `}>
              {member.image_url ? (
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gold/20 to-primary/20 flex items-center justify-center">
                  <UserCircle className="w-16 h-16 text-gold/50" />
                </div>
              )}
              {/* 3D shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
            </div>
            
            {/* Role badge - shows for Founder, Co-Founder, CTO, CEO, etc. */}
            {badge && (
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r ${badge.gradient} ${badge.textColor} text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap`}>
                {badge.label}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="text-center">
            {/* Name & Role */}
            <h3 className={`
              font-heading font-bold text-ivory
              ${isHighlighted ? 'text-2xl' : 'text-xl lg:text-2xl'}
              mb-1
            `}>
              {member.name}
            </h3>
            <p className="text-gold font-medium text-sm uppercase tracking-wider mb-3">
              {member.role}
            </p>

            {/* Tagline/Quote */}
            <p className="text-muted-foreground italic text-sm mb-4 max-w-xs mx-auto line-clamp-3">
              "{member.tagline || member.description || 'Passionate about building exceptional digital solutions that transform businesses.'}"
            </p>

            {/* Skill Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {getSkillTags(member.role).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium rounded-full bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Stats Grid */}
            <div className={`
              grid grid-cols-3 gap-4 mb-6 py-4 
              border-y border-gold/10
            `}>
              <AnimatedStat value={stats.years} suffix="+" label="Years Exp" delay={animationDelay + 200} />
              <AnimatedStat value={stats.projects} suffix="+" label="Projects" delay={animationDelay + 400} />
              <AnimatedStat value={stats.awards} label="Awards" delay={animationDelay + 600} />
            </div>

            {/* Social/Contact Icons */}
            <div className="flex items-center justify-center gap-3" onClick={(e) => e.preventDefault()}>
              {member.linkedin_url && (
                <a 
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {member.twitter_url && (
                <a 
                  href={member.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {member.email && (
                <a 
                  href={`mailto:${member.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all duration-300 hover:scale-110"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {member.website_url && (
                <a 
                  href={member.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all duration-300 hover:scale-110"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>

          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 flex gap-1">
          <Star className="w-4 h-4 text-gold/30" />
          <Star className="w-4 h-4 text-gold/20" />
          <Star className="w-4 h-4 text-gold/10" />
        </div>
      </div>
      </div>
    </Link>
  );
};

export const ExpertiseShowcase = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["home-team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-background to-background" />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-[15%] w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-[20%] w-32 h-32 bg-gold/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-40 right-[10%] w-56 h-56 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            Meet Our Experts
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            The Living{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-muted">
              Expertise Showcase
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our founders and experts bring decades of combined experience, delivering exceptional digital solutions that transform businesses.
          </p>
        </div>

        {/* Team Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-charcoal/50 animate-pulse" />
            ))}
          </div>
        ) : teamMembers && teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {teamMembers.map((member, index) => (
              <ExpertCard
                key={member.id}
                member={member}
                animationDelay={index * 150}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-12 h-12 text-gold/50" />
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">Expert Profiles Coming Soon</h3>
            <p className="text-muted-foreground">Our team profiles are being prepared. Check back soon!</p>
          </div>
        )}

        {/* Decorative bottom border */}
        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>
    </section>
  );
};
