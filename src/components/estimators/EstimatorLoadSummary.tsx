
import React from "react";
import { addDays, format, isSameDay, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

interface EstimatorLoadSummaryProps {
  estimators: ExtendedUser[];
  projectAllocations: Project[];
  events: Event[];
  startDate: Date;
}

export const EstimatorLoadSummary: React.FC<EstimatorLoadSummaryProps> = ({
  estimators,
  projectAllocations,
  events,
  startDate
}) => {
  // Calculate load summaries for the next 4 weeks
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const weekStart = addDays(startDate, i * 7);
    const weekEnd = addDays(weekStart, 6);
    
    return {
      start: weekStart,
      end: weekEnd,
      label: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`
    };
  });

  // Calculate hours for each estimator for each week
  const getEstimatorWeeklyHours = (estimatorId: string, weekStart: Date) => {
    const weekEnd = addDays(weekStart, 6);
    
    return projectAllocations
      .filter(project => {
        const projectDate = parseISO(project.date);
        return (
          project.estimatorId === estimatorId &&
          projectDate >= weekStart &&
          projectDate <= weekEnd
        );
      })
      .reduce((total, project) => total + project.hours, 0);
  };

  // Calculate leave hours for the week
  const getEstimatorWeeklyLeaveHours = (estimatorId: string, weekStart: Date) => {
    const weekEnd = addDays(weekStart, 6);
    
    return events
      .filter(event => {
        const eventDate = parseISO(event.date);
        return (
          event.type === 'Leave' &&
          event.estimatorIds.includes(estimatorId) &&
          eventDate >= weekStart &&
          eventDate <= weekEnd
        );
      })
      .reduce((total, event) => {
        // Assuming 8-hour workday for leaves
        return total + 8;
      }, 0);
  };

  // Standard weekly hours
  const standardWeeklyHours = 40;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">Upcoming Workload</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left">
                <th className="pb-2">Estimator</th>
                {weeks.map((week, i) => (
                  <th key={i} className="pb-2 text-center">
                    <div className="text-sm font-medium">{week.label}</div>
                    <div className="text-xs text-gray-500">
                      {i === 0 ? 'This Week' : i === 1 ? 'Next Week' : `Week ${i+1}`}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {estimators.map(estimator => (
                <tr key={estimator.id} className="border-t">
                  <td className="py-3 pr-4">
                    <div className="font-medium">{estimator.name}</div>
                    <div className="text-xs text-gray-500">{estimator.workHoursPerWeek}h/week</div>
                  </td>
                  
                  {weeks.map((week, i) => {
                    const allocatedHours = getEstimatorWeeklyHours(estimator.id, week.start);
                    const leaveHours = getEstimatorWeeklyLeaveHours(estimator.id, week.start);
                    const availableHours = estimator.workHoursPerWeek - allocatedHours - leaveHours;
                    const utilization = (allocatedHours / estimator.workHoursPerWeek) * 100;
                    
                    return (
                      <td key={i} className="py-3 px-2">
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">
                              {allocatedHours}h
                            </span>
                            <Badge 
                              variant={
                                utilization > 90 ? "destructive" : 
                                utilization > 70 ? "default" : 
                                "outline"
                              }
                              className="text-xs"
                            >
                              {Math.round(utilization)}%
                            </Badge>
                          </div>
                          
                          <Progress 
                            value={utilization} 
                            className="h-2"
                          />
                          
                          <div className="mt-1 flex justify-between text-xs text-gray-500">
                            <span>
                              {availableHours > 0 ? `${availableHours}h available` : 'Fully booked'}
                            </span>
                            {leaveHours > 0 && (
                              <span className="text-red-500">{leaveHours}h leave</span>
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
