import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PanelboardDashboard } from "@/components/PanelboardDashboard";
import { EstimatorAvailability } from "@/components/estimators/EstimatorAvailability";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Index: React.FC = () => {
  const [showEstimatorAvailability, setShowEstimatorAvailability] = useState(false);
  const [selectedEstimatorId, setSelectedEstimatorId] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  const handleEstimatorSelect = (date: string, estimatorId: string) => {
    setSelectedDate(date);
    setSelectedEstimatorId(estimatorId);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* First card - Estimator Availability Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Estimator Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-sm text-muted-foreground">
                View and assign available estimators to your projects
              </div>
              <Button 
                className="w-full" 
                onClick={() => setShowEstimatorAvailability(true)}
              >
                View Estimator Schedule
              </Button>
            </CardContent>
          </Card>
          
          {/* Keep other dashboard cards */}
          <PanelboardDashboard />
        </div>
      </main>
      
      {/* Estimator Availability Dialog */}
      <Dialog 
        open={showEstimatorAvailability} 
        onOpenChange={setShowEstimatorAvailability}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Estimator Availability</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <EstimatorAvailability 
              onSelectDate={handleEstimatorSelect}
              selectedDate={selectedDate}
              selectedEstimatorId={selectedEstimatorId}
            />
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={() => setShowEstimatorAvailability(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
