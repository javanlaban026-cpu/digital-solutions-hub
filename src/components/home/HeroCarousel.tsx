import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Import hero images
import heroPOS from "@/assets/hero-pos-systems.png";
import heroSchool from "@/assets/hero-school-management.png";
import heroHospital from "@/assets/hero-hospital-management.png";
import heroAPI from "@/assets/hero-api-solutions.png";
import heroGraphic from "@/assets/hero-graphic-design.png";
import heroWebsites from "@/assets/hero-websites.png";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  link: string;
}

const slides: Slide[] = [
  {
    image: heroPOS,
    title: "POS Systems",
    subtitle: "Streamlined & Efficient",
    description: "Complete point-of-sale solutions for retail and service businesses with inventory management and analytics.",
    cta: "Explore POS Solutions",
    link: "/products",
  },
  {
    image: heroSchool,
    title: "School Management",
    subtitle: "Smart & Secure",
    description: "Comprehensive digital platforms for educational institutions with student, fee, and exam management.",
    cta: "View School Systems",
    link: "/products",
  },
  {
    image: heroHospital,
    title: "Hospital Management",
    subtitle: "Efficient & Reliable",
    description: "End-to-end healthcare management systems for hospitals, clinics, and medical facilities.",
    cta: "Discover Healthcare Solutions",
    link: "/products",
  },
  {
    image: heroAPI,
    title: "API Solutions",
    subtitle: "Powerful & Scalable",
    description: "Custom REST & GraphQL APIs with real-time data sync, secure endpoints, and comprehensive documentation.",
    cta: "Explore API Services",
    link: "/services",
  },
  {
    image: heroGraphic,
    title: "Graphic Design",
    subtitle: "Creative & Professional",
    description: "Stunning logos, branding, UI/UX design, marketing graphics, and print materials for your business.",
    cta: "See Design Portfolio",
    link: "/portfolio",
  },
  {
    image: heroWebsites,
    title: "Web Development",
    subtitle: "Custom & SEO Optimized",
    description: "Fast, responsive, and visually stunning websites tailored to your business needs.",
    cta: "Start Your Website",
    link: "/services",
  },
];

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % slides.length);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  }, [currentIndex, goToSlide]);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0a0a0f]">
      {/* Dark Background Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f]" />
      
      {/* Animated Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Content Grid Layout */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          {/* Left Side - Text Content with Dark Background */}
          <div className="relative order-2 lg:order-1">
            {/* Glowing accent */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
            
            <div className="relative space-y-6">
              {/* Animated badge */}
              <div
                key={`badge-${currentIndex}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium animate-fade-in"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {currentSlide.subtitle}
              </div>

              {/* Title */}
              <h1
                key={`title-${currentIndex}`}
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white animate-fade-in"
              >
                We Build{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {currentSlide.title}
                </span>
              </h1>

              {/* Description */}
              <p
                key={`desc-${currentIndex}`}
                className="text-lg md:text-xl text-gray-400 animate-fade-in max-w-xl leading-relaxed"
                style={{ animationDelay: "0.1s" }}
              >
                {currentSlide.description}
              </p>

              {/* CTA Buttons */}
              <div
                key={`cta-${currentIndex}`}
                className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in pt-4"
                style={{ animationDelay: "0.2s" }}
              >
                <Link to={currentSlide.link}>
                  <Button 
                    size="xl" 
                    className="bg-cyan-500 hover:bg-cyan-600 text-white border-0 shadow-lg shadow-cyan-500/25"
                  >
                    {currentSlide.cta}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button 
                    size="xl" 
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-white/10"
                  >
                    Free Consultation
                  </Button>
                </Link>
              </div>

              {/* Slide Indicators - Below Content */}
              <div className="flex items-center gap-3 pt-8">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? "w-10 h-2 bg-cyan-500"
                        : "w-2 h-2 bg-gray-600 hover:bg-gray-500"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Service Flyer Images */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            {/* Glow effect behind image */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-3xl transform scale-90" />
            
            {/* Image Container */}
            <div className="relative w-full max-w-lg lg:max-w-xl">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ease-in-out ${
                    index === currentIndex 
                      ? "opacity-100 scale-100" 
                      : "opacity-0 scale-95 absolute inset-0"
                  }`}
                >
                  <div className="relative rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl shadow-black/50">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-auto object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                </div>
              ))}

              {/* Navigation Arrows - On Image */}
              <div className="absolute -bottom-4 right-4 flex gap-2">
                <button
                  onClick={prevSlide}
                  className="p-3 rounded-full bg-gray-900/90 border border-gray-700 hover:bg-gray-800 hover:border-cyan-500/50 transition-all text-white"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-gray-900/90 border border-gray-700 hover:bg-gray-800 hover:border-cyan-500/50 transition-all text-white"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};