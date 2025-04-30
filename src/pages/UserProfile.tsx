
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { UserLeaveView } from "@/components/users/UserLeaveView";
import { UserCalendarImport } from "@/components/users/UserCalendarImport";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  Clock, 
  ArrowLeft, 
  Building, 
  UserCog, 
  Calendar, 
  Mail 
} from "lucide-react";
import { ExtendedUser } from "@/types/panelboard-types";

// Mock data - would be replaced with actual API calls
const mockUsers: ExtendedUser[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    initials: "JD",
    roleId: "1",
    roleName: "Admin",
    uniqueCode: "ADM001",
    workHoursPerWeek: 40,
    department: "Engineering",
    managerId: "",
    joinDate: "2023-01-15",
    holidays: [],
    leaveBalance: {
      annual: 24,
      sick: 10,
      personal: 3,
      maternity: 0,
      paternity: 0,
      carried: 5,
    },
    profilePicture: "",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Estimator",
    status: "Active",
    initials: "JS",
    roleId: "2",
    roleName: "Estimator",
    uniqueCode: "EST001",
    workHoursPerWeek: 35,
    department: "Sales",
    joinDate: "2023-03-20",
    holidays: [],
    leaveBalance: {
      annual: 20,
      sick: 10,
      personal: 3,
      maternity: 0,
      paternity: 0,
      carried: 2,
    },
  },
];

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  // Find user by ID from mock data (would be an API call in real app)
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation pageTitle="User Not Found" />
        <main className="container mx-auto p-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-8">
                <h2 className="text-2xl font-bold mb-4">User not found</h2>
                <p className="mb-4">The requested user profile could not be found.</p>
                <Button onClick={() => navigate('/users')}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle={`User Profile: ${user.name}`} />
      
      <main className="container mx-auto p-4 mt-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/users')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center">
                <Avatar className="h-24 w-24 mb-4">
                  {user.profilePicture ? (
                    <AvatarImage src={user.profilePicture} />
                  ) : (
                    <AvatarFallback className="text-xl">{user.initials}</AvatarFallback>
                  )}
                </Avatar>
                
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <Badge variant={user.status === "Active" ? "success" : "secondary"} className="mt-2">
                  {user.status}
                </Badge>
                
                <div className="grid grid-cols-1 gap-4 w-full mt-6">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{user.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <UserCog className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{user.roleName}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{user.department || "No department"}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Work hours: {user.workHoursPerWeek}h/week</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <Tabs defaultValue="leave" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="leave">Leave & Balance</TabsTrigger>
                  <TabsTrigger value="calendar">Personal Calendar</TabsTrigger>
                  <TabsTrigger value="work">Work Hours</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="leave" className="mt-0">
                  <UserLeaveView user={user} />
                </TabsContent>
                <TabsContent value="calendar" className="mt-0">
                  <UserCalendarImport user={user} />
                </TabsContent>
                <TabsContent value="work" className="mt-0">
                  <div className="p-4 bg-gray-50 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Work Hours Log - Coming Soon</h3>
                    <p>This section will display the user's logged work hours and projects.</p>
                  </div>
                </TabsContent>
                <TabsContent value="documents" className="mt-0">
                  <div className="p-4 bg-gray-50 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">User Documents - Coming Soon</h3>
                    <p>This section will allow management of user-related documents.</p>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
