
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";
import { format, addDays } from "date-fns";

interface EstimatorSchedule {
  id: string;
  name: string;
  availability: {
    date: string;
    availableHours: number;
    bookedHours: number;
  }[];
}

interface EstimatorAvailabilityProps {
  onSelectDate?: (date: string, estimatorId: string) => void;
  selectedDate?: string;
  selectedEstimatorId?: string;
}

export const EstimatorAvailability: React.FC<EstimatorAvailabilityProps> = ({
  onSelectDate,
  selectedDate,
  selectedEstimatorId
}) => {
  // In a real implementation, this would come from a database or API
  const mockEstimators: EstimatorSchedule[] = [
    {
      id: "1",
      name: "John Smith",
      availability: [
        { 
          date: format(new Date(), 'yyyy-MM-dd'), 
          availableHours: 3, 
          bookedHours: 5 
        },
        { 
          date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), 
          availableHours: 8, 
          bookedHours: 0 
        },
        { 
          date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), 
          availableHours: 4, 
          bookedHours: 4 
        },
      ]
    },
    {
      id: "2",
      name: "Jane Doe",
      availability: [
        { 
          date: format(new Date(), 'yyyy-MM-dd'), 
          availableHours: 0, 
          bookedHours: 8 
        },
        { 
          date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), 
          availableHours: 6, 
          bookedHours: 2 
        },
        { 
          date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), 
          availableHours: 8, 
          bookedHours: 0 
        },
      ]
    },
    {
      id: "3",
      name: "Alex Brown",
      availability: [
        { 
          date: format(new Date(), 'yyyy-MM-dd'), 
          availableHours: 2, 
          bookedHours: 6 
        },
        { 
          date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), 
          availableHours: 2, 
          bookedHours: 6 
        },
        { 
          date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), 
          availableHours: 4, 
          bookedHours: 4 
        },
      ]
    }
  ];

  const handleSelectTimeSlot = (date: string, estimatorId: string) => {
    if (onSelectDate) {
      onSelectDate(date, estimatorId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Estimator Availability</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockEstimators.map((estimator) => (
          <Card 
            key={estimator.id} 
            className={selectedEstimatorId === estimator.id ? "border-primary" : ""}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{estimator.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {estimator.availability.map((slot) => {
                  const isSelected = selectedDate === slot.date && selectedEstimatorId === estimator.id;
                  const isFullyBooked = slot.availableHours === 0;
                  
                  return (
                    <li 
                      key={`${estimator.id}-${slot.date}`}
                      className={`flex justify-between items-center p-2 rounded-md cursor-pointer border ${
                        isSelected 
                          ? 'bg-primary/10 border-primary' 
                          : isFullyBooked 
                            ? 'bg-muted text-muted-foreground' 
                            : 'hover:bg-muted/50'
                      }`}
                      onClick={() => !isFullyBooked && handleSelectTimeSlot(slot.date, estimator.id)}
                    >
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{format(new Date(slot.date), 'MMM dd, eee')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isFullyBooked ? (
                          <Badge variant="outline" className="bg-muted">Fully Booked</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                            {slot.availableHours}h Available
                          </Badge>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Note: Select an available time slot to assign an estimator to this project.</p>
      </div>
    </div>
  );
};
