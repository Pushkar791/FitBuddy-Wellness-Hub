
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { SmilePlus, Frown, Meh, Smile, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Emotion = "happy" | "sad" | "neutral" | "excited" | "anxious" | "tired" | "calm" | "stressed";

interface EmotionEntry {
  date: Date;
  emotion: Emotion;
  note: string;
}

const EmotionTracker = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const { toast } = useToast();

  // Load saved emotions from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("emotion-entries");
    if (savedEntries) {
      try {
        // Parse stored entries and convert date strings back to Date objects
        const parsed = JSON.parse(savedEntries);
        setEntries(
          parsed.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date),
          }))
        );
      } catch (error) {
        console.error("Failed to parse saved emotions:", error);
      }
    }
  }, []);

  // Save emotions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("emotion-entries", JSON.stringify(entries));
  }, [entries]);

  const saveEmotion = () => {
    if (!selectedDate || !selectedEmotion) {
      toast({
        title: "Input Required",
        description: "Please select both a date and an emotion.",
        variant: "destructive",
      });
      return;
    }

    // Create new entry
    const newEntry: EmotionEntry = {
      date: selectedDate,
      emotion: selectedEmotion,
      note: note.trim(),
    };

    // Remove any existing entry for this date before adding the new one
    const filteredEntries = entries.filter(
      (entry) => entry.date.toDateString() !== selectedDate.toDateString()
    );

    setEntries([...filteredEntries, newEntry]);
    setNote("");
    
    toast({
      title: "Emotion Saved",
      description: `You logged feeling ${selectedEmotion} on ${selectedDate.toLocaleDateString()}.`,
    });
  };

  // Get entry for selected date if it exists
  const currentEntry = selectedDate
    ? entries.find((entry) => entry.date.toDateString() === selectedDate.toDateString())
    : undefined;

  // Update emotion if there's an existing entry for the selected date
  useEffect(() => {
    if (currentEntry) {
      setSelectedEmotion(currentEntry.emotion);
      setNote(currentEntry.note);
    } else {
      setSelectedEmotion(null);
      setNote("");
    }
  }, [currentEntry, selectedDate]);

  // Function to map emotion to color class
  const getEmotionColorClass = (emotion: Emotion): string => {
    switch (emotion) {
      case "happy":
        return "bg-green-100 border-green-400 text-green-700";
      case "excited":
        return "bg-purple-100 border-purple-400 text-purple-700";
      case "calm":
        return "bg-blue-100 border-blue-400 text-blue-700";
      case "neutral":
        return "bg-gray-100 border-gray-400 text-gray-700";
      case "anxious":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      case "stressed":
        return "bg-orange-100 border-orange-400 text-orange-700";
      case "tired":
        return "bg-indigo-100 border-indigo-400 text-indigo-700";
      case "sad":
        return "bg-red-100 border-red-400 text-red-700";
      default:
        return "bg-gray-100 border-gray-400 text-gray-700";
    }
  };

  // Function to get calendar day class based on emotion
  const getDayClass = (date: Date): string => {
    const entry = entries.find(
      (entry) => entry.date.toDateString() === date.toDateString()
    );
    
    if (!entry) return "";
    
    switch (entry.emotion) {
      case "happy":
      case "excited":
      case "calm":
        return "bg-green-100 text-green-900 rounded-full";
      case "neutral":
        return "bg-gray-100 text-gray-900 rounded-full";
      case "anxious":
      case "stressed":
        return "bg-yellow-100 text-yellow-900 rounded-full";
      case "tired":
      case "sad":
        return "bg-red-100 text-red-900 rounded-full";
      default:
        return "";
    }
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <Card className="mb-4 w-full animate-fade-in">
        <CardHeader>
          <CardTitle className="text-center">Emotion Tracker</CardTitle>
          <CardDescription className="text-center">
            Track your emotional wellbeing over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">Select Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-md"
                modifiers={{
                  emotion: (date) => 
                    entries.some(entry => entry.date.toDateString() === date.toDateString())
                }}
                modifiersClassNames={{
                  emotion: "font-bold"
                }}
                components={{
                  DayContent: ({ date }) => {
                    const entry = entries.find(
                      (e) => e.date.toDateString() === date.toDateString()
                    );
                    return (
                      <div className={entry ? getDayClass(date) : ""}>
                        {date.getDate()}
                      </div>
                    );
                  },
                }}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">How are you feeling today?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className={`flex flex-col items-center p-2 h-auto transition-all ${
                    selectedEmotion === "happy" ? "ring-2 ring-primary bg-primary/10" : ""
                  }`}
                  onClick={() => setSelectedEmotion("happy")}
                >
                  <Smile className="h-6 w-6 mb-1 text-green-500" />
                  <span className="text-xs">Happy</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`flex flex-col items-center p-2 h-auto transition-all ${
                    selectedEmotion === "sad" ? "ring-2 ring-primary bg-primary/10" : ""
                  }`}
                  onClick={() => setSelectedEmotion("sad")}
                >
                  <Frown className="h-6 w-6 mb-1 text-red-500" />
                  <span className="text-xs">Sad</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`flex flex-col items-center p-2 h-auto transition-all ${
                    selectedEmotion === "neutral" ? "ring-2 ring-primary bg-primary/10" : ""
                  }`}
                  onClick={() => setSelectedEmotion("neutral")}
                >
                  <Meh className="h-6 w-6 mb-1 text-gray-500" />
                  <span className="text-xs">Neutral</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`flex flex-col items-center p-2 h-auto transition-all ${
                    selectedEmotion === "excited" ? "ring-2 ring-primary bg-primary/10" : ""
                  }`}
                  onClick={() => setSelectedEmotion("excited")}
                >
                  <SmilePlus className="h-6 w-6 mb-1 text-purple-500" />
                  <span className="text-xs">Excited</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`flex flex-col items-center p-2 h-auto transition-all ${
                    selectedEmotion === "anxious" ? "ring-2 ring-primary bg-primary/10" : ""
                  }`}
                  onClick={() => setSelectedEmotion("anxious")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-1 text-yellow-500">
                    <circle cx="12" cy="12" r="10"/><path d="M8 15h8"/><path d="M8 9h2"/><path d="M14 9h2"/>
                  </svg>
                  <span className="text-xs">Anxious</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`flex flex-col items-center p-2 h-auto transition-all ${
                    selectedEmotion === "tired" ? "ring-2 ring-primary bg-primary/10" : ""
                  }`}
                  onClick={() => setSelectedEmotion("tired")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-1 text-indigo-500">
                    <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>
                  </svg>
                  <span className="text-xs">Tired</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`flex flex-col items-center p-2 h-auto transition-all ${
                    selectedEmotion === "calm" ? "ring-2 ring-primary bg-primary/10" : ""
                  }`}
                  onClick={() => setSelectedEmotion("calm")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-1 text-blue-500">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span className="text-xs">Calm</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`flex flex-col items-center p-2 h-auto transition-all ${
                    selectedEmotion === "stressed" ? "ring-2 ring-primary bg-primary/10" : ""
                  }`}
                  onClick={() => setSelectedEmotion("stressed")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-1 text-orange-500">
                    <path d="m2 8 2 2-2 2 2 2-2 2"/>
                    <path d="m22 8-2 2 2 2-2 2 2 2"/>
                    <path d="M8 18.82 6.5 21"/>
                    <path d="M15.5 21 14 18.82"/>
                    <path d="M8.5 3h7"/>
                    <path d="M11.28 10.8c.04.3.28.55.6.59 1.5.19 2.8 1.19 3.33 2.55.27.66 1.09.97 1.75.65.67-.31.96-1.12.59-1.75-.92-1.85-2.84-3.18-5.18-3.39a.66.66 0 0 0-.7.66c0 .24.1.45.28.57"/>
                    <path d="M9.87 8.14c.03.31.29.56.61.59 2.93.26 5.22 2.73 5.18 5.84"/>
                    <path d="M9.4 5.5a.62.62 0 0 0 .62.6c4.56.12 8.18 3.8 8.18 8.39"/>
                  </svg>
                  <span className="text-xs">Stressed</span>
                </Button>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Notes (optional)</h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 border rounded-md h-20 resize-none"
                  placeholder="Add any thoughts about your day..."
                />
              </div>

              <Button 
                onClick={saveEmotion} 
                className="w-full mt-4"
                disabled={!selectedDate || !selectedEmotion}
              >
                <Heart className="mr-2 h-4 w-4" /> Save Emotion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 overflow-auto animate-fade-in-delayed">
        <CardHeader>
          <CardTitle>Your Emotion History</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No emotions recorded yet. Start tracking how you feel!
            </p>
          ) : (
            <div className="space-y-2">
              {[...entries]
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((entry, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg ${getEmotionColorClass(
                      entry.emotion
                    )} animate-fade-in`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{entry.emotion.charAt(0).toUpperCase() + entry.emotion.slice(1)}</p>
                        <p className="text-xs">
                          {entry.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-500"
                        onClick={() => {
                          setEntries(
                            entries.filter(
                              (e) => e.date.toDateString() !== entry.date.toDateString()
                            )
                          );
                          toast({
                            title: "Entry Deleted",
                            description: `Entry for ${entry.date.toLocaleDateString()} has been removed.`,
                          });
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    </div>
                    {entry.note && <p className="mt-2 text-sm">{entry.note}</p>}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionTracker;
