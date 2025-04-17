
export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export type KnowledgeEntry = {
  topic: string;
  content: string;
};
