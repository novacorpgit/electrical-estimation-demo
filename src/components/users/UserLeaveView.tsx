
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarDays } from "lucide-react";
import { ExtendedUser, LeaveRequest } from "@/types/panelboard-types";
import { format, isWithinInterval, parseISO } from "date-fns";

interface UserLeaveViewProps {
  user: ExtendedUser;
}

// Mock leave request data - would be fetched from API in real implementation
const getMockLeaveRequests = (userId: string): LeaveRequest[] => [
  {
    id: "1",
    userId,
    startDate: "2025-02-10",
    endDate: "2025-02-14",
    type: "Annual",
    status: "Approved",
    reason: "Family vacation",
    approvedById: "3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId,
    startDate: "2025-05-20",
    endDate: "2025-05-20",
    type: "Sick",
    status: "Approved",
    reason: "Doctor's appointment",
    approvedById: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId,
    startDate: "2025-07-01",
    endDate: "2025-07-15",
    type: "Annual",
    status: "Pending",
    reason: "Summer vacation",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const UserLeaveView: React.FC<UserLeaveViewProps> = ({ user }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const leaveRequests = getMockLeaveRequests(user.id);
  
  // Helper function to determine if a date falls within a leave period
  const isLeaveDay = (date: Date) => {
    return leaveRequests.some((leave) => {
      const start = parseISO(leave.startDate);
      const end = parseISO(leave.endDate);
      return isWithinInterval(date, { start, end });
    });
  };
  
  // Function to get leave type for a specific date
  const getLeaveInfo = (date: Date) => {
    return leaveRequests.find((leave) => {
      const start = parseISO(leave.startDate);
      const end = parseISO(leave.endDate);
      return isWithinInterval(date, { start, end });
    });
  };
  
  const getDaysUsed = (type: string) => {
    return leaveRequests
      .filter(leave => leave.type === type && leave.status !== "Rejected")
      .reduce((total, leave) => {
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);
        const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }, 0);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Annual Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div className="text-2xl font-bold">
                {user.leaveBalance.annual - getDaysUsed("Annual")}
              </div>
              <div className="text-sm text-muted-foreground">
                of {user.leaveBalance.annual} days
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Sick Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div className="text-2xl font-bold">
                {user.leaveBalance.sick - getDaysUsed("Sick")}
              </div>
              <div className="text-sm text-muted-foreground">
                of {user.leaveBalance.sick} days
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Personal Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div className="text-2xl font-bold">
                {user.leaveBalance.personal - getDaysUsed("Personal")}
              </div>
              <div className="text-sm text-muted-foreground">
                of {user.leaveBalance.personal} days
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Leave History & Requests</h3>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Request Leave
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  leave: (date) => isLeaveDay(date),
                }}
                modifiersClassNames={{
                  leave: "bg-blue-100 text-blue-900 font-medium",
                }}
              />
              <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>Leave Day</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>
                        <Badge 
                          variant={
                            leave.type === "Sick" ? "destructive" : 
                            leave.type === "Annual" ? "default" : "secondary"
                          }
                        >
                          {leave.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(leave.startDate), "MMM d, yyyy")}
                        {leave.startDate !== leave.endDate && 
                          ` - ${format(new Date(leave.endDate), "MMM d, yyyy")}`}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            leave.status === "Approved" ? "success" :
                            leave.status === "Pending" ? "warning" : "secondary"
                          }
                        >
                          {leave.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
