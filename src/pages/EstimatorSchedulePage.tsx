
import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { EstimatorScheduleView } from "@/components/estimators/EstimatorScheduleView";
import { CalendarDays } from "lucide-react";

const EstimatorSchedulePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="Estimator Schedule" />
      
      <main className="container mx-auto p-4 mt-4">
        <div className="flex items-center gap-2 mb-6">
          <CalendarDays className="h-5 w-5 text-blue-600" />
          <h1 className="text-2xl font-bold">Estimator Schedule</h1>
        </div>
        
        <EstimatorScheduleView />
      </main>
    </div>
  );
};

export default EstimatorSchedulePage;
