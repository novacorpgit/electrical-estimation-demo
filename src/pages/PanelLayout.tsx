
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle 
} from "@/components/ui/resizable";
import { BomList } from "@/components/quote/bom/BomList";
import { BomItem, BomItemCategory, defaultCategories } from "@/components/quote/bom/BomTypes";
import { toast } from "sonner";
import { Search, ZoomIn, ZoomOut, Grid3X3, Undo2, Save, FolderOpen, RectangleHorizontal, Ruler } from 'lucide-react';

// Import our custom nodes
import ComponentNode from '@/components/panel-layout/ComponentNode';
import EnclosureNode from '@/components/panel-layout/EnclosureNode';

// Mock BOM items for demonstration
const mockBomItems: BomItem[] = [
  {
    id: "item1",
    description: "MCB 32A",
    category: "circuit-breakers" as BomItemCategory,
    quantity: 10,
    unitCost: 45.99,
    totalCost: 459.90,
    inUse: 2
  },
  {
    id: "item2",
    description: "RCCB 25A",
    category: "circuit-breakers" as BomItemCategory,
    quantity: 5,
    unitCost: 65.50,
    totalCost: 327.50,
    inUse: 0
  },
  {
    id: "item3",
    description: "Power Supply 24V",
    category: "power-supplies" as BomItemCategory,
    quantity: 3,
    unitCost: 120.00,
    totalCost: 360.00,
    inUse: 1
  },
  {
    id: "item4",
    description: "Panel Enclosure 800x600",
    category: "enclosures" as BomItemCategory,
    quantity: 1,
    unitCost: 350.00,
    totalCost: 350.00,
    inUse: 0
  },
  {
    id: "item5",
    description: "DIN Rail 35mm (1m)",
    category: "accessories" as BomItemCategory,
    quantity: 5,
    unitCost: 8.75,
    totalCost: 43.75,
    inUse: 0
  }
];

// Define layout template interface
interface LayoutTemplate {
  id: string;
  name: string;
  category: string;
  layout: any;
  createdAt: string;
  updatedAt: string;
}

// Define Node types
interface PanelNode {
  id: string;
  type: string;
  position: { x: number, y: number };
  data: any;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  selected?: boolean;
}

// Template categories
const DEFAULT_LAYOUT_CATEGORIES = [
  "Main Distribution Boards",
  "Sub Distribution Boards",
  "Motor Control Centers",
  "Lighting Panels",
  "Power Panels",
  "Control Panels",
  "Other",
];

// Grid configuration
const GRID_SIZE = 10; // 10mm grid spacing

interface RulerDimensions {
  width: number;
  height: number;
}

