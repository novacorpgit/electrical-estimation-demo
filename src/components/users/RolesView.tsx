
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Settings, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRole, Permission } from "@/types/panelboard-types";

// Mock data - would be replaced with actual API calls
const mockRoles: UserRole[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full access to all system features",
    permissions: [
      {
        id: "1",
        resource: "projects",
        action: "manage",
        description: "Full access to projects",
      },
      {
        id: "2",
        resource: "users",
        action: "manage",
        description: "Full access to users",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Estimator",
    description: "Can create and manage quotes and BOMs",
    permissions: [
      {
        id: "3",
        resource: "projects",
        action: "read",
        description: "View projects",
      },
      {
        id: "4",
        resource: "quotes",
        action: "manage",
        description: "Full access to quotes",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Sales Rep",
    description: "Can manage clients and view projects",
    permissions: [
      {
        id: "5",
        resource: "clients",
        action: "manage",
        description: "Full access to clients",
      },
      {
        id: "6",
        resource: "projects",
        action: "read",
        description: "View projects",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const RolesView: React.FC = () => {
  const [roles, setRoles] = useState<UserRole[]>(mockRoles);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Manage user roles and their permissions within the system
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Create New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={18} /> {role.name}
                  </CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="text-sm font-medium mb-2">Permissions:</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm) => (
                  <Badge key={perm.id} variant="outline">
                    {perm.resource} ({perm.action})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
