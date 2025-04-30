
import React, { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, Columns } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotesPanel } from "@/components/notes/NotesPanel";

interface BomUpload {
  id: string;
  name: string;
  date: string;
  type: string;
  items: number;
  components: number;
}

const BomUploadPage = () => {
  const { toast } = useToast();
  const [cloudSync, setCloudSync] = useState(false);
  const [automaticBackup, setAutomaticBackup] = useState(false);
  const [frequency, setFrequency] = useState("daily");
  const [selectedUploads, setSelectedUploads] = useState<string[]>([]);
  
  // Mock data for demonstration
  const bomUploads: BomUpload[] = [
    { 
      id: '1', 
      name: 'Weekly Product BOM', 
      date: '2025-04-25T10:30:00', 
      type: 'Components', 
      items: 16, 
      components: 32 
    },
    { 
      id: '2', 
      name: 'Monthly Full BOM', 
      date: '2025-04-20T14:15:00', 
      type: 'Complete',
      items: 236, 
      components: 3276 
    },
    { 
      id: '3', 
      name: 'System Components Update', 
      date: '2025-04-15T09:45:00', 
      type: 'System', 
      items: 12, 
      components: 150 
    },
    { 
      id: '4', 
      name: 'End of Day BOM Archive', 
      date: '2025-04-12T17:35:00', 
      type: 'Daily', 
      items: 8, 
      components: 109 
    },
    { 
      id: '5', 
      name: 'Morning Sync BOM', 
      date: '2025-04-10T08:25:00', 
      type: 'System',
      items: 12, 
      components: 120 
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })}, ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
  };

  const handleUploadBom = () => {
    toast({
      title: "Upload Started",
      description: "Your BOM upload has been initiated.",
    });
    // Actual upload functionality would go here
  };

  const handleManualBackup = () => {
    toast({
      title: "Manual Backup Started",
      description: "Your BOM data backup has been initiated.",
    });
    // Actual backup functionality would go here
  };

  const handleRestore = (id: string) => {
    toast({
      title: "Restore Initiated",
      description: `Restoring BOM from upload #${id}`,
    });
    // Actual restore functionality would go here
  };

  const handlePreview = (id: string) => {
    toast({
      title: "Preview Loading",
      description: `Loading preview for BOM upload #${id}`,
    });
    // Actual preview functionality would go here
  };

  const handleSelectUpload = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedUploads([...selectedUploads, id]);
    } else {
      setSelectedUploads(selectedUploads.filter(uploadId => uploadId !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="BOM Upload & Management" />
      
      <main className="container mx-auto p-4 mt-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">BOM Upload & Management</h1>
            <p className="text-gray-600">Central hub for BOM data management and customization</p>
          </div>
          <Button variant="outline">Order History</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>BOM Uploads</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Columns className="h-4 w-4" />
                      <span>Columns</span>
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="cloud-sync">Cloud Sync</Label>
                      <Switch
                        id="cloud-sync"
                        checked={cloudSync}
                        onCheckedChange={setCloudSync}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="cursor-pointer">When</TableHead>
                      <TableHead className="cursor-pointer">Details</TableHead>
                      <TableHead className="text-right w-[200px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bomUploads.map((upload) => (
                      <TableRow key={upload.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedUploads.includes(upload.id)}
                            onCheckedChange={(checked) => handleSelectUpload(upload.id, checked === true)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatDate(upload.date)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{upload.name}</div>
                          <div className="text-sm text-gray-500">
                            <span className="mr-4">📄 {upload.items} items</span>
                            <span>🔄 {upload.components} components</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePreview(upload.id)}
                          >
                            Preview
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRestore(upload.id)}
                          >
                            Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>BOM Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Upload New BOM</h3>
                    <Button 
                      className="w-full flex items-center gap-2"
                      onClick={handleUploadBom}
                    >
                      <Upload className="h-4 w-4" />
                      Upload BOM File
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Automatic Backup</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Scheduled BOM Protection</p>
                      </div>
                      <Switch 
                        checked={automaticBackup}
                        onCheckedChange={setAutomaticBackup}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Backup Frequency</h3>
                    <p className="text-sm text-gray-600 mb-2">Select Preferred Backup Schedule</p>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Manual Backup</h3>
                    <p className="text-sm text-gray-600 mb-2">Backup When Needed</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleManualBackup}
                    >
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Securing Data Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <FileText className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Safeguard your BOM data with our resilient backup recovery solutions. 
                    Detailed guides and expert strategies provide the roadmap to robust 
                    data protection and swift recovery.
                  </p>
                  <Button variant="link" className="p-0">Learn more</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <NotesPanel entityId="bom-uploads" entityType="project" entityName="BOM Management" />
    </div>
  );
};

export default BomUploadPage;