const PanelLayout = () => {
  const { subProjectId } = useParams<{ subProjectId: string }>();
  const location = useLocation();
  const subProject = location.state?.subProject || {};
  const projectId = location.state?.projectId;
  const projectName = location.state?.projectName;
  
  const [bomItems, setBomItems] = useState<BomItem[]>(mockBomItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  
  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  const [showRuler, setShowRuler] = useState(false);
  const [rulerDimensions, setRulerDimensions] = useState<RulerDimensions>({ width: 0, height: 0 });
  const [selectedEnclosure, setSelectedEnclosure] = useState<PanelNode | null>(null);
  
  // Template state
  const [layoutTemplates, setLayoutTemplates] = useState<LayoutTemplate[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState(DEFAULT_LAYOUT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  
  // Scale for zoom operations
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Define the custom node types
  const nodeTypes: NodeTypes = {
    component: ComponentNode,
    enclosure: EnclosureNode
  };

  // Filter BOM items
  const filteredBomItems = bomItems.filter(item => {
    const matchesSearch = 
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showOnlyAvailable) {
      return matchesSearch && (item.quantity - (item.inUse || 0) > 0);
    }
    
    return matchesSearch;
  });

  // Load saved layout on component mount
  useEffect(() => {
    const savedLayout = localStorage.getItem(`layout-${subProjectId}`);
    if (savedLayout) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedLayout);
        setNodes(savedNodes || []);
        setEdges(savedEdges || []);
      } catch (e) {
        console.error('Error loading saved layout', e);
      }
    }
  }, [subProjectId, setNodes, setEdges]);
  
  // Load templates from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem("layout-templates");
    if (savedTemplates) {
      try {
        setLayoutTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error("Error loading layout templates:", error);
      }
    }
  }, []);
  
  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: PanelNode) => {
    if (node.type === 'enclosure') {
      setSelectedEnclosure(node);
      setShowRuler(true);
      setRulerDimensions({
        width: node.style?.width as number || 0,
        height: node.style?.height as number || 0,
      });
    } else {
      setSelectedEnclosure(null);
      setShowRuler(false);
    }
  }, []);

  // Save layout
  const saveLayout = useCallback(() => {
    if (!reactFlowInstance) return;
    
    const flow = reactFlowInstance.toObject();
    localStorage.setItem(`layout-${subProjectId}`, JSON.stringify(flow));
    
    toast("Your panel layout has been saved");
  }, [reactFlowInstance, subProjectId]);
  
  // Create a component element on the canvas
  const createComponentElement = useCallback((bomItem: BomItem) => {
    // Check if item is available
    const available = bomItem.quantity - (bomItem.inUse || 0);
    if (available <= 0) {
      toast.error("This item is out of stock");
      return;
    }
    
    // Generate a color based on the category
    const categoryColors: Record<string, string> = {
      'circuit-breakers': '#4dabf7',
      'power-supplies': '#ffa94d',
      'enclosures': '#748ffc',
      'accessories': '#69db7c',
      'labor': '#e599f7',
      'other': '#adb5bd'
    };
    
    const color = categoryColors[bomItem.category] || categoryColors.other;
    
    // Create component node
    const newNode: PanelNode = {
      id: `component-${Date.now()}`,
      type: 'component',
      position: { x: 100, y: 100 },
      data: {
        label: bomItem.description,
        color: color,
        bomItemId: bomItem.id
      },
      style: {
        width: 80,
        height: 40,
        backgroundColor: color
      }
    };
    
    setNodes(nodes => [...nodes, newNode]);
    
    // Update BOM item to show it's in use
    setBomItems(items => 
      items.map(item => 
        item.id === bomItem.id 
          ? { ...item, inUse: (item.inUse || 0) + 1 }
          : item
      )
    );
    
    saveLayout();
  }, [setNodes, saveLayout]);

  // Create an enclosure
  const createEnclosure = useCallback(() => {
    const newNode: PanelNode = {
      id: `enclosure-${Date.now()}`,
      type: 'enclosure',
      position: { x: 100, y: 100 },
      data: {
        label: "Enclosure"
      },
      style: {
        width: 200,
        height: 300
      }
    };
    
    setNodes(nodes => [...nodes, newNode]);
    setSelectedEnclosure(newNode);
    setShowRuler(true);
    setRulerDimensions({
      width: 200,
      height: 300
    });
    
    saveLayout();
    
    toast("Enclosure added. Click and drag to move. Resize using the handles.");
  }, [setNodes, saveLayout]);
  
  // Save layout as template
  const saveLayoutTemplate = useCallback(() => {
    if (!reactFlowInstance) return;
    if (!newTemplateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    
    const flow = reactFlowInstance.toObject();
    if (!flow.nodes.length) {
      toast.error("Cannot save an empty layout template");
      return;
    }
    
    const finalCategory = customCategory.trim() ? customCategory : newTemplateCategory;
    
    const newTemplate: LayoutTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      category: finalCategory,
      layout: flow,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedTemplates = [...layoutTemplates, newTemplate];
    setLayoutTemplates(updatedTemplates);
    localStorage.setItem("layout-templates", JSON.stringify(updatedTemplates));
    
    setShowSaveDialog(false);
    setNewTemplateName("");
    setNewTemplateCategory(DEFAULT_LAYOUT_CATEGORIES[0]);
    setCustomCategory("");
    
    toast.success(`Layout template "${newTemplateName}" saved successfully`);
  }, [reactFlowInstance, newTemplateName, newTemplateCategory, customCategory, layoutTemplates]);
  
  // Load a template
  const loadLayoutTemplate = useCallback((template: LayoutTemplate) => {
    try {
      const { nodes: templateNodes, edges: templateEdges } = template.layout;
      setNodes(templateNodes || []);
      setEdges(templateEdges || []);
      toast.success(`Template "${template.name}" loaded`);
    } catch (e) {
      console.error('Error loading template:', e);
      toast.error("Failed to load template");
    }
  }, [setNodes, setEdges]);
  
  // Group templates by category
  const templatesByCategory = layoutTemplates.reduce<Record<string, LayoutTemplate[]>>((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});
  
  // On node resize end
  const onNodeResize = useCallback((node: PanelNode) => {
    if (node.type === 'enclosure') {
      setRulerDimensions({
        width: node.style?.width as number || 0,
        height: node.style?.height as number || 0
      });
    }
  }, []);

  // Handle pane click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedEnclosure(null);
    setShowRuler(false);
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Panel Layout</h1>
          <p className="text-muted-foreground">
            {subProject?.name || subProjectId} 
            {projectName && ` - ${projectName}`}
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setShowSaveDialog(true)} className="flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save as Template
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <FolderOpen className="h-4 w-4 mr-2" />
                Load Template
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
              {Object.entries(templatesByCategory).length > 0 ? (
                Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
                  <React.Fragment key={category}>
                    <div className="px-2 py-1.5 text-sm font-semibold bg-muted/50">{category}</div>
                    {categoryTemplates.map(template => (
                      <DropdownMenuItem 
                        key={template.id}
                        onClick={() => loadLayoutTemplate(template)}
                      >
                        {template.name}
                      </DropdownMenuItem>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">No saved templates</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={saveLayout}>Save Layout</Button>
        </div>
      </div>
      
      <ResizablePanelGroup
        direction="vertical"
        className="min-h-[600px] border rounded-lg"
      >
        {/* React Flow Canvas Panel */}
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="bg-muted p-2 flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => reactFlowInstance?.zoomIn()} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => reactFlowInstance?.zoomOut()} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => reactFlowInstance?.fitView()} title="Reset View">
                <Undo2 className="h-4 w-4" />
              </Button>
              <div className="h-6 border-l mx-1"></div>
              <Button onClick={createEnclosure} className="flex items-center">
                <RectangleHorizontal className="h-4 w-4 mr-2" />
                Add Enclosure
              </Button>
            </div>
            <div className="relative flex-1 overflow-hidden" ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onInit={setReactFlowInstance}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                snapToGrid={true}
                snapGrid={[GRID_SIZE, GRID_SIZE]}
                nodesDraggable={true}
                nodesConnectable={false}
                fitView
              >
                <Panel position="top-right">
                  <Controls />
                </Panel>
                <MiniMap />
                <Background 
                  gap={GRID_SIZE} 
                  size={1}
                  color="#ddd"
                />
                
                {/* Dimension indicators for selected enclosure */}
                {showRuler && selectedEnclosure && (
                  <>
                    <div className="dimension-indicator dimension-indicator-top">
                      <Ruler className="h-4 w-4" />
                      <span>{rulerDimensions.width} mm</span>
                    </div>
                    <div className="dimension-indicator dimension-indicator-left">
                      <Ruler className="h-4 w-4 transform rotate-90" />
                      <span>{rulerDimensions.height} mm</span>
                    </div>
                  </>
                )}
              </ReactFlow>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* BOM Table Panel */}
        <ResizablePanel defaultSize={40} minSize={20}>
          <Card className="border-none rounded-none h-full">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-1/3">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    placeholder="Search components..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="available" 
                    checked={showOnlyAvailable}
                    onCheckedChange={(checked) => setShowOnlyAvailable(!!checked)}
                  />
                  <label htmlFor="available" className="text-sm">
                    Show only available items
                  </label>
                </div>
              </div>
              
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left">Description</th>
                      <th className="h-10 px-4 text-left">Category</th>
                      <th className="h-10 px-4 text-right">Qty Total</th>
                      <th className="h-10 px-4 text-right">In Use</th>
                      <th className="h-10 px-4 text-right">Available</th>
                      <th className="h-10 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBomItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="h-24 text-center text-muted-foreground">
                          No components found.
                        </td>
                      </tr>
                    ) : (
                      filteredBomItems.map((item) => {
                        const category = defaultCategories.find(c => c.id === item.category);
                        const available = item.quantity - (item.inUse || 0);
                        
                        return (
                          <tr key={item.id} className="border-b hover:bg-muted/50">
                            <td className="p-4">{item.description}</td>
                            <td className="p-4">{category?.name || item.category}</td>
                            <td className="p-4 text-right">{item.quantity}</td>
                            <td className="p-4 text-right">{item.inUse || 0}</td>
                            <td className="p-4 text-right">{available}</td>
                            <td className="p-4 text-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => createComponentElement(item)}
                                disabled={available <= 0}
                              >
                                Add to Layout
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              Save the current panel layout as a reusable template.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="Enter template name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="template-category">Category</Label>
              <Select 
                value={newTemplateCategory} 
                onValueChange={setNewTemplateCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_LAYOUT_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="__custom__">+ Add Custom Category</SelectItem>
                </SelectContent>
              </Select>
              {newTemplateCategory === "__custom__" && (
                <div className="mt-2">
                  <Input
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveLayoutTemplate}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PanelLayout;
