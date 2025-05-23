
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
import * as joint from 'jointjs';
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
  layout: any; // Joint.js serialized layout
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

// Extend JointJS types for our use case
declare module 'jointjs' {
  namespace dia {
    interface Cell {
      get(attribute: string): any;
      set(key: string, value: any): this;
      position(): { x: number, y: number };
      position(x: number, y: number): this;
      position(position: { x: number, y: number }): this;
      size(): { width: number, height: number };
      resize(width: number, height: number): this;
    }
    
    interface Paper {
      remove(): void;
      snapToGrid(point: { x: number, y: number }): { x: number, y: number };
      scale(): { sx: number, sy: number };
      scale(sx: number, sy: number): void;
      drawGrid(): void;
    }

    interface CellView {
      model: Cell;
    }

    interface ElementView extends CellView {
      model: Cell;
    }
  }
}

// Type for our Rectangle that's compatible with JointJS
type JointRectangle = joint.dia.Cell & {
  resize(width: number, height: number): joint.dia.Cell;
  size(): { width: number, height: number };
};

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
  
  const paperRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<joint.dia.Graph | null>(null);
  const paperInstanceRef = useRef<joint.dia.Paper | null>(null);
  const [showRuler, setShowRuler] = useState(false);
  const [rulerDimensions, setRulerDimensions] = useState<RulerDimensions>({ width: 0, height: 0 });
  const [selectedEnclosure, setSelectedEnclosure] = useState<joint.dia.Cell | null>(null);
  
  // Template state
  const [layoutTemplates, setLayoutTemplates] = useState<LayoutTemplate[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState(DEFAULT_LAYOUT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");

  // Filter BOM items
  const filteredBomItems = bomItems.filter(item => {
    const matchesSearch = 
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showOnlyAvailable) {
      return matchesSearch && (item.quantity - (item.inUse || 0) > 0);
    }
    
    return matchesSearch;
  });

  // Initialize JointJS
  useEffect(() => {
    if (!paperRef.current) return;
    
    // Create graph
    const graph = new joint.dia.Graph();
    graphRef.current = graph;
    
    // Create paper (the canvas)
    const paper = new joint.dia.Paper({
      el: paperRef.current,
      model: graph,
      width: '100%',
      height: '100%',
      gridSize: GRID_SIZE,
      drawGrid: {
        name: 'mesh',
        args: {
          color: '#ddd',
          thickness: 1
        }
      },
      background: {
        color: '#F8F9FA'
      },
      snapLinks: true,
      linkPinning: false,
      embeddingMode: true
    });
    paperInstanceRef.current = paper;

    // Enable snapping to grid
    paper.on('cell:pointerdown', function(cellView) {
      const cell = cellView.model;
      cell.set('originalPosition', cell.position());
    });

    paper.on('cell:pointerup', function(cellView) {
      const cell = cellView.model;
      const position = cell.position();
      
      // Snap to grid
      const snappedPosition = {
        x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
        y: Math.round(position.y / GRID_SIZE) * GRID_SIZE
      };
      
      cell.position(snappedPosition.x, snappedPosition.y);
      
      // Update ruler dimensions if this is the selected enclosure
      if (selectedEnclosure && selectedEnclosure.id === cell.id) {
        const size = cell.size();
        setRulerDimensions({
          width: size.width,
          height: size.height
        });
      }
    });

    // Handle selection for ruler display
    paper.on('element:pointerclick', function(elementView) {
      const element = elementView.model;
      if (element.get('type') === 'standard.Rectangle' && element.get('isEnclosure')) {
        setSelectedEnclosure(element);
        setShowRuler(true);
        const size = element.size();
        setRulerDimensions({
          width: size.width,
          height: size.height
        });
      }
    });

    // Handle blank click to deselect
    paper.on('blank:pointerclick', function() {
      setSelectedEnclosure(null);
      setShowRuler(false);
    });
    
    // Handle resizing of an enclosure
    paper.on('element:resize', function(elementView) {
      const element = elementView.model;
      // Ensure the element size is snapped to the grid
      const size = element.size();
      const newSize = {
        width: Math.round(size.width / GRID_SIZE) * GRID_SIZE,
        height: Math.round(size.height / GRID_SIZE) * GRID_SIZE
      };
      element.resize(newSize.width, newSize.height);
      
      // Update ruler if this is the selected enclosure
      if (selectedEnclosure && selectedEnclosure.id === element.id) {
        setRulerDimensions({
          width: newSize.width,
          height: newSize.height
        });
      }
    });
    
    // Load saved layout if available
    const savedLayout = localStorage.getItem(`layout-${subProjectId}`);
    if (savedLayout) {
      try {
        const savedCells = JSON.parse(savedLayout);
        const loadedCells = savedCells.map((cell: any) => {
          if (cell.type === 'standard.Rectangle') {
            return new joint.shapes.standard.Rectangle(cell);
          }
          return null;
        }).filter(Boolean);
        
        graph.addCells(loadedCells);
      } catch (e) {
        console.error('Error loading saved layout', e);
      }
    }
    
    return () => {
      // Cleanup
      if (paperInstanceRef.current) {
        // Use type assertion to access the remove method
        (paperInstanceRef.current as unknown as { remove: () => void }).remove();
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
    if (!graphRef.current) return;
    
    const serializedGraph = graphRef.current.toJSON();
    localStorage.setItem(`layout-${subProjectId}`, JSON.stringify(serializedGraph.cells));
    
    toast("Your panel layout has been saved");
  };
  
  // Create a component element on the canvas
  const createComponentElement = (bomItem: BomItem) => {
    if (!graphRef.current) return;
    
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
    
    // Create a rectangle element
    const rect = new joint.shapes.standard.Rectangle({
      position: { x: 100, y: 100 },
      size: { width: 80, height: 40 },
      attrs: {
        body: {
          fill: color,
          stroke: 'none'
        },
        label: {
          text: bomItem.description,
          fill: 'white',
          fontWeight: 'bold',
          fontSize: 10,
          textVerticalAnchor: 'middle',
          textAnchor: 'middle'
        }
      },
      bomItemId: bomItem.id
    });
    
    // Always add elements as an array to graphs
    graphRef.current.addCells([rect as unknown as joint.dia.Cell]);
    
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
    if (!graphRef.current) return;

    // Create a rectangle representing an enclosure
    const enclosure = new joint.shapes.standard.Rectangle({
      position: { x: 100, y: 100 },
      size: { width: 200, height: 300 },
      attrs: {
        body: {
          fill: 'rgba(200, 200, 200, 0.3)',
          stroke: '#333',
          strokeWidth: 2,
          rx: 5, // rounded corners
          ry: 5
        },
        label: {
          text: 'Enclosure',
          fill: '#333',
          fontWeight: 'bold',
          fontSize: 12,
          textVerticalAnchor: 'top',
          textAnchor: 'middle',
          refY: 10
        }
      },
      isEnclosure: true
    });

    // Make the enclosure resizable
    enclosure.attr({
      resizable: {
        minWidth: GRID_SIZE,
        minHeight: GRID_SIZE,
        maxWidth: 1000,
        maxHeight: 1000,
        orthogonalResize: true,
        preserveAspectRatio: false
      }
    });

    // Always use addCells with an array to fix type compatibility
    graphRef.current.addCells([enclosure as unknown as joint.dia.Cell]);
    setSelectedEnclosure(enclosure as unknown as joint.dia.Cell);
    setShowRuler(true);
    setRulerDimensions({
      width: 200,
      height: 300
    });
    
    saveLayout();
    
    toast("Enclosure added. Click and drag to move. Resize using the handles.");
  };
  
  // Save layout as template
  const saveLayoutTemplate = () => {
    if (!graphRef.current) return;
    if (!newTemplateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    
    const serializedGraph = graphRef.current.toJSON();
    if (serializedGraph.cells.length === 0) {
      toast.error("Cannot save an empty layout template");
      return;
    }
    
    const finalCategory = customCategory.trim() ? customCategory : newTemplateCategory;
    
    const newTemplate: LayoutTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      category: finalCategory,
      layout: serializedGraph,
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
    if (!graphRef.current) return;
    
    // Clear current graph
    graphRef.current.clear();
    
    // Load cells from template
    try {
      const loadedCells = template.layout.cells.map((cell: any) => {
        if (cell.type === 'standard.Rectangle') {
          return new joint.shapes.standard.Rectangle(cell);
        }
        return null;
      }).filter(Boolean);
      
      graphRef.current.addCells(loadedCells);
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
    if (!paperInstanceRef.current) return;
    const currentScale = paperInstanceRef.current.scale();
    paperInstanceRef.current.scale(currentScale.sx * 1.2, currentScale.sy * 1.2);
  };
  
  const handleZoomOut = () => {
    if (!paperInstanceRef.current) return;
    const currentScale = paperInstanceRef.current.scale();
    paperInstanceRef.current.scale(currentScale.sx / 1.2, currentScale.sy / 1.2);
  };
  
  const handleResetView = () => {
    if (!paperInstanceRef.current) return;
    paperInstanceRef.current.scale(1, 1);
  };
  
  const handleToggleGrid = () => {
    if (!paperInstanceRef.current) return;
    paperInstanceRef.current.options.drawGrid = !paperInstanceRef.current.options.drawGrid;
    paperInstanceRef.current.drawGrid();
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
        {/* JointJS Canvas Panel */}
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
                ref={paperRef} 
                className="absolute inset-0"
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
