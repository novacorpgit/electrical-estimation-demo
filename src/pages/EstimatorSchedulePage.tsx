
import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CalendarDays } from "lucide-react";
import { CalendarScheduler } from "@/components/estimators/CalendarScheduler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EstimatorScheduleView } from "@/components/estimators/EstimatorScheduleView";
import { Toaster } from "@/components/ui/sonner";

const EstimatorSchedulePage = () => {
  const [viewType, setViewType] = useState<"calendar" | "list">("calendar");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="Estimator Schedule" />
      
      <main className="container mx-auto p-4 mt-4">
        <div className="flex items-center gap-2 mb-6">
          <CalendarDays className="h-5 w-5 text-blue-600" />
          <h1 className="text-2xl font-bold">Estimator Schedule</h1>
        </div>
        
        <Tabs value={viewType} onValueChange={(value) => setViewType(value as "calendar" | "list")} className="mb-6">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {viewType === "calendar" ? (
          <CalendarScheduler />
        ) : (
          <EstimatorScheduleView />
        )}
      </main>
      
      {/* Adding toast provider for notifications */}
      <Toaster />
    </div>
  );
};

export default EstimatorSchedulePage;
