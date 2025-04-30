
import React from "react";
import { Navigation } from "@/components/Navigation";
import { UsersView } from "@/components/users/UsersView";
import { RolesView } from "@/components/users/RolesView";
import { HolidaysView } from "@/components/users/HolidaysView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="User Management" />
      
      <main className="container mx-auto p-4 mt-4">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="holidays">Holidays & Leave</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UsersView />
          </TabsContent>
          
          <TabsContent value="roles">
            <RolesView />
          </TabsContent>
          
          <TabsContent value="holidays">
            <HolidaysView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserManagement;
