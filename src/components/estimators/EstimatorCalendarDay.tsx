
import React from "react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Clock } from "lucide-react";
import { ExtendedUser } from "@/types/panelboard-types";

interface Project {
  id: string;
  projectName: string;
  clientName: string;
  estimatorId: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  status: string;
}

interface Event {
  id: string;
  type: string;
  title: string;
  description: string;
  estimatorIds: string[];
  date: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
}

interface EstimatorCalendarDayProps {
  estimator: ExtendedUser;
  date: Date;
  projects: Project[];
  events: Event[];
}

export const EstimatorCalendarDay: React.FC<EstimatorCalendarDayProps> = ({
  estimator,
  date,
  projects,
  events
}) => {
  // Calculate total hours for the day
  const totalProjectHours = projects.reduce((total, project) => total + project.hours, 0);
  const isToday = new Date().toDateString() === date.toDateString();
  
  // Max hours per day (standard workday)
  const maxHoursPerDay = 8;
  
  // Calculate capacity usage
  const capacityUsage = (totalProjectHours / maxHoursPerDay) * 100;

  return (
    <div className={`border-t border-r border-l p-2 min-h-[120px] ${
      isToday ? 'bg-blue-50/30' : ''
    }`}>
      {/* Estimator name on first day of week */}
      {date.getDay() === 1 && (
        <div className="font-medium text-sm mb-1 bg-gray-100 px-1 py-0.5 rounded">
          {estimator.name}
        </div>
      )}
      
      {/* Capacity indicator */}
      <div className="flex justify-between items-center mb-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    capacityUsage > 85 ? 'bg-red-500' : 
                    capacityUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(capacityUsage, 100)}%` }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{totalProjectHours} of {maxHoursPerDay} hours scheduled ({Math.round(capacityUsage)}%)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span className="text-xs text-gray-500 ml-1">
          {totalProjectHours}h
        </span>
      </div>
      
      {/* Events (meetings, leaves, etc.) */}
      {events.map(event => (
        <div 
          key={event.id}
          className={`mb-1 p-1 text-xs rounded ${
            event.type === 'Meeting' ? 'bg-blue-100 border-l-2 border-blue-500' : 
            event.type === 'Leave' ? 'bg-red-100 border-l-2 border-red-500' : 
            'bg-purple-100 border-l-2 border-purple-500'
          }`}
        >
          <div className="font-medium flex items-center gap-1">
            {event.type === 'Meeting' ? (
              <Calendar className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {event.title}
          </div>
          <div className="text-[10px] text-gray-600">
            {event.startTime} - {event.endTime}
          </div>
        </div>
      ))}
      
      {/* Projects */}
      {projects.map(project => (
        <div 
          key={project.id}
          className={`mb-1 p-1 text-xs rounded cursor-pointer hover:opacity-90 ${
            project.status === 'Draft' ? 
            'bg-amber-50 border-l-2 border-amber-500' : 
            'bg-green-50 border-l-2 border-green-500'
          }`}
        >
          <div className="font-medium truncate">
            {project.projectName}
          </div>
          <div className="text-[10px] flex justify-between">
            <span className="text-gray-600">{project.clientName}</span>
            <span className="font-medium">{project.hours}h</span>
          </div>
        </div>
      ))}
    </div>
  );
};
