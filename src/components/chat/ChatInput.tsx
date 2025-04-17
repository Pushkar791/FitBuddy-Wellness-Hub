
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  isRecording: boolean;
  isSpeaking: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleRecording: () => void;
  onToggleSpeaking: () => void;
}

const ChatInput = ({
  input,
  isRecording,
  isSpeaking,
  onInputChange,
  onSubmit,
  onToggleRecording,
  onToggleSpeaking,
}: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onToggleSpeaking}
        title={isSpeaking ? "Disable voice response" : "Enable voice response"}
      >
        {isSpeaking ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-x">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="22" x2="16" y1="9" y2="15" />
            <line x1="16" x2="22" y1="9" y2="15" />
          </svg>
        )}
      </Button>
      <Button
        type="button"
        variant={isRecording ? "destructive" : "ghost"}
        size="icon"
        onClick={onToggleRecording}
        className={isRecording ? "animate-pulse" : ""}
        title={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
      </Button>
      <Input
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Ask about health, wellness, or mental fitness..."
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={!input.trim()}>
        <Send size={18} />
      </Button>
    </form>
  );
};

export default ChatInput;
