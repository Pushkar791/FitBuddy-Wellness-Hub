
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type KnowledgeEntry = {
  topic: string;
  content: string;
};

interface KnowledgeBaseProps {
  knowledgeData: KnowledgeEntry[];
}

const KnowledgeBase = ({ knowledgeData }: KnowledgeBaseProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<KnowledgeEntry | null>(null);

  const filteredTopics = knowledgeData.filter(entry =>
    entry.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTopicSelect = (entry: KnowledgeEntry) => {
    setSelectedTopic(entry);
  };

  const handleClearSelection = () => {
    setSelectedTopic(null);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search knowledge base..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {selectedTopic ? (
        <Card className="flex-1 overflow-auto animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle>{selectedTopic.topic}</CardTitle>
            <CardDescription>
              Health and wellness information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[12rem] bg-muted"
              readOnly
              value={selectedTopic.content}
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleClearSelection}
            >
              Back to Topics
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto pb-4">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((entry) => (
              <Card
                key={entry.topic}
                className="hover:bg-accent transition-colors cursor-pointer"
                onClick={() => handleTopicSelect(entry)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{entry.topic}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {entry.content.substring(0, 120)}...
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 flex justify-center items-center h-32">
              <p className="text-muted-foreground">No matching topics found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
