
import React from 'react';
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const TemplatesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="Panel Templates" />
      
      <main className="container mx-auto p-4 mt-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Panel Templates</h1>
            <p className="text-gray-600">Manage your panel templates for easy project setup</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>New Template</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm hover:shadow transition-shadow">
            <CardHeader>
              <CardTitle>Basic Distribution Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">Standard configuration for residential applications</p>
              <Button variant="outline" size="sm">Edit Template</Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow transition-shadow">
            <CardHeader>
              <CardTitle>Commercial Panel Type A</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">Configured for low-rise commercial buildings</p>
              <Button variant="outline" size="sm">Edit Template</Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow transition-shadow">
            <CardHeader>
              <CardTitle>Industrial Control Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">High-capacity setup for industrial applications</p>
              <Button variant="outline" size="sm">Edit Template</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TemplatesPage;
