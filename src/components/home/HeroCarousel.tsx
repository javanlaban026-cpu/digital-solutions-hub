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
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            loading={index === 0 ? "eager" : "lazy"}
          />
          {/* Subtle gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          {/* Animated badge */}
          <div
            key={`badge-${currentIndex}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-6 animate-fade-in"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {currentSlide.subtitle}
          </div>

          {/* Title */}
          <h1
            key={`title-${currentIndex}`}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 animate-fade-in drop-shadow-lg"
          >
            We Build{" "}
            <span className="text-orange-400">{currentSlide.title}</span>
          </h1>

          {/* Description */}
          <p
            key={`desc-${currentIndex}`}
            className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in drop-shadow-md max-w-2xl"
            style={{ animationDelay: "0.1s" }}
          >
            {currentSlide.description}
          </p>

          {/* CTA Buttons */}
          <div
            key={`cta-${currentIndex}`}
            className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Link to={currentSlide.link}>
              <Button 
                size="xl" 
                className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg"
              >
                {currentSlide.cta}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                size="xl" 
                variant="outline"
                className="border-white/50 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-10 h-3 bg-orange-500"
                : "w-3 h-3 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
