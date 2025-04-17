
import { Message } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      <div
        className={`flex items-start gap-2 max-w-[80%] ${
          message.isUser ? "flex-row-reverse" : ""
        }`}
      >
        {!message.isUser && (
          <Avatar className="mt-1">
            <AvatarImage src="/placeholder.svg" alt="AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        )}
        <div
          className={`px-4 py-2 rounded-lg ${
            message.isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <p className="text-sm">{message.text}</p>
          <p className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        {message.isUser && (
          <Avatar className="mt-1">
            <AvatarFallback>
              <User size={18} />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
