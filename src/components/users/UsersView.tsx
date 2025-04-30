
import React, { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UserForm } from "./UserForm";
import { ExtendedUser } from "@/types/panelboard-types";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

export const UsersView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [users, setUsers] = useState<ExtendedUser[]>(mockUsers);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.uniqueCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (newUser: ExtendedUser) => {
    setUsers([...users, newUser]);
    setIsAddUserOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleAddUser} onCancel={() => setIsAddUserOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search by name, email or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Work Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.uniqueCode}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roleName}</TableCell>
              <TableCell>{user.department || "—"}</TableCell>
              <TableCell>{user.workHoursPerWeek}h/week</TableCell>
              <TableCell>
                <Badge variant={user.status === "Active" ? "success" : "secondary"}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  <UserCheck className="h-4 w-4 mr-1" /> Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
