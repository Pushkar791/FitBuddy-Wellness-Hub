
import { useState } from "react";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

type Symptom = {
  id: number;
  name: string;
  color: string;
};

const SYMPTOMS: Symptom[] = [
  { id: 1, name: "Cramps", color: "bg-red-100 text-red-800 hover:bg-red-200" },
  { id: 2, name: "Headache", color: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
  { id: 3, name: "Bloating", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  { id: 4, name: "Fatigue", color: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
  { id: 5, name: "Mood Swings", color: "bg-green-100 text-green-800 hover:bg-green-200" },
  { id: 6, name: "Cravings", color: "bg-pink-100 text-pink-800 hover:bg-pink-200" },
];

const SheSync = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [periodStart, setPeriodStart] = useState<Date | null>(null);
  const [periodEnd, setPeriodEnd] = useState<Date | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [mood, setMood] = useState<number>(3);
  const [cycleHistory, setCycleHistory] = useState<{start: Date, end: Date}[]>([]);

  const handlePeriodToggle = () => {
    if (date) {
      if (!periodStart) {
        setPeriodStart(date);
      } else if (!periodEnd && date > periodStart) {
        setPeriodEnd(date);
        // Add to history when a complete cycle is logged
        if (periodStart) {
          setCycleHistory([...cycleHistory, {start: new Date(periodStart), end: new Date(date)}]);
        }
      } else {
        setPeriodStart(date);
        setPeriodEnd(null);
      }
    }
  };

  const handleSymptomToggle = (symptomId: number) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  const getSelectedSymptomsNames = () => {
    return selectedSymptoms.map(id => 
      SYMPTOMS.find(s => s.id === id)?.name
    ).join(", ");
  };

  // Function to determine if a date is in the period range
  const isInPeriod = (date: Date) => {
    if (!periodStart) return false;
    if (!periodEnd) return format(date, 'yyyy-MM-dd') === format(periodStart, 'yyyy-MM-dd');
    
    const d = new Date(date);
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    
    return d >= start && d <= end;
  };

  // Function to check if a date is in any historical period
  const isInHistoricalPeriod = (date: Date) => {
    return cycleHistory.some(cycle => {
      const cycleStart = new Date(cycle.start);
      const cycleEnd = new Date(cycle.end);
      const checkDate = new Date(date);
      return checkDate >= cycleStart && checkDate <= cycleEnd;
    });
  };

  // Predict next period based on average cycle length
  const predictNextPeriod = () => {
    if (cycleHistory.length === 0 && !periodStart) return null;
    
    let lastPeriodStart;
    if (periodStart) {
      lastPeriodStart = new Date(periodStart);
    } else {
      lastPeriodStart = new Date(cycleHistory[cycleHistory.length - 1].start);
    }
    
    // Default to 28 days if not enough history
    let avgCycleLength = 28; 
    
    if (cycleHistory.length > 1) {
      // Calculate average cycle length from history
      let totalDays = 0;
      for (let i = 1; i < cycleHistory.length; i++) {
        const currentStart = new Date(cycleHistory[i].start);
        const prevStart = new Date(cycleHistory[i-1].start);
        const diffTime = Math.abs(currentStart.getTime() - prevStart.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalDays += diffDays;
      }
      avgCycleLength = Math.round(totalDays / (cycleHistory.length - 1));
    }
    
    const nextPeriodDate = new Date(lastPeriodStart);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);
    return nextPeriodDate;
  };

  const nextPeriod = predictNextPeriod();
  const averageCycleLength = cycleHistory.length > 1 ? 
    Math.round(cycleHistory.reduce((sum, cycle, i, arr) => {
      if (i === 0) return sum;
      const current = new Date(cycle.start);
      const prev = new Date(arr[i-1].start);
      return sum + Math.ceil((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    }, 0) / (cycleHistory.length - 1)) : 
    28;

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">
            <span className="gradient-text">SheSync</span> Period Tracker
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Track your menstrual cycle, symptoms, and mood to better understand your body's patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="animate-on-scroll">
              <CardHeader>
                <CardTitle>Cycle Calendar</CardTitle>
                <CardDescription>
                  Track your period days and get predictions for your next cycle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md overflow-hidden border">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md pointer-events-auto"
                    modifiersStyles={{
                      selected: {
                        backgroundColor: 'rgb(139, 92, 246)',
                        color: 'white'
                      }
                    }}
                    modifiers={{
                      period: (date) => isInPeriod(date) || isInHistoricalPeriod(date)
                    }}
                    modifiersClassNames={{
                      period: "bg-pink-100 text-pink-800 hover:bg-pink-200"
                    }}
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handlePeriodToggle} className="flex-1">
                      {!periodStart ? "Set Period Start" : !periodEnd ? "Set Period End" : "Reset Period"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {periodStart && (
                      <Badge variant="outline" className="bg-pink-50 text-pink-800 hover:bg-pink-100">
                        Period start: {format(periodStart, "MMM d, yyyy")}
                      </Badge>
                    )}
                    {periodEnd && (
                      <Badge variant="outline" className="bg-pink-50 text-pink-800 hover:bg-pink-100">
                        Period end: {format(periodEnd, "MMM d, yyyy")}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="animate-on-scroll">
              <CardHeader>
                <CardTitle>Symptoms Tracker</CardTitle>
                <CardDescription>
                  Record symptoms for {date ? format(date, "MMMM d, yyyy") : "selected date"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map((symptom) => (
                    <Badge 
                      key={symptom.id}
                      variant="outline"
                      className={`cursor-pointer ${selectedSymptoms.includes(symptom.id) ? symptom.color : "bg-muted"}`}
                      onClick={() => handleSymptomToggle(symptom.id)}
                    >
                      {symptom.name}
                      {selectedSymptoms.includes(symptom.id) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mood (1-5)</label>
                  <div className="flex justify-between items-center">
                    <span>😢</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={mood}
                      onChange={(e) => setMood(parseInt(e.target.value))}
                      className="flex-grow mx-4"
                    />
                    <span>😊</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <textarea 
                    className="w-full h-20 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Add any notes about how you're feeling today..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>

                <Button className="w-full hover-scale">
                  Save for {date ? format(date, "MMM d") : "today"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Card className="animate-on-scroll">
            <CardHeader>
              <CardTitle>Cycle Insights</CardTitle>
              <CardDescription>
                Track patterns and get predictions for your next cycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {periodStart && periodEnd ? (
                <div className="space-y-4">
                  <p className="text-sm">
                    Your last cycle lasted {Math.ceil(
                      (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24) + 1
                    )} days.
                  </p>
                  <p className="text-sm">
                    Common symptoms: {getSelectedSymptomsNames() || "None recorded"}
                  </p>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Your Cycle History</h3>
                    <div className="flex gap-2 flex-wrap">
                      {cycleHistory.map((cycle, idx) => (
                        <Badge key={idx} variant="outline" className="bg-pink-50 text-pink-800">
                          {format(cycle.start, "MMM d")} - {format(cycle.end, "MMM d")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {nextPeriod && (
                    <div className="mt-4 p-3 bg-pink-50 rounded-md border border-pink-200">
                      <p className="text-sm font-medium text-pink-800">
                        Next period may start around {format(nextPeriod, "MMMM d, yyyy")}
                      </p>
                      <p className="text-xs text-pink-700 mt-1">
                        Based on your average cycle length of {averageCycleLength} days
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Add at least one complete cycle to see insights and predictions.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SheSync;
