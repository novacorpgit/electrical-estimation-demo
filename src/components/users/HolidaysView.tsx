
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Holiday, LeaveRequest } from "@/types/panelboard-types";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

// Mock data - would be replaced with actual API calls
const mockHolidays: Holiday[] = [
  {
    id: "1",
    name: "New Year's Day",
    date: "2025-01-01",
    countryCode: "US",
    isRecurring: true,
    type: "National",
  },
  {
    id: "2",
    name: "Independence Day",
    date: "2025-07-04",
    countryCode: "US",
    isRecurring: true,
    type: "National",
  },
  {
    id: "3",
    name: "Company Anniversary",
    date: "2025-03-15",
    countryCode: "US",
    isRecurring: true,
    type: "Corporate",
  },
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    userId: "1",
    startDate: "2025-02-10",
    endDate: "2025-02-14",
    type: "Annual",
    status: "Approved",
    reason: "Family vacation",
    approvedById: "3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    googleCalendarEventId: "abc123",
  },
  {
    id: "2",
    userId: "2",
    startDate: "2025-01-15",
    endDate: "2025-01-15",
    type: "Sick",
    status: "Approved",
    reason: "Doctor's appointment",
    approvedById: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    googleCalendarEventId: "def456",
  },
];

export const HolidaysView: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);

  // Calculate dates with events for the calendar
  const eventDates = [...holidays, ...leaveRequests].map((event) => {
    if ('date' in event) {
      return new Date(event.date);
    } else {
      return new Date(event.startDate);
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Holidays & Leave Management</h1>
          <p className="text-muted-foreground">
            Manage holidays, leave requests and calendar integration
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Plus size={16} /> Add Holiday
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Request Leave
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>View all holidays and leave requests</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
          <CardFooter>
            <div className="flex items-center text-xs text-muted-foreground justify-between w-full">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Holiday</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Leave</span>
              </div>
              <Button variant="link" size="sm" className="text-xs p-0">
                Connect Google Calendar
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <Tabs defaultValue="holidays" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="holidays">Country Holidays</TabsTrigger>
                <TabsTrigger value="leave">Leave Requests</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="holidays" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Holiday Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recurring</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holidays.map((holiday) => (
                    <TableRow key={holiday.id}>
                      <TableCell className="font-medium">{holiday.name}</TableCell>
                      <TableCell>{new Date(holiday.date).toLocaleDateString()}</TableCell>
                      <TableCell>{holiday.countryCode}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{holiday.type}</Badge>
                      </TableCell>
                      <TableCell>{holiday.isRecurring ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="leave" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">
                        {leave.userId === "1" ? "John Doe" : "Jane Smith"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={leave.type === "Sick" ? "destructive" : "default"}>
                          {leave.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(leave.startDate).toLocaleDateString()}
                        {leave.startDate !== leave.endDate && ` - ${new Date(leave.endDate).toLocaleDateString()}`}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            leave.status === "Approved"
                              ? "success"
                              : leave.status === "Pending"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {leave.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
