
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Brain, Sparkles } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Hero = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  
  const features = [
    "Track your wellness journey",
    "SheSync period tracker",
    "AI-powered chat buddy",
    "Neuroacoustic therapy",
  ];

  const benefitCards = [
    {
      icon: Heart,
      title: "Holistic Wellness",
      description: "Support for physical, mental and emotional wellbeing in one place"
    },
    {
      icon: Brain,
      title: "Science-Backed",
      description: "Features designed with medical research and wellness science"
    },
    {
      icon: Sparkles,
      title: "Personalized",
      description: "Tailored experiences that adapt to your unique wellness needs"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      // Get position relative to hero section
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    };

    const element = heroRef.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  // Calculate parallax effect for hero elements
  const parallaxX = mousePosition.x * 20 - 10;
  const parallaxY = mousePosition.y * 20 - 10;

  return (
    <div className="relative overflow-hidden" ref={heroRef}>
      {/* Dynamic background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-fitbuddy-primary/10 to-fitbuddy-secondary/5 -z-10"
        aria-hidden="true"
        style={{ 
          transform: `translate(${-parallaxX * 0.5}px, ${-parallaxY * 0.5}px)`,
          transition: "transform 0.1s ease-out" 
        }}
      />
      
      {/* Animated orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-fitbuddy-primary/20 blur-3xl -z-5"
        style={{ 
          transform: `translate(${-parallaxX * 2}px, ${-parallaxY * 2}px)`,
          transition: "transform 0.1s ease-out" 
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-fitbuddy-secondary/20 blur-3xl -z-5"
        style={{ 
          transform: `translate(${parallaxX * 1.5}px, ${parallaxY * 1.5}px)`,
          transition: "transform 0.1s ease-out" 
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-on-scroll">
              Your Ultimate <span className="gradient-text text-gradient-animate">Wellness Companion</span>
            </h1>
            <div className="h-12 md:h-16 overflow-hidden mb-6 animate-on-scroll" style={{ animationDelay: "0.2s" }}>
              {features.map((feature, index) => (
                <p 
                  key={index}
                  className={`text-xl md:text-2xl transition-all duration-500 ${
                    activeFeature === index ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
                  }`}
                >
                  {activeFeature === index && feature}
                </p>
              ))}
            </div>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg animate-on-scroll" style={{ animationDelay: "0.4s" }}>
              Join FitBuddy to track your wellness journey, manage your periods with SheSync, chat with our AI companion, and experience neuroacoustic sound therapy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll" style={{ animationDelay: "0.6s" }}>
              <Button asChild size="lg" className="bg-gradient-to-r from-fitbuddy-primary to-fitbuddy-secondary hover:opacity-90 group">
                <Link to="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover-scale">
                <Link to="/chatbuddy">
                  Chat with FitBuddy
                </Link>
              </Button>
            </div>
            
            {/* Benefit Cards */}
            <div className="mt-12 flex flex-wrap gap-4 animate-on-scroll" style={{ animationDelay: "0.8s" }}>
              {benefitCards.map((card, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger asChild>
                    <div className="cursor-pointer hover-scale">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border hover:border-primary/40 transition-all">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-fitbuddy-primary/20`}>
                          <card.icon className="w-4 h-4 text-fitbuddy-primary" />
                        </div>
                        <span>{card.title}</span>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{card.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
          
          <div className="hidden md:block md:w-1/2 mt-10 md:mt-0 animate-on-scroll" style={{ animationDelay: "0.5s" }}>
            <div className="relative">
              <div 
                className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-fitbuddy-primary to-fitbuddy-secondary rounded-full blur-xl absolute top-0 left-0 opacity-20"
                style={{ 
                  transform: `translate(${parallaxX * 5}px, ${parallaxY * 5}px)`,
                  transition: "transform 0.1s ease-out" 
                }}
              ></div>
              <div className="relative z-10 flex items-center justify-center" style={{animation: "float 6s ease-in-out infinite"}}>
                <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-xl glass-effect border border-white/20 p-4 hover-glow">
                  <div className="h-full bg-gradient-to-br from-fitbuddy-light to-white rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto bg-fitbuddy-primary/20 rounded-full flex items-center justify-center mb-4" style={{animation: "pulse 3s infinite"}}>
                        <div className="w-16 h-16 bg-fitbuddy-primary/40 rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-fitbuddy-primary rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium gradient-text">FitBuddy AI</h3>
                      <p className="text-sm text-muted-foreground">Your wellness assistant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
