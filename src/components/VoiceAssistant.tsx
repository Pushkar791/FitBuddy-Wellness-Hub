
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface VoiceAssistantProps {
  onMessage: (message: string) => void;
  isProcessing: boolean;
  speakResponse?: boolean;
}

const VoiceAssistant = ({ onMessage, isProcessing, speakResponse = true }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition if available in the browser
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          if (!isProcessing) {
            onMessage(finalTranscript);
            setIsListening(false);
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          }
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive"
        });
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onMessage, isProcessing, toast]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "Listening",
        description: "Say something and I'll try to understand it.",
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="flex gap-2 mb-2">
        <Button
          onClick={toggleListening}
          disabled={isProcessing}
          variant="outline"
          size="sm"
          className={`${
            isListening ? "bg-red-100 text-red-800 hover:bg-red-200" : ""
          } transition-all hover-scale`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2" /> Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" /> Start Listening
            </>
          )}
        </Button>
        
        <Button
          onClick={toggleMute}
          variant="outline"
          size="sm"
          className="transition-all hover-scale"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 mr-2" /> Unmute
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 mr-2" /> Mute
            </>
          )}
        </Button>
      </div>
      
      {isListening && (
        <div className="text-sm text-muted-foreground animate-pulse mb-2">
          Listening...{transcript && <span> "{transcript}"</span>}
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
