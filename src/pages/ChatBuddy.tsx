import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, Brain, SmilePlus, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import EmotionTracker from "@/components/EmotionTracker";
import HandGestureGames from "@/components/HandGestureGames";
import KnowledgeBase from "@/components/KnowledgeBase";
import VoiceAssistant from "@/components/VoiceAssistant";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { generateChatResponse } from "@/services/chatService";
import { Message } from "@/types/chat";
import { knowledgeBaseData } from "@/data/knowledgeBaseData";

const ChatBuddy = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I'm ChatBuddy, your AI companion for health and wellness. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Initialize speech synthesis
  const synth = window.speechSynthesis;
  
  useEffect(() => {
    // Set up speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[event.resultIndex][0].transcript;
          setInput(prev => prev + " " + transcript.trim());
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event);
          setIsRecording(false);
          toast({
            title: "Voice Recognition Error",
            description: "There was an issue with the voice input.",
            variant: "destructive",
          });
        };
      }
    }
    
    // Scroll to bottom whenever messages change
    scrollToBottom();
    
    return () => {
      // Clean up
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    setTimeout(() => {
      generateResponse(userMessage.text);
    }, 200);
  };
  
  const generateResponse = (userText: string) => {
    const response = generateChatResponse(userText);
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsProcessing(false);
    
    if (isSpeaking) {
      speakText(response);
    }
  };
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast({
          title: "Listening...",
          description: "Speak now and your words will appear in the input.",
        });
      } catch (error) {
        console.error("Failed to start recording:", error);
        toast({
          title: "Error Starting Voice Input",
          description: "There was a problem with activating the microphone.",
          variant: "destructive",
        });
      }
    }
  };
  
  const speakText = (text: string) => {
    if (!synth) return;
    
    // Cancel any ongoing speech
    if (synth.speaking) {
      synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    synth.speak(utterance);
  };
  
  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    toast({
      title: !isSpeaking ? "Voice Response Enabled" : "Voice Response Disabled",
      description: !isSpeaking ? "ChatBuddy will now speak responses." : "ChatBuddy will no longer speak responses.",
    });
  };

  const handleVoiceAssistantMessage = (message: string) => {
    setInput(message);
    // Automatically submit after a short delay
    setTimeout(() => {
      handleSubmit(new Event('submit') as any);
    }, 200); // Reduced from 300ms to 200ms for faster response
  };

  return (
    <div className="container max-w-4xl mx-auto pt-8 pb-16">
      <Card className="h-[calc(100vh-8rem)] flex flex-col shadow-lg animate-fade-in">
        <CardHeader className="border-b bg-gradient-to-r from-primary/20 to-secondary/20">
          <CardTitle className="text-center">
            <span className="gradient-text text-xl md:text-2xl">ChatBuddy Health & Wellness</span>
          </CardTitle>
          <CardDescription className="text-center max-w-xl mx-auto">
            Your supportive AI companion for health, wellness, and mental fitness. Ask me anything related to wellbeing!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-4 mx-4 mt-2">
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <HeartPulse className="w-4 h-4" /> Chat
              </TabsTrigger>
              <TabsTrigger value="emotions" className="flex items-center gap-1">
                <SmilePlus className="w-4 h-4" /> Emotions
              </TabsTrigger>
              <TabsTrigger value="games" className="flex items-center gap-1">
                <Brain className="w-4 h-4" /> Games
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> Knowledge
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isProcessing && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t">
                <ChatInput
                  input={input}
                  isRecording={isRecording}
                  isSpeaking={isSpeaking}
                  onInputChange={setInput}
                  onSubmit={handleSubmit}
                  onToggleRecording={toggleRecording}
                  onToggleSpeaking={toggleSpeaking}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="emotions" className="flex-1">
              <EmotionTracker />
            </TabsContent>
            
            <TabsContent value="games" className="flex-1">
              <HandGestureGames />
            </TabsContent>
            
            <TabsContent value="knowledge" className="flex-1">
              <KnowledgeBase knowledgeData={knowledgeBaseData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {activeTab === "chat" && (
        <div className="mt-4 flex justify-center">
          <VoiceAssistant 
            onMessage={handleVoiceAssistantMessage} 
            isProcessing={isProcessing}
            speakResponse={isSpeaking}
          />
        </div>
      )}
    </div>
  );
};

export default ChatBuddy;
