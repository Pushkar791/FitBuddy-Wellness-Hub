
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AudioTrack = {
  id: number;
  title: string;
  category: "focus" | "relax" | "sleep";
  description: string;
  duration: number; // in seconds
  frequency: string;
  color: string;
};

const audioTracks: AudioTrack[] = [
  {
    id: 1,
    title: "Deep Focus",
    category: "focus",
    description: "Alpha waves (8-12Hz) to enhance focus and concentration",
    duration: 1800, // 30 minutes
    frequency: "10Hz Alpha Waves",
    color: "from-blue-500 to-purple-600",
  },
  {
    id: 2,
    title: "Flow State",
    category: "focus",
    description: "Beta waves (12-30Hz) to promote productivity and alertness",
    duration: 3600, // 60 minutes
    frequency: "15Hz Beta Waves",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: 3,
    title: "Deep Relaxation",
    category: "relax",
    description: "Theta waves (4-8Hz) for relaxation and creativity",
    duration: 1200, // 20 minutes
    frequency: "6Hz Theta Waves",
    color: "from-green-400 to-emerald-600",
  },
  {
    id: 4,
    title: "Stress Relief",
    category: "relax",
    description: "Alpha-theta blend for anxiety reduction",
    duration: 900, // 15 minutes
    frequency: "8-6Hz Alpha-Theta Waves",
    color: "from-teal-400 to-green-600",
  },
  {
    id: 5,
    title: "Deep Sleep",
    category: "sleep",
    description: "Delta waves (0.5-4Hz) for deep sleep induction",
    duration: 2700, // 45 minutes
    frequency: "2Hz Delta Waves",
    color: "from-indigo-400 to-purple-600",
  },
  {
    id: 6,
    title: "Lucid Dreams",
    category: "sleep",
    description: "Theta-delta blend for lucid dreaming",
    duration: 3600, // 60 minutes
    frequency: "4-2Hz Theta-Delta Waves",
    color: "from-violet-500 to-purple-700",
  },
];

const NeuroSound = () => {
  const [activeTab, setActiveTab] = useState<string>("focus");
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(70);
  const [elapsed, setElapsed] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup function to clear the interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleTrackSelect = (track: AudioTrack) => {
    if (currentTrack?.id === track.id) {
      handlePlayPause();
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      setCurrentTrack(track);
      setElapsed(0);
      
      // In a real app, we would load the actual audio file here
      // For now, we'll simulate audio playback
      setIsPlaying(true);
      
      // Create a new interval for this track
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= track.duration) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handlePlayPause = () => {
    if (!currentTrack) return;
    
    setIsPlaying(!isPlaying);
    
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= currentTrack.duration) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) {
      return <VolumeX className="h-4 w-4" />;
    } else if (volume < 50) {
      return <Volume1 className="h-4 w-4" />;
    } else {
      return <Volume2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">NeuroSound</span> Therapy
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience the power of sound frequencies designed to enhance focus, promote relaxation, and improve sleep
        </p>
      </div>

      <div className="mb-8">
        <Card className="overflow-hidden border">
          <div
            className={`h-32 bg-gradient-to-r ${
              currentTrack ? currentTrack.color : "from-fitbuddy-primary to-fitbuddy-secondary"
            } flex items-end p-6`}
          >
            <div className="text-white">
              <h2 className="text-xl font-semibold">
                {currentTrack ? currentTrack.title : "Select a sound"}
              </h2>
              <p className="opacity-80 text-sm">
                {currentTrack ? currentTrack.frequency : "Choose from our neuroacoustic collection"}
              </p>
            </div>
          </div>

          <CardContent className="p-6">
            {currentTrack ? (
              <div>
                <div className="mb-6">
                  <p className="mb-2 text-sm">{currentTrack.description}</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${currentTrack.color}`}
                      style={{
                        width: `${(elapsed / currentTrack.duration) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{formatTime(elapsed)}</span>
                    <span>{formatTime(currentTrack.duration)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handlePlayPause}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    <p className="text-sm font-medium">
                      {isPlaying ? "Now Playing" : "Paused"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 w-1/3">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      {getVolumeIcon()}
                    </Button>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Select a sound track below to begin your neuroacoustic journey
                </p>
              </div>
            )}

            {/* Hidden audio element for real implementation */}
            <audio ref={audioRef} />
          </CardContent>
        </Card>
      </div>

      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full grid grid-cols-3">
            <TabsTrigger value="focus">Focus</TabsTrigger>
            <TabsTrigger value="relax">Relaxation</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
          </TabsList>
          
          <TabsContent value="focus">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audioTracks
                .filter((track) => track.category === "focus")
                .map((track) => (
                  <Card
                    key={track.id}
                    className={`overflow-hidden cursor-pointer transition-all ${
                      currentTrack?.id === track.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleTrackSelect(track)}
                  >
                    <div
                      className={`h-3 bg-gradient-to-r ${track.color}`}
                    ></div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{track.title}</CardTitle>
                      <CardDescription>{track.frequency}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">{track.description}</p>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground">
                      Duration: {formatTime(track.duration)}
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="relax">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audioTracks
                .filter((track) => track.category === "relax")
                .map((track) => (
                  <Card
                    key={track.id}
                    className={`overflow-hidden cursor-pointer transition-all ${
                      currentTrack?.id === track.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleTrackSelect(track)}
                  >
                    <div
                      className={`h-3 bg-gradient-to-r ${track.color}`}
                    ></div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{track.title}</CardTitle>
                      <CardDescription>{track.frequency}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">{track.description}</p>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground">
                      Duration: {formatTime(track.duration)}
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="sleep">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audioTracks
                .filter((track) => track.category === "sleep")
                .map((track) => (
                  <Card
                    key={track.id}
                    className={`overflow-hidden cursor-pointer transition-all ${
                      currentTrack?.id === track.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleTrackSelect(track)}
                  >
                    <div
                      className={`h-3 bg-gradient-to-r ${track.color}`}
                    ></div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{track.title}</CardTitle>
                      <CardDescription>{track.frequency}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">{track.description}</p>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground">
                      Duration: {formatTime(track.duration)}
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-10 bg-muted/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">About Neuroacoustic Therapy</h2>
          <div className="space-y-4 text-sm">
            <p>
              Neuroacoustic therapy uses specific sound frequencies to influence brainwave patterns. Different frequency ranges can promote various mental states:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Delta waves (0.5-4 Hz):</span> Associated with deep sleep and healing
              </li>
              <li>
                <span className="font-medium">Theta waves (4-8 Hz):</span> Promote relaxation, meditation, and creativity
              </li>
              <li>
                <span className="font-medium">Alpha waves (8-12 Hz):</span> Enhance focus, mindfulness, and learning
              </li>
              <li>
                <span className="font-medium">Beta waves (12-30 Hz):</span> Support alertness, concentration, and productivity
              </li>
            </ul>
            <p>
              For best results, use headphones and find a quiet space where you can listen without interruption. Regular sessions can help train your brain to enter these beneficial states more easily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuroSound;
