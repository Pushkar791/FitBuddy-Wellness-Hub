
import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/components/BackgroundEffects";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            entry.target.classList.add("opacity-100");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Get all elements that should animate on scroll
    const animateElements = document.querySelectorAll(".animate-on-scroll");
    animateElements.forEach((el) => {
      el.classList.add("opacity-0");
      observer.observe(el);
    });

    // Add parallax effect on scroll
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollY = window.scrollY;
      
      // Parallax elements with different speeds
      const parallaxSlow = document.querySelectorAll(".parallax-slow");
      const parallaxMedium = document.querySelectorAll(".parallax-medium");
      const parallaxFast = document.querySelectorAll(".parallax-fast");
      
      parallaxSlow.forEach((element) => {
        const speed = 0.05;
        const yPos = scrollY * speed;
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
      
      parallaxMedium.forEach((element) => {
        const speed = 0.1;
        const yPos = scrollY * speed;
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
      
      parallaxFast.forEach((element) => {
        const speed = 0.2;
        const yPos = scrollY * speed;
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };
    
    window.addEventListener("scroll", handleScroll);

    return () => {
      animateElements.forEach((el) => {
        observer.unobserve(el);
      });
      
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Create floating elements for a more dynamic background
  const createFloatingElements = () => {
    const elements = [];
    const shapes = ["circle", "square", "triangle"];
    
    for (let i = 0; i < 12; i++) {
      const shape = shapes[i % shapes.length];
      const size = Math.floor(Math.random() * 30) + 20;
      const top = Math.floor(Math.random() * 100);
      const left = Math.floor(Math.random() * 100);
      const duration = Math.floor(Math.random() * 20) + 10;
      const delay = Math.floor(Math.random() * 5);
      
      let shapeClass = "";
      if (shape === "circle") {
        shapeClass = "rounded-full";
      } else if (shape === "square") {
        shapeClass = "rounded-md";
      } else {
        shapeClass = "triangle";
      }
      
      elements.push(
        <div
          key={i}
          className={`absolute opacity-10 ${shapeClass} animate-float`}
          style={{
            width: `${size}px`,
            height: shape === "triangle" ? `${size * 0.866}px` : `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            background: i % 3 === 0 ? "#8B5CF6" : i % 3 === 1 ? "#D946EF" : "#F97316",
            animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`,
            zIndex: 0,
          }}
        />
      );
    }
    
    return elements;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        
        .triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        
        .hover-scale {
          transition: transform 0.3s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `
      }} />
      
      {createFloatingElements()}
      <BackgroundEffects />
      <Navigation />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
