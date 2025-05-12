
import React, { useState } from "react";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, ChevronLeft, ChevronRight, User } from "lucide-react";

// Import types
import { ExtendedUser, Project } from "@/types/panelboard-types";
import { EstimatorCalendarDay } from "./EstimatorCalendarDay";
import { EstimatorLoadSummary } from "./EstimatorLoadSummary";

// Mock data for estimators (in a real app, fetch from API/database)
const mockEstimators = [
  { 
    id: "est1", 
    name: "John Smith", 
    initials: "JS",
    role: "Estimator",
    status: "Active",
    workHoursPerWeek: 40,
    profilePicture: "",
    leaveBalance: {
      annual: 20,
      sick: 10,
      personal: 5,
      maternity: 0,
      paternity: 0,
      carried: 2,
    },
  },
  { 
    id: "est2", 
    name: "Emily Johnson", 
    initials: "EJ",
    role: "Estimator",
    status: "Active",
    workHoursPerWeek: 40,
    profilePicture: "",
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 3,
      maternity: 0,
      paternity: 0,
      carried: 0,
    },
  },
  { 
    id: "est3", 
    name: "Michael Brown", 
    initials: "MB",
    role: "Estimator",
    status: "Active",
    workHoursPerWeek: 32,
    profilePicture: "",
    leaveBalance: {
      annual: 18,
      sick: 8,
      personal: 4,
      maternity: 0,
      paternity: 0,
      carried: 1,
    },
  }
] as ExtendedUser[];

// Mock project allocations
const mockProjectAllocations = [
  {
    id: "project1",
    projectName: "Commercial Building - Melbourne CBD",
    clientName: "ABC Construction",
    estimatorId: "est1",
    date: "2025-05-12",
    startTime: "10:00",
    endTime: "13:00",
    hours: 3,
    status: "In Progress"
  },
  {
    id: "project2",
    projectName: "Residential Development - Brunswick",
    clientName: "XYZ Properties",
    estimatorId: "est1",
    date: "2025-05-14",
    startTime: "13:00",
    endTime: "17:00",
    hours: 4,
    status: "Draft"
  },
  {
    id: "project3",
    projectName: "Hospital Renovation",
    clientName: "Healthcare Group",
    estimatorId: "est2",
    date: "2025-05-12",
    startTime: "09:00",
    endTime: "15:00",
    hours: 6,
    status: "In Progress"
  },
  {
    id: "project4",
    projectName: "Office Fit-out",
    clientName: "Corporate Services",
    estimatorId: "est3",
    date: "2025-05-13",
    startTime: "14:00",
    endTime: "17:00",
    hours: 3,
    status: "In Progress"
  },
  {
    id: "project5",
    projectName: "School Extension",
    clientName: "Education Department",
    estimatorId: "est1",
    date: "2025-05-15",
    startTime: "10:00",
    endTime: "16:00",
    hours: 6,
    status: "Draft"
  },
];

// Mock events (meetings, leaves, etc.)
const mockEvents = [
  {
    id: "event1",
    type: "Meeting",
    title: "Morning Huddle",
    description: "Daily team catch-up",
    estimatorIds: ["est1", "est2", "est3"],
    date: "2025-05-12",
    startTime: "09:00",
    endTime: "09:30",
    recurring: true
  },
  {
    id: "event2",
    type: "Leave",
    title: "Annual Leave",
    description: "",
    estimatorIds: ["est2"],
    date: "2025-05-16",
    startTime: "09:00",
    endTime: "17:00",
    recurring: false
  },
  {
    id: "event3",
    type: "Meeting",
    title: "Client Meeting",
    description: "Project review with ABC Construction",
    estimatorIds: ["est1"],
    date: "2025-05-13",
    startTime: "10:00",
    endTime: "11:30",
    recurring: false
  }
];

export const EstimatorScheduleView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEstimators, setSelectedEstimators] = useState<string[]>(mockEstimators.map(est => est.id));
  const [viewMode, setViewMode] = useState<"week" | "day">("week");

  // Calculate the start of the current week (Monday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate an array of dates for the current week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePrevWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEstimatorToggle = (estimatorId: string) => {
    setSelectedEstimators(prev => {
      if (prev.includes(estimatorId)) {
        return prev.filter(id => id !== estimatorId);
      } else {
        return [...prev, estimatorId];
      }
    });
  };

  const handleSelectAllEstimators = () => {
    setSelectedEstimators(mockEstimators.map(est => est.id));
  };

  const handleUnselectAllEstimators = () => {
    setSelectedEstimators([]);
  };

  // Filter estimators based on selection
  const filteredEstimators = mockEstimators.filter(est => 
    selectedEstimators.includes(est.id)
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrevWeek} size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleToday}>Today</Button>
          <Button variant="outline" onClick={handleNextWeek} size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium ml-2">
            {format(weekStart, "MMMM d")} - {format(addDays(weekStart, 6), "MMMM d, yyyy")}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as "week" | "day")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="View mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week view</SelectItem>
              <SelectItem value="day">Day view</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estimator selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h3 className="text-lg font-medium mb-2 md:mb-0 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Estimators
            </h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAllEstimators}
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleUnselectAllEstimators}
              >
                Clear
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {mockEstimators.map(estimator => (
              <Badge 
                key={estimator.id} 
                variant={selectedEstimators.includes(estimator.id) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/90 px-3 py-1.5"
                onClick={() => handleEstimatorToggle(estimator.id)}
              >
                {estimator.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Load summary */}
      <EstimatorLoadSummary 
        estimators={filteredEstimators} 
        projectAllocations={mockProjectAllocations} 
        events={mockEvents} 
        startDate={weekStart}
      />

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 border rounded-lg bg-white overflow-hidden">
        {/* Header row with days */}
        {weekDays.map((day, index) => (
          <div 
            key={index}
            className={`p-2 text-center border-b ${
              isSameDay(day, new Date()) ? 'bg-blue-50 font-bold' : ''
            }`}
          >
            <div className="text-lg">{format(day, "d")}</div>
            <div className="text-sm text-gray-500">{format(day, "EEE")}</div>
          </div>
        ))}

        {/* Calendar content */}
        {filteredEstimators.map(estimator => (
          <React.Fragment key={estimator.id}>
            {weekDays.map((day, dayIndex) => (
              <EstimatorCalendarDay
                key={`${estimator.id}-${dayIndex}`}
                estimator={estimator}
                date={day}
                projects={mockProjectAllocations.filter(p => 
                  p.estimatorId === estimator.id && 
                  isSameDay(parseISO(p.date), day)
                )}
                events={mockEvents.filter(e => 
                  e.estimatorIds.includes(estimator.id) && 
                  isSameDay(parseISO(e.date), day)
                )}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
