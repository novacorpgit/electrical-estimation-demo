
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ExtendedUser } from "@/types/panelboard-types";
import { v4 as uuidv4 } from "uuid";

type UserFormProps = {
  onSubmit: (user: ExtendedUser) => void;
  onCancel: () => void;
  initialData?: Partial<ExtendedUser>;
};

// Define valid roles as a type to ensure type safety
type ValidRole = "Super Admin" | "Admin" | "Estimator" | "Sales Rep" | "Project Manager" | "Viewer";

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [role, setRole] = useState<ValidRole>((initialData?.roleName as ValidRole) || "Admin");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [workHours, setWorkHours] = useState(initialData?.workHoursPerWeek?.toString() || "40");
  const [joinDate, setJoinDate] = useState<Date | undefined>(
    initialData?.joinDate ? new Date(initialData.joinDate) : new Date()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate initials from name
    const nameParts = name.split(" ");
    const initials = nameParts.length > 1 
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : name.substring(0, 2);
    
    // Generate unique code based on role and random number
    const rolePrefix = role === "Admin" ? "ADM" : 
                       role === "Estimator" ? "EST" :
                       role === "Sales Rep" ? "SLS" :
                       role === "Project Manager" ? "PM" :
                       role === "Super Admin" ? "SPA" : "USR";
    
    const uniqueCode = `${rolePrefix}${Math.floor(100 + Math.random() * 900)}`;
    
    const user: ExtendedUser = {
      id: initialData?.id || uuidv4(),
      name,
      email,
      role: role,  // This is the same as roleName for consistency
      roleName: role,
      roleId: initialData?.roleId || "1",
      status: initialData?.status || "Active",
      initials: initialData?.initials || initials.toUpperCase(),
      uniqueCode: initialData?.uniqueCode || uniqueCode,
      workHoursPerWeek: parseInt(workHours),
      department,
      managerId: initialData?.managerId || "",
      joinDate: joinDate ? joinDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      holidays: initialData?.holidays || [],
      leaveBalance: initialData?.leaveBalance || {
        annual: 20,
        sick: 10,
        personal: 3,
        maternity: 0,
        paternity: 0,
        carried: 0,
      },
      profilePicture: initialData?.profilePicture || "",
    };
    
    onSubmit(user);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={role} 
              onValueChange={(value: ValidRole) => setRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Estimator">Estimator</SelectItem>
                <SelectItem value="Sales Rep">Sales Rep</SelectItem>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Engineering"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workHours">Work Hours per Week</Label>
            <Input
              id="workHours"
              type="number"
              value={workHours}
              onChange={(e) => setWorkHours(e.target.value)}
              min="0"
              max="168"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Join Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {joinDate ? format(joinDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={joinDate}
                  onSelect={setJoinDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Leave Balance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="annualLeave">Annual Leave (days)</Label>
                  <Input
                    id="annualLeave"
                    type="number"
                    defaultValue="20"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="sickLeave">Sick Leave (days)</Label>
                  <Input
                    id="sickLeave"
                    type="number"
                    defaultValue="10"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save User</Button>
        </div>
      </div>
    </form>
  );
};
