
import React, { useState, useRef, useEffect } from "react";
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths, subWeeks, addWeeks, startOfDay, addHours } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Calendar, CalendarDays, ChevronLeft, ChevronRight, Filter, User, Move, Clock, AlertTriangle, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { toast } from "sonner";

// Import types
import { ExtendedUser } from "@/types/panelboard-types";

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

// Project types with color coding
const projectTypes = [
  { id: "commercial", name: "Commercial", color: "#9b87f5" },
  { id: "residential", name: "Residential", color: "#0EA5E9" },
  { id: "industrial", name: "Industrial", color: "#F97316" },
  { id: "renovation", name: "Renovation", color: "#D946EF" },
];

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
    status: "In Progress",
    type: "commercial",
    completed: false
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
    status: "Draft",
    type: "residential",
    completed: false
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
    status: "In Progress",
    type: "renovation",
    completed: true
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
    status: "In Progress",
    type: "commercial",
    completed: false
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
    status: "Draft",
    type: "industrial",
    completed: false
  },
  {
    id: "project6",
    projectName: "Apartment Complex",
    clientName: "City Developers",
    estimatorId: "est2",
    date: "2025-05-13",
    startTime: "08:00",
    endTime: "12:00",
    hours: 4,
    status: "In Progress",
    type: "residential",
    completed: false
  },
  {
    id: "project7",
    projectName: "Factory Renovation",
    clientName: "Industrial Solutions",
    estimatorId: "est3",
    date: "2025-05-14",
    startTime: "09:00",
    endTime: "17:00",
    hours: 8,
    status: "Draft",
    type: "industrial",
    completed: false
  }
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

// Generate work hours from 8am to 5pm
const workHours = Array.from({ length: 10 }, (_, i) => {
  const hour = i + 8;
  return {
    label: format(new Date().setHours(hour, 0, 0, 0), 'h:mm a'),
    value: hour
  };
});

// Calendar event interface
interface CalendarEvent {
  id: string;
  title: string;
  estimatorId: string;
  date: string;
  startTime: string;
  endTime: string;
  startHour: number;
  duration: number;
  type: "project" | "meeting" | "leave";
  projectType?: string;
  color?: string;
  status?: string;
  clientName?: string;
  completed?: boolean;
}

// Unscheduled project interface
interface UnscheduledProject {
  id: string;
  projectName: string;
  clientName: string;
  estimatorId?: string;
  type: string;
  status: string;
  hours: number;
  completed: boolean;
}

// Sample unscheduled projects
const mockUnscheduledProjects: UnscheduledProject[] = [
  {
    id: "unscheduled1",
    projectName: "New Shopping Center",
    clientName: "Retail Developers Inc.",
    type: "commercial",
    status: "Draft",
    hours: 8,
    completed: false
  },
  {
    id: "unscheduled2",
    projectName: "Warehouse Extension",
    clientName: "Logistics Co.",
    type: "industrial",
    status: "In Progress",
    hours: 6,
    completed: false
  },
  {
    id: "unscheduled3",
    projectName: "Townhouses Development",
    clientName: "Urban Living Ltd",
    type: "residential",
    status: "Draft",
    hours: 12,
    completed: false
  }
];

