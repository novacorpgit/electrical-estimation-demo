
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, Upload, ExternalLink } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { ExtendedUser } from "@/types/panelboard-types";
import { isWithinInterval, parseISO, format } from "date-fns";

interface UserCalendarImportProps {
  user: ExtendedUser;
}

// Mock data for calendar events
const mockCalendarEvents = [
  {
    id: "1",
    title: "Client Meeting",
    start: "2025-03-15T10:00:00",
    end: "2025-03-15T11:30:00",
    allDay: false,
    source: "personal",
  },
  {
    id: "2",
    title: "Team Workshop",
    start: "2025-03-17T14:00:00",
    end: "2025-03-17T16:00:00",
    allDay: false,
    source: "personal",
  },
  {
    id: "3",
    title: "Conference",
    start: "2025-05-05T09:00:00",
    end: "2025-05-07T17:00:00",
    allDay: true,
    source: "personal",
  },
];

export const UserCalendarImport: React.FC<UserCalendarImportProps> = ({ user }) => {
  const [calendarUrl, setCalendarUrl] = useState<string>("");
  const [isCalendarImported, setIsCalendarImported] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState(mockCalendarEvents);
  const [showImportForm, setShowImportForm] = useState<boolean>(false);

  // Helper function to determine if a date has calendar events
  const hasEvents = (date: Date) => {
    return events.some((event) => {
      const start = parseISO(event.start);
      const end = parseISO(event.end);
      return isWithinInterval(date, { start, end });
    });
  };

  // Function to import calendar
  const importCalendar = () => {
    if (calendarUrl.trim() === "") return;
    
    // In a real implementation, we would fetch and parse the ICS file
    // Here we're just simulating a successful import
    setIsCalendarImported(true);
    setShowImportForm(false);
    
    // Would normally parse ICS and set events here
    console.log(`Importing calendar from: ${calendarUrl}`);
  };

  // Function to get events for selected date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const start = parseISO(event.start);
      const end = parseISO(event.end);
      return isWithinInterval(date, { start, end });
    });
  };

  const selectedDateEvents = date ? getEventsForDate(date) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <CalendarClock size={20} /> Personal Calendar
        </h3>
        {!isCalendarImported ? (
          <Button 
            onClick={() => setShowImportForm(!showImportForm)} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload size={16} /> Import Calendar
          </Button>
        ) : (
          <Button 
            onClick={() => {
              setIsCalendarImported(false);
              setCalendarUrl("");
            }} 
            variant="outline"
            size="sm"
          >
            Change Calendar
          </Button>
        )}
      </div>

      {showImportForm && !isCalendarImported && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calendar-url">Calendar URL (ICS)</Label>
                <Input
                  id="calendar-url"
                  placeholder="https://calendar.example.com/user.ics"
                  value={calendarUrl}
                  onChange={(e) => setCalendarUrl(e.target.value)}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Enter the URL to your calendar's ICS file to import your personal events.</p>
                <p className="mt-2">
                  <span className="font-medium">Google Calendar:</span> Calendar Settings &gt; "Import & Export" &gt; "Calendar URL".
                </p>
                <p className="mt-1">
                  <span className="font-medium">Outlook:</span> Calendar &gt; "Share" &gt; "Get a link" &gt; "ICS".
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowImportForm(false)}>Cancel</Button>
                <Button onClick={importCalendar}>Import Calendar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isCalendarImported && (
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
                    event: (date) => hasEvents(date),
                  }}
                  modifiersClassNames={{
                    event: "bg-purple-100 text-purple-900 font-medium",
                  }}
                />
                <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span>Calendar Event</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>Leave Day</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Events for {date ? format(date, "MMMM d, yyyy") : "Selected Date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No events scheduled for this date
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateEvents.map((event) => (
                      <div key={event.id} className="border rounded-md p-3">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.allDay ? (
                            "All day"
                          ) : (
                            `${format(parseISO(event.start), "h:mm a")} - ${format(parseISO(event.end), "h:mm a")}`
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!isCalendarImported && !showImportForm && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
              <CalendarClock size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Calendar Connected</h3>
            <p className="text-muted-foreground mb-6">
              Import your personal calendar to view and manage schedule overlaps with your work schedule.
            </p>
            <Button 
              onClick={() => setShowImportForm(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Upload size={16} /> Import Calendar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
