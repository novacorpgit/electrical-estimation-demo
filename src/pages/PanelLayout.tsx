
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import * as go from 'gojs';
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
  layout: go.Model;
  createdAt: string;
  updatedAt: string;
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
  
  const diagramRef = useRef<HTMLDivElement>(null);
  const diagramInstanceRef = useRef<go.Diagram | null>(null);
  const [showRuler, setShowRuler] = useState(false);
  const [rulerDimensions, setRulerDimensions] = useState<RulerDimensions>({ width: 0, height: 0 });
  const [selectedEnclosure, setSelectedEnclosure] = useState<go.Node | null>(null);
  
  // Template state
  const [layoutTemplates, setLayoutTemplates] = useState<LayoutTemplate[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState(DEFAULT_LAYOUT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  
  // Scale for zoom operations
  const [scale, setScale] = useState(1);

  // Filter BOM items
  const filteredBomItems = bomItems.filter(item => {
    const matchesSearch = 
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showOnlyAvailable) {
      return matchesSearch && (item.quantity - (item.inUse || 0) > 0);
    }
    
    return matchesSearch;
  });

  // Initialize GoJS
  useEffect(() => {
    if (!diagramRef.current) return;
    
    // Create a new diagram
    const diagram = new go.Diagram(diagramRef.current, {
      "undoManager.isEnabled": true,
      "grid.visible": true,
      "grid.gridCellSize": new go.Size(GRID_SIZE, GRID_SIZE),
      "grid.background": "transparent",
      "draggingTool.gridSnapCellSpot": go.Spot.Center,
      "resizingTool.gridSnapCellSpot": go.Spot.Center,
      "allowDrop": true,
      "initialContentAlignment": go.Spot.Center,
      "animationManager.isEnabled": false,
    });
    
    // Define the node template for components
    diagram.nodeTemplateMap.add("component", 
      new go.Node("Auto")
        .bind(new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify))
        .add(
          new go.Shape("Rectangle")
            .bind("fill", "color")
            .bind("stroke", "black")
            .bind("strokeWidth", 1)
        )
        .add(
          new go.TextBlock()
            .bind("text", "description")
            .bind("stroke", "white")
            .bind("font", "bold 10px sans-serif")
            .bind(new go.Binding("width", "width"))
            .bind(new go.Binding("height", "height"))
        )
    );
    
    // Define the node template for enclosures
    diagram.nodeTemplateMap.add("enclosure", 
      new go.Node("Auto")
        .bind(new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify))
        .bind(new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify))
        .resizable(true)
        .resizeAdornmentTemplate(
          new go.Adornment("Spot")
            .add(new go.Placeholder())
            .add(new go.Shape("Rectangle")
              .alignment(go.Spot.TopLeft)
              .cursor("nw-resize")
            )
            .add(new go.Shape("Rectangle")
              .alignment(go.Spot.TopRight)
              .cursor("ne-resize")
            )
            .add(new go.Shape("Rectangle")
              .alignment(go.Spot.BottomLeft)
              .cursor("sw-resize")
            )
            .add(new go.Shape("Rectangle")
              .alignment(go.Spot.BottomRight)
              .cursor("se-resize")
            )
        )
        .add(
          new go.Shape("Rectangle")
            .bind("fill", "rgba(200, 200, 200, 0.3)")
            .bind("stroke", "#333")
            .bind("strokeWidth", 2)
            .bind("strokeDashArray", [1, 0])
            .bind(new go.Binding("width", "width"))
            .bind(new go.Binding("height", "height"))
        )
        .add(
          new go.TextBlock()
            .bind("text", "text")
            .bind("stroke", "#333")
            .bind("font", "bold 12px sans-serif")
        )
    );
    
    // Handle node selection
    diagram.addDiagramListener("SelectionChanged", (e) => {
      const diagram = e.diagram;
      const selectedNode = diagram?.selection.first();
      
      if (selectedNode && selectedNode.category === "enclosure") {
        setSelectedEnclosure(selectedNode);
        setShowRuler(true);
        const bounds = selectedNode.actualBounds;
        setRulerDimensions({
          width: bounds.width,
          height: bounds.height
        });
      } else {
        setSelectedEnclosure(null);
        setShowRuler(false);
      }
    });
    
    // Handle node resizing
    diagram.addDiagramListener("SelectionResized", (e) => {
      const diagram = e.diagram;
      const selectedNode = diagram?.selection.first();
      
      if (selectedNode && selectedNode.category === "enclosure") {
        const bounds = selectedNode.actualBounds;
        // Snap to grid
        const width = Math.round(bounds.width / GRID_SIZE) * GRID_SIZE;
        const height = Math.round(bounds.height / GRID_SIZE) * GRID_SIZE;
        selectedNode.resizeObject.desiredSize = new go.Size(width, height);
        
        // Update ruler dimensions
        setRulerDimensions({
          width: width,
          height: height
        });
      }
    });
    
    // Save instance ref
    diagramInstanceRef.current = diagram;
    
    // Load saved layout if available
    const savedLayout = localStorage.getItem(`layout-${subProjectId}`);
    if (savedLayout) {
      try {
        const model = new go.GraphLinksModel();
        model.nodeDataArray = JSON.parse(savedLayout);
        diagram.model = model;
      } catch (e) {
        console.error('Error loading saved layout', e);
      }
    }
    
    return () => {
      // Cleanup
      if (diagramInstanceRef.current) {
        diagramInstanceRef.current.div = null;
      }
    };
  }, [subProjectId]);
  
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
  
  // Save layout
  const saveLayout = () => {
    if (!diagramInstanceRef.current) return;
    
    const nodeDataArray = diagramInstanceRef.current.model.toJson();
    localStorage.setItem(`layout-${subProjectId}`, nodeDataArray);
    
    toast("Your panel layout has been saved");
  };
  
  // Create a component element on the canvas
  const createComponentElement = (bomItem: BomItem) => {
    if (!diagramInstanceRef.current) return;
    
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
    
    // Create component data
    const newComponent = {
      key: `component-${Date.now()}`,
      category: "component",
      loc: "100 100",
      width: 80,
      height: 40,
      color: color,
      description: bomItem.description,
      bomItemId: bomItem.id
    };
    
    // Add component to the model
    const model = diagramInstanceRef.current.model;
    model.startTransaction("add component");
    model.addNodeData(newComponent);
    model.commitTransaction("add component");
    
    // Update BOM item to show it's in use
    setBomItems(items => 
      items.map(item => 
        item.id === bomItem.id 
          ? { ...item, inUse: (item.inUse || 0) + 1 }
          : item
      )
    );
    
    saveLayout();
  };

  // Create an enclosure
  const createEnclosure = () => {
    if (!diagramInstanceRef.current) return;

    // Create enclosure data
    const newEnclosure = {
      key: `enclosure-${Date.now()}`,
      category: "enclosure",
      loc: "100 100",
      size: "200 300",
      width: 200,
      height: 300,
      text: "Enclosure",
      isEnclosure: true
    };
    
    // Add enclosure to the model
    const model = diagramInstanceRef.current.model;
    model.startTransaction("add enclosure");
    model.addNodeData(newEnclosure);
    model.commitTransaction("add enclosure");
    
    // Find the node we just added
    const enclosureNode = diagramInstanceRef.current.findNodeForKey(newEnclosure.key);
    if (enclosureNode) {
      // Select the new enclosure
      diagramInstanceRef.current.select(enclosureNode);
      setSelectedEnclosure(enclosureNode);
      setShowRuler(true);
      setRulerDimensions({
        width: 200,
        height: 300
      });
    }
    
    saveLayout();
    
    toast("Enclosure added. Click and drag to move. Resize using the handles.");
  };
  
  // Save layout as template
  const saveLayoutTemplate = () => {
    if (!diagramInstanceRef.current) return;
    if (!newTemplateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    
    const model = diagramInstanceRef.current.model;
    if (model.nodeDataArray.length === 0) {
      toast.error("Cannot save an empty layout template");
      return;
    }
    
    const finalCategory = customCategory.trim() ? customCategory : newTemplateCategory;
    
    const newTemplate: LayoutTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      category: finalCategory,
      layout: model,
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
  };
  
  // Load a template
  const loadLayoutTemplate = (template: LayoutTemplate) => {
    if (!diagramInstanceRef.current) return;
    
    // Clear current model and load from template
    try {
      diagramInstanceRef.current.model = template.layout;
      toast.success(`Template "${template.name}" loaded`);
    } catch (e) {
      console.error('Error loading template:', e);
      toast.error("Failed to load template");
    }
  };
  
  // Group templates by category
  const templatesByCategory = layoutTemplates.reduce<Record<string, LayoutTemplate[]>>((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});
  
  // Zoom controls
  const handleZoomIn = () => {
    if (!diagramInstanceRef.current) return;
    const newScale = scale * 1.2;
    diagramInstanceRef.current.scale = newScale;
    setScale(newScale);
  };
  
  const handleZoomOut = () => {
    if (!diagramInstanceRef.current) return;
    const newScale = scale / 1.2;
    diagramInstanceRef.current.scale = newScale;
    setScale(newScale);
  };
  
  const handleResetView = () => {
    if (!diagramInstanceRef.current) return;
    diagramInstanceRef.current.scale = 1;
    setScale(1);
  };
  
  const handleToggleGrid = () => {
    if (!diagramInstanceRef.current) return;
    diagramInstanceRef.current.grid.visible = !diagramInstanceRef.current.grid.visible;
  };

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
        {/* GoJS Canvas Panel */}
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="bg-muted p-2 flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleToggleGrid} title="Toggle Grid">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleResetView} title="Reset View">
                <Undo2 className="h-4 w-4" />
              </Button>
              <div className="h-6 border-l mx-1"></div>
              <Button onClick={createEnclosure} className="flex items-center">
                <RectangleHorizontal className="h-4 w-4 mr-2" />
                Add Enclosure
              </Button>
            </div>
            <div className="relative flex-1 overflow-hidden">
              <div 
                ref={diagramRef} 
                className="diagram-component absolute inset-0"
              ></div>
              
              {/* Ruler overlay */}
              {showRuler && selectedEnclosure && (
                <div className="absolute pointer-events-none z-10 left-0 top-0 right-0 bottom-0">
                  <div className="ruler-overlay">
                    <div className="absolute flex flex-col items-center left-1/2 transform -translate-x-1/2 top-4 bg-white/90 rounded px-3 py-1 shadow-md border text-sm">
                      <div className="flex items-center">
                        <Ruler className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="font-medium text-blue-600">{rulerDimensions.width} mm</span>
                      </div>
                    </div>
                    <div className="absolute flex flex-col items-center left-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded px-3 py-1 shadow-md border text-sm">
                      <div className="flex items-center">
                        <Ruler className="h-4 w-4 mr-1 text-gray-500 transform rotate-90" />
                        <span className="font-medium text-blue-600">{rulerDimensions.height} mm</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
