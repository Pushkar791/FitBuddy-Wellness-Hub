
import { Calendar, MessageCircle, Music, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "SheSync",
    description: "Track your menstrual cycle, get period predictions, and manage symptoms with our intuitive period tracker.",
    icon: Calendar,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    link: "/shesync",
    animation: "animate-on-scroll animate-slide-up"
  },
  {
    title: "ChatBuddy",
    description: "Talk to our AI-powered companion about wellness, get advice, or simply have a friendly conversation.",
    icon: MessageCircle,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    link: "/chatbuddy",
    animation: "animate-on-scroll animate-slide-up"
  },
  {
    title: "NeuroSound",
    description: "Experience neuroacoustic therapy with sounds designed to improve focus, relaxation, and sleep.",
    icon: Music,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    link: "/neurosound",
    animation: "animate-on-scroll animate-slide-up"
  },
  {
    title: "Wellness Tracker",
    description: "Monitor your health metrics, track habits, and set goals for your wellbeing journey.",
    icon: Activity,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    link: "#",
    animation: "animate-on-scroll animate-slide-up"
  }
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 px-4 relative">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-fitbuddy-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-fitbuddy-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            All-in-One <span className="gradient-text text-gradient-animate">Wellness Platform</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-on-scroll">
            FitBuddy combines multiple wellness tools in one easy-to-use platform to support your health journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`card-hover hover-glow border ${feature.animation}`} 
              style={{ animationDelay: `${index * 0.2}s`, opacity: 0 }}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 hover-scale`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="group">
                  <span className="bg-gradient-to-r from-fitbuddy-primary to-fitbuddy-secondary bg-[length:0%_2px] group-hover:bg-[length:100%_2px] bg-no-repeat bg-left-bottom transition-all duration-500">
                    {feature.title}
                  </span>
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full group">
                  <Link to={feature.link} className="flex items-center justify-center">
                    <span>Explore {feature.title}</span>
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
