
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User } from "lucide-react";
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
        { 
          date: format(addDays(new Date(), 3), 'yyyy-MM-dd'), 
          availableHours: 6, 
          bookedHours: 2 
        },
        { 
          date: format(addDays(new Date(), 4), 'yyyy-MM-dd'), 
          availableHours: 8, 
          bookedHours: 0 
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
        { 
          date: format(addDays(new Date(), 3), 'yyyy-MM-dd'), 
          availableHours: 5, 
          bookedHours: 3 
        },
        { 
          date: format(addDays(new Date(), 4), 'yyyy-MM-dd'), 
          availableHours: 4, 
          bookedHours: 4 
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
        { 
          date: format(addDays(new Date(), 3), 'yyyy-MM-dd'), 
          availableHours: 8, 
          bookedHours: 0 
        },
        { 
          date: format(addDays(new Date(), 4), 'yyyy-MM-dd'), 
          availableHours: 7, 
          bookedHours: 1 
        },
      ]
    }
  ];

  const handleSelectTimeSlot = (date: string, estimatorId: string) => {
    if (onSelectDate) {
      onSelectDate(date, estimatorId);
    }
  };

  // Find the next available date for each estimator
  const nextAvailableTimes = mockEstimators.map(estimator => {
    const nextAvailable = estimator.availability.find(slot => slot.availableHours > 0);
    return {
      estimatorId: estimator.id,
      estimatorName: estimator.name,
      nextAvailableDate: nextAvailable?.date || null,
      availableHours: nextAvailable?.availableHours || 0
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <CalendarDays className="h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-medium">Estimator Availability</h3>
      </div>
      
      <div className="mb-6">
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="pb-2 bg-blue-50 border-b">
            <CardTitle className="text-lg text-blue-800">Next Available Time Slots</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {nextAvailableTimes.map(item => (
                <div 
                  key={item.estimatorId}
                  className={`p-4 border rounded-md hover:bg-blue-50 cursor-pointer transition-colors ${
                    selectedEstimatorId === item.estimatorId ? "bg-blue-50 border-blue-300" : ""
                  }`}
                  onClick={() => item.nextAvailableDate && handleSelectTimeSlot(item.nextAvailableDate, item.estimatorId)}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{item.estimatorName}</span>
                  </div>
                  {item.nextAvailableDate ? (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          Available: {format(new Date(item.nextAvailableDate), 'MMM dd, eee')}
                        </span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-800">
                        {item.availableHours}h
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-sm text-red-600">No availability</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockEstimators.map((estimator) => (
          <Card 
            key={estimator.id} 
            className={selectedEstimatorId === estimator.id ? "border-primary shadow-md" : ""}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                {estimator.name}
              </CardTitle>
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
