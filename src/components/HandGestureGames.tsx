
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gamepad, Mic, Hand, Music, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// This is a placeholder component. In a real implementation, 
// we would integrate TensorFlow.js, MediaPipe, or other libraries
// for actual hand tracking.

const HandGestureGames = () => {
  const [activeGame, setActiveGame] = useState("shooter");
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isStarted) {
      toast({
        title: "Game Over!",
        description: `Your final score: ${score}`,
      });
      setIsStarted(false);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isStarted, timeLeft, score, toast]);

  const startGame = async () => {
    try {
      setScore(0);
      setTimeLeft(60);
      
      // This would be where we'd initialize the camera and hand tracking
      // In a real implementation, we'd use:
      // - TensorFlow.js for ML models
      // - MediaPipe for hand tracking
      
      // Simulating camera access for demo purposes
      if (videoRef.current && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        
        toast({
          title: "Game Started!",
          description: "Move your hand to play. Try making gestures!",
        });
        
        setIsStarted(true);
        
        // Simulate random score increases for demo purposes
        const scoreInterval = setInterval(() => {
          if (!isStarted) {
            clearInterval(scoreInterval);
            return;
          }
          // Random score increase on "detected" gestures
          if (Math.random() > 0.7) {
            setScore((prev) => prev + Math.floor(Math.random() * 10) + 1);
            // Show visual feedback
            if (canvasRef.current) {
              const ctx = canvasRef.current.getContext('2d');
              if (ctx) {
                const x = Math.random() * canvasRef.current.width;
                const y = Math.random() * canvasRef.current.height;
                
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.fill();
                
                setTimeout(() => {
                  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }, 200);
              }
            }
          }
        }, 1000);
        
        return () => clearInterval(scoreInterval);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Access Error",
        description: "Unable to access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopGame = () => {
    setIsStarted(false);
    
    // Stop the camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach((track) => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
    }
    
    toast({
      title: "Game Stopped",
      description: `Your score: ${score}`,
    });
  };

  const renderGameInstructions = () => {
    switch (activeGame) {
      case "shooter":
        return "Point your index finger like a gun to shoot targets. Close your hand to reload.";
      case "piano":
        return "Move your fingers up and down to play different piano notes. Move your hand left and right to change octaves.";
      case "basketball":
        return "Make a throwing motion with your hand to shoot the basketball. Time your release for the perfect shot.";
      case "conductor":
        return "Wave your hands to conduct the virtual orchestra. The speed and style of your movements affect the music.";
      default:
        return "Select a game and follow the specific instructions to play using hand gestures.";
    }
  };

  return (
    <div className="p-4 h-full">
      <Card className="h-full flex flex-col animate-fade-in">
        <CardHeader>
          <CardTitle className="text-center">Hand Gesture Games</CardTitle>
          <CardDescription className="text-center">
            Play interactive games using just your hand gestures
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeGame} onValueChange={setActiveGame} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 mx-4">
            <TabsTrigger value="shooter" className="flex items-center gap-1">
              <Target className="w-4 h-4" /> Shooter
            </TabsTrigger>
            <TabsTrigger value="piano" className="flex items-center gap-1">
              <Music className="w-4 h-4" /> Air Piano
            </TabsTrigger>
            <TabsTrigger value="basketball" className="flex items-center gap-1">
              <Gamepad className="w-4 h-4" /> Basketball
            </TabsTrigger>
            <TabsTrigger value="conductor" className="flex items-center gap-1">
              <Mic className="w-4 h-4" /> Conductor
            </TabsTrigger>
          </TabsList>
          
          <CardContent className="flex-1 flex flex-col">
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border mb-4">
              {isStarted ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  ></video>
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                    className="absolute inset-0 w-full h-full"
                  ></canvas>
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    Score: {score}
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    Time: {timeLeft}s
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full flex-col gap-4 p-4">
                  <Hand className="h-16 w-16 text-muted-foreground animate-bounce" />
                  <p className="text-white text-center">
                    {renderGameInstructions()}
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">How to Play: {activeGame.charAt(0).toUpperCase() + activeGame.slice(1)}</h3>
              <p className="text-sm text-muted-foreground">
                {renderGameInstructions()}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">Key Gestures</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <ul className="text-xs space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 p-1 rounded">✋</span>
                      <span>Open hand - Select / Grab</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 p-1 rounded">👆</span>
                      <span>Point - Shoot / Click</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 p-1 rounded">✊</span>
                      <span>Closed fist - Reset / Reload</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-primary/20 p-1 rounded">👍</span>
                      <span>Thumbs up - Confirm / OK</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">Tips</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <ul className="text-xs space-y-1">
                    <li>• Ensure you have good lighting</li>
                    <li>• Keep your hands within camera view</li>
                    <li>• Make clear, distinct gestures</li>
                    <li>• Find the right distance from camera</li>
                    <li>• Avoid busy backgrounds for best tracking</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          
          <CardFooter>
            <div className="w-full flex justify-center gap-4">
              {!isStarted ? (
                <Button onClick={startGame} className="animate-pulse hover-scale">
                  <Gamepad className="mr-2 h-4 w-4" /> Start Game
                </Button>
              ) : (
                <Button variant="destructive" onClick={stopGame}>
                  Stop Game
                </Button>
              )}
            </div>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default HandGestureGames;
