
import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { EstimatorScheduleView } from "@/components/estimators/EstimatorScheduleView";
import { CalendarDays, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const EstimatorSchedulePage = () => {
  const [view, setView] = useState<"week" | "day">("week");
  const [selectedEstimator, setSelectedEstimator] = useState<string>("all");
  
  // Mock estimators - in a real app, this would come from your backend
  const estimators = [
    { id: "est1", name: "John Smith" },
    { id: "est2", name: "Emily Johnson" },
    { id: "est3", name: "Michael Brown" },
    { id: "est4", name: "Sarah Wilson" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="Estimator Schedule" />
      
      <main className="container mx-auto p-4 mt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <h1 className="text-2xl font-bold">Estimator Schedule</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={selectedEstimator} onValueChange={setSelectedEstimator}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Select Estimator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Estimators</SelectItem>
                  {estimators.map(estimator => (
                    <SelectItem key={estimator.id} value={estimator.id}>{estimator.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 bg-white border rounded-md">
              <Button 
                variant={view === "week" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setView("week")}
              >
                Week
              </Button>
              <Button 
                variant={view === "day" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setView("day")}
              >
                Day
              </Button>
            </div>
          </div>
        </div>
        
        <EstimatorScheduleView 
          view={view} 
          selectedEstimator={selectedEstimator}
        />
      </main>
    </div>
  );
};

export default EstimatorSchedulePage;