export const CalendarScheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  const [selectedEstimators, setSelectedEstimators] = useState<string[]>(mockEstimators.map(est => est.id));
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>(projectTypes.map(type => type.id));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(getFormattedEvents());
  const [unscheduledProjects, setUnscheduledProjects] = useState<UnscheduledProject[]>(mockUnscheduledProjects);
  const [ghostElement, setGhostElement] = useState<{
    visible: boolean;
    date: string;
    estimatorId: string;
    startHour: number;
    projectName: string;
    clientName: string;
    duration: number;
  } | null>(null);

  // Calculate start of current period based on view mode
  const periodStart = viewMode === "day" ? 
    startOfDay(currentDate) :
    viewMode === "week" ? 
      startOfWeek(currentDate, { weekStartsOn: 1 }) : 
      startOfMonth(currentDate);

  // Generate days for the current view
  const days = viewMode === "day" ? 
    [currentDate] :
    viewMode === "week" ? 
      Array.from({ length: 7 }, (_, i) => addDays(periodStart, i)) :
      eachDayOfInterval({
        start: periodStart,
        end: viewMode === "month" ? endOfMonth(currentDate) : addDays(periodStart, 27)
      });

  // Ref for scheduler grid
  const schedulerRef = useRef<HTMLDivElement>(null);

  // Function to extract events from mock data
  function getFormattedEvents(): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    // Convert project allocations to calendar events
    mockProjectAllocations.forEach(project => {
      const projectType = projectTypes.find(type => type.id === project.type);
      
      // Parse times
      const startHour = parseInt(project.startTime.split(':')[0], 10);
      const endHour = parseInt(project.endTime.split(':')[0], 10);
      const duration = endHour - startHour;

      events.push({
        id: project.id,
        title: project.projectName,
        estimatorId: project.estimatorId,
        date: project.date,
        startTime: project.startTime,
        endTime: project.endTime,
        startHour,
        duration,
        type: "project",
        projectType: project.type,
        color: projectType?.color,
        status: project.status,
        clientName: project.clientName,
        completed: project.completed
      });
    });

    // Convert other events to calendar events
    mockEvents.forEach(event => {
      event.estimatorIds.forEach(estimatorId => {
        const startHour = parseInt(event.startTime.split(':')[0], 10);
        const endHour = parseInt(event.endTime.split(':')[0], 10);
        const duration = endHour - startHour;

        events.push({
          id: `${event.id}-${estimatorId}`,
          title: event.title,
          estimatorId,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          startHour,
          duration,
          type: event.type === "Meeting" ? "meeting" : "leave",
          color: event.type === "Meeting" ? "#bfdbfe" : "#fee2e2"
        });
      });
    });

    return events;
  }

  // Function to navigate to previous period
  const handlePrevPeriod = () => {
    if (viewMode === "day") {
      setCurrentDate(prevDate => addDays(prevDate, -1));
    } else if (viewMode === "week") {
      setCurrentDate(prevDate => subWeeks(prevDate, 1));
    } else {
      setCurrentDate(prevDate => subMonths(prevDate, 1));
    }
  };

  // Function to navigate to next period
  const handleNextPeriod = () => {
    if (viewMode === "day") {
      setCurrentDate(prevDate => addDays(prevDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(prevDate => addWeeks(prevDate, 1));
    } else {
      setCurrentDate(prevDate => addMonths(prevDate, 1));
    }
  };

  // Function to go to today
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Toggle estimator selection
  const handleEstimatorToggle = (estimatorId: string) => {
    setSelectedEstimators(prev => {
      if (prev.includes(estimatorId)) {
        return prev.filter(id => id !== estimatorId);
      } else {
        return [...prev, estimatorId];
      }
    });
  };

  // Toggle project type filter
  const handleProjectTypeToggle = (typeId: string) => {
    setSelectedProjectTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  // Select all estimators
  const handleSelectAllEstimators = () => {
    setSelectedEstimators(mockEstimators.map(est => est.id));
  };

  // Unselect all estimators
  const handleUnselectAllEstimators = () => {
    setSelectedEstimators([]);
  };

  // Filter visible events based on selections
  const visibleEvents = calendarEvents.filter(event => {
    // Filter by estimator
    if (!selectedEstimators.includes(event.estimatorId)) {
      return false;
    }

    // Filter by project type if applicable
    if (event.type === "project" && event.projectType) {
      return selectedProjectTypes.includes(event.projectType);
    }

    return true;
  });

  // Handle drag-and-drop from unscheduled projects to calendar
  const handleDragStart = (result: any) => {
    // Check if we're dragging from the unscheduled projects list
    if (result.source.droppableId === 'unscheduled-projects') {
      const draggedProject = unscheduledProjects.find(p => p.id === result.draggableId);
      
      if (draggedProject) {
        // Create ghost element data (will be rendered conditionally)
        setGhostElement({
          visible: true,
          date: format(currentDate, 'yyyy-MM-dd'),
          estimatorId: selectedEstimators[0] || mockEstimators[0].id,
          startHour: 9, // Default start hour
          projectName: draggedProject.projectName,
          clientName: draggedProject.clientName,
          duration: draggedProject.hours
        });
      }
    }
  };

  // Handle drag-and-drop reordering and scheduling
  const handleDragEnd = (result: any) => {
    // Clear ghost element
    setGhostElement(null);
    
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    
    // Handle drag from unscheduled projects list
    if (source.droppableId === 'unscheduled-projects' && destination.droppableId !== 'unscheduled-projects') {
      // Extract date and estimatorId from the destination droppableId
      const [destDate, destEstimatorId] = destination.droppableId.split('-');
      
      // Find the dragged project
      const draggedProject = unscheduledProjects.find(project => project.id === draggableId);
      
      if (draggedProject) {
        // Calculate new start hour based on the drop position
        const newStartHour = 8 + destination.index;

        // Create a new calendar event
        const projectType = projectTypes.find(type => type.id === draggedProject.type);
        
        const newEvent: CalendarEvent = {
          id: draggableId,
          title: draggedProject.projectName,
          estimatorId: destEstimatorId,
          date: destDate,
          startTime: `${newStartHour}:00`,
          endTime: `${newStartHour + draggedProject.hours}:00`,
          startHour: newStartHour,
          duration: draggedProject.hours,
          type: "project",
          projectType: draggedProject.type,
          color: projectType?.color,
          status: draggedProject.status,
          clientName: draggedProject.clientName,
          completed: draggedProject.completed
        };
        
        // Add the new event
        setCalendarEvents([...calendarEvents, newEvent]);
        
        // Remove the project from unscheduled projects
        setUnscheduledProjects(prev => prev.filter(p => p.id !== draggableId));

        // Check for conflicts and warn user
        const potentialConflicts = calendarEvents.filter(event => 
          event.estimatorId === destEstimatorId &&
          event.date === destDate &&
          ((newStartHour >= event.startHour && newStartHour < event.startHour + event.duration) ||
           (newStartHour + draggedProject.hours > event.startHour && newStartHour + draggedProject.hours <= event.startHour + event.duration) ||
           (newStartHour <= event.startHour && newStartHour + draggedProject.hours >= event.startHour + event.duration))
        );
        
        if (potentialConflicts.length > 0) {
          toast.warning(`Warning: This project overlaps with ${potentialConflicts.length} existing event(s). Please check scheduling.`, {
            description: "Consider rescheduling to avoid conflicts.",
            action: {
              label: "View Details",
              onClick: () => console.log("Show detailed conflicts - to be implemented")
            },
          });
        } else {
          toast.success("Project scheduled successfully", {
            description: `${draggedProject.projectName} assigned to ${mockEstimators.find(est => est.id === destEstimatorId)?.name}`
          });
        }

        return;
      }
    }
    
    // Handle drag within the calendar (reschedule)
    if (result.destination && source.droppableId !== destination.droppableId && 
        source.droppableId !== 'unscheduled-projects' && destination.droppableId !== 'unscheduled-projects') {
      // Find the dragged event
      const draggedEvent = calendarEvents.find(event => event.id === draggableId);
      
      if (draggedEvent) {
        // Extract date and estimatorId from the destination droppableId
        const [destDate, destEstimatorId] = destination.droppableId.split('-');
        
        // Calculate new start hour based on the drop position
        const newStartHour = 8 + destination.index;
        
        // Update the event
        const updatedEvents = calendarEvents.map(event => {
          if (event.id === draggableId) {
            const updatedEvent = {
              ...event,
              date: destDate,
              estimatorId: destEstimatorId,
              startHour: newStartHour,
              startTime: `${newStartHour}:00`,
              endTime: `${newStartHour + event.duration}:00`,
            };
            return updatedEvent;
          }
          return event;
        });
        
        setCalendarEvents(updatedEvents);

        // Check for conflicts
        const potentialConflicts = updatedEvents.filter(event => 
          event.id !== draggableId &&
          event.estimatorId === destEstimatorId &&
          event.date === destDate &&
          ((newStartHour >= event.startHour && newStartHour < event.startHour + event.duration) ||
           (newStartHour + draggedEvent.duration > event.startHour && newStartHour + draggedEvent.duration <= event.startHour + event.duration) ||
           (newStartHour <= event.startHour && newStartHour + draggedEvent.duration >= event.startHour + event.duration))
        );
        
        if (potentialConflicts.length > 0) {
          toast.warning(`Warning: This scheduling change creates ${potentialConflicts.length} conflict(s).`, {
            description: "Consider rescheduling to avoid overlaps.",
            action: {
              label: "View Details",
              onClick: () => console.log("Show detailed conflicts - to be implemented")
            },
          });
        } else {
          toast.success("Schedule updated successfully");
        }
      }
    }

    // Handle resizing of events (to be implemented)
  };

  // Find schedule conflicts (multiple events at same time for same estimator)
  const findConflicts = () => {
    const conflicts: Record<string, boolean> = {};
    
    calendarEvents.forEach(event1 => {
      calendarEvents.forEach(event2 => {
        if (
          event1.id !== event2.id &&
          event1.estimatorId === event2.estimatorId &&
          event1.date === event2.date
        ) {
          // Check if time periods overlap
          const e1Start = event1.startHour;
          const e1End = event1.startHour + event1.duration;
          const e2Start = event2.startHour;
          const e2End = event2.startHour + event2.duration;
          
          if ((e1Start >= e2Start && e1Start < e2End) || 
              (e2Start >= e1Start && e2Start < e1End)) {
            const conflictKey = [event1.id, event2.id].sort().join('-');
            conflicts[conflictKey] = true;
          }
        }
      });
    });
    
    return conflicts;
  };
  
  const conflicts = findConflicts();

  // Check if an event has conflicts
  const hasConflict = (eventId: string) => {
    return Object.keys(conflicts).some(key => key.includes(eventId));
  };

  return (
    <div className="space-y-4">
      {/* Calendar Controls */}
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrevPeriod} size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleToday}>Today</Button>
            <Button variant="outline" onClick={handleNextPeriod} size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="text-lg font-medium ml-2">
              {viewMode === "day" ? (
                format(currentDate, "MMMM d, yyyy")
              ) : viewMode === "week" ? (
                <>
                  {format(periodStart, "MMMM d")} - {format(addDays(periodStart, 6), "MMMM d, yyyy")}
                </>
              ) : (
                format(periodStart, "MMMM yyyy")
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as "day" | "week" | "month")}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="View mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day view</SelectItem>
                <SelectItem value="week">Week view</SelectItem>
                <SelectItem value="month">Month view</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar + Calendar */}
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] border rounded-lg">
        {/* Sidebar for Filters, Estimators and Projects */}
        <ResizablePanel defaultSize={25} minSize={15} maxSize={30}>
          <div className="h-full flex flex-col bg-white">
            {/* Estimator Selection */}
            <div className="border-b p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Estimators
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSelectAllEstimators}
                  >
                    All
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
              
              <div className="flex flex-col gap-2">
                {mockEstimators.map(estimator => (
                  <Badge 
                    key={estimator.id} 
                    variant={selectedEstimators.includes(estimator.id) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 px-3 py-1.5 w-full justify-between"
                    onClick={() => handleEstimatorToggle(estimator.id)}
                  >
                    <span>{estimator.name}</span>
                    <span className="ml-2 text-xs bg-white text-primary px-1.5 rounded-full">
                      {calendarEvents.filter(e => e.estimatorId === estimator.id && e.type === "project").length}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Project Type Filters */}
            <div className="border-b p-4">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Tag className="mr-2 h-5 w-5" />
                Project Types
              </h3>
              
              <div className="space-y-2">
                {projectTypes.map(type => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`project-type-${type.id}`} 
                      checked={selectedProjectTypes.includes(type.id)}
                      onCheckedChange={() => handleProjectTypeToggle(type.id)}
                    />
                    <label 
                      htmlFor={`project-type-${type.id}`}
                      className="flex items-center cursor-pointer text-sm flex-1"
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: type.color }} 
                      />
                      {type.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Unscheduled Projects */}
            <div className="flex-1 p-4 overflow-auto">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Unscheduled Projects
              </h3>

              <Alert className="mb-4 bg-blue-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Drag projects to the calendar to schedule them
                </AlertDescription>
              </Alert>
              
              <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <Droppable droppableId="unscheduled-projects" type="PROJECT">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {unscheduledProjects.map((project, index) => {
                        const projectType = projectTypes.find(type => type.id === project.type);
                        
                        return (
                          <Draggable 
                            key={project.id} 
                            draggableId={project.id} 
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                                style={{
                                  borderLeft: `4px solid ${projectType?.color}`,
                                  ...provided.draggableProps.style
                                }}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <Move className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">
                                      {project.projectName}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                      {project.clientName}
                                    </div>
                                  </div>
                                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {project.hours}h
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-500">
                                    {projectType?.name}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={
                                      project.status === "Draft" 
                                        ? "bg-amber-50 text-amber-800 hover:bg-amber-50" 
                                        : "bg-blue-50 text-blue-800 hover:bg-blue-50"
                                    }
                                  >
                                    {project.status}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Calendar Grid */}
        <ResizablePanel defaultSize={75}>
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="h-full bg-white overflow-auto" ref={schedulerRef}>
              <div className={`grid ${viewMode === "day" ? "grid-cols-2" : "grid-cols-8"}`}>
                {/* Empty corner cell */}
                <div className="border-b border-r p-2 sticky left-0 z-10 bg-white">
                  <div className="font-bold text-gray-500">Time/Date</div>
                </div>
                
                {/* Header row with dates */}
                {days.slice(0, viewMode === "day" ? 1 : 7).map((day, index) => (
                  <div 
                    key={index}
                    className={`border-b p-2 text-center ${
                      isSameDay(day, new Date()) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium">{format(day, "EEE")}</div>
                    <div className="text-lg">{format(day, "d")}</div>
                    <div className="text-xs text-gray-500">{format(day, "MMM")}</div>
                  </div>
                ))}
                
                {/* Time slots with events */}
                {workHours.map((hour) => (
                  <React.Fragment key={hour.value}>
                    {/* Hour label in the first column */}
                    <div className="border-b border-r p-2 sticky left-0 z-10 bg-white">
                      <div className="text-sm text-gray-600">{hour.label}</div>
                    </div>
                    
                    {/* Day columns */}
                    {days.slice(0, viewMode === "day" ? 1 : 7).map((day, dayIndex) => {
                      const dateStr = format(day, "yyyy-MM-dd");
                      
                      // Get filtered estimators
                      return selectedEstimators.map((estimatorId, estIndex) => {
                        // Only show estimator cells for the first hour row to avoid duplication
                        if (hour.value !== 8) return null;
                        
                        // Unique droppable ID combining date and estimator
                        const droppableId = `${dateStr}-${estimatorId}`;
                        
                        // Find events for this estimator on this date
                        const estimatorEvents = visibleEvents.filter(event => 
                          event.estimatorId === estimatorId && 
                          event.date === dateStr
                        );
                        
                        return (
                          <Droppable key={droppableId} droppableId={droppableId} direction="vertical" type="PROJECT">
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`border border-dashed relative ${
                                  isSameDay(day, new Date()) ? 'bg-blue-50/20' : ''
                                } ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
                                style={{ 
                                  gridColumn: dayIndex + 2, // +2 because first column is hour labels
                                  gridRow: `span ${workHours.length}`, // Span all work hours
                                  height: `${workHours.length * 60}px` // Height based on hours (60px per hour)
                                }}
                              >
                                {/* Render events for this estimator and day */}
                                {estimatorEvents.map((event) => {
                                  // Calculate position based on start hour
                                  const topPosition = (event.startHour - 8) * 60; // 8 is first hour (8am), 60px per hour
                                  const height = event.duration * 60; // Height based on duration
                                  
                                  // Determine if this event has conflicts
                                  const hasConflictFlag = hasConflict(event.id);
                                  
                                  return (
                                    <Draggable key={event.id} draggableId={event.id} index={event.startHour - 8}>
                                      {(dragProvided) => (
                                        <div
                                          ref={dragProvided.innerRef}
                                          {...dragProvided.draggableProps}
                                          {...dragProvided.dragHandleProps}
                                          className={`absolute rounded p-2 w-[95%] mx-auto left-0 right-0 overflow-hidden ${
                                            hasConflictFlag ? 'ring-2 ring-red-400' : ''
                                          } ${event.completed ? 'opacity-60' : ''}`}
                                          style={{
                                            top: `${topPosition}px`,
                                            height: `${height}px`,
                                            backgroundColor: event.color || '#e5e7eb',
                                            ...dragProvided.draggableProps.style
                                          }}
                                        >
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <div className="h-full flex flex-col justify-between">
                                                  <div className="flex items-center gap-1">
                                                    <Move className="h-3 w-3 text-gray-700/70" />
                                                    <div className="font-medium text-xs truncate">
                                                      {event.title}
                                                      {event.completed && " ✓"}
                                                    </div>
                                                  </div>
                                                  <div className="flex justify-between items-center">
                                                    <div className="text-xs opacity-80">
                                                      {event.startTime} - {event.endTime}
                                                    </div>
                                                    {hasConflictFlag && (
                                                      <AlertTriangle className="h-3 w-3 text-red-500" />
                                                    )}
                                                  </div>
                                                </div>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <div className="space-y-1">
                                                  <p className="font-bold">{event.title}</p>
                                                  <p>Time: {event.startTime} - {event.endTime}</p>
                                                  {event.clientName && (
                                                    <p>Client: {event.clientName}</p>
                                                  )}
                                                  {event.status && (
                                                    <p>Status: {event.status}</p>
                                                  )}
                                                  {hasConflictFlag && (
                                                    <p className="text-red-500 font-bold">⚠️ Schedule Conflict</p>
                                                  )}
                                                </div>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                
                                {/* Ghost element for visual drag feedback */}
                                {ghostElement && snapshot.isDraggingOver && 
                                 ghostElement.date === dateStr && 
                                 ghostElement.estimatorId === estimatorId && (
                                  <div 
                                    className="absolute bg-blue-200 border border-blue-400 rounded p-2 opacity-70 w-[95%] mx-auto left-0 right-0"
                                    style={{
                                      top: `${(ghostElement.startHour - 8) * 60}px`,
                                      height: `${ghostElement.duration * 60}px`,
                                    }}
                                  >
                                    <div className="font-medium text-xs truncate">
                                      {ghostElement.projectName}
                                    </div>
                                    <div className="text-xs opacity-80">
                                      {ghostElement.clientName}
                                    </div>
                                  </div>
                                )}

                                {/* Hour grid lines */}
                                {workHours.map((_, hourIndex) => (
                                  <div 
                                    key={hourIndex}
                                    className="border-t border-gray-200"
                                    style={{ 
                                      position: 'absolute',
                                      top: `${hourIndex * 60}px`, 
                                      left: 0,
                                      right: 0,
                                      height: '1px'
                                    }}
                                  />
                                ))}

                                {/* Estimator label */}
                                <div className="absolute top-0 left-0 right-0 bg-gray-100 px-2 py-1 text-xs font-medium truncate">
                                  {mockEstimators.find(est => est.id === estimatorId)?.name}
                                </div>
                                
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        );
                      }).filter(Boolean);
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </DragDropContext>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
