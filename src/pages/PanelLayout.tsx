
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
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle 
} from "@/components/ui/resizable";
import * as joint from 'jointjs';
import { BomList } from "@/components/quote/bom/BomList";
import { BomItem, BomCategory, defaultCategories } from "@/components/quote/bom/BomTypes";
import { toast } from "sonner";
import { Search, ZoomIn, ZoomOut, Grid3X3, Undo2 } from 'lucide-react';

// Mock BOM items for demonstration
const mockBomItems: BomItem[] = [
  {
    id: "item1",
    description: "MCB 32A",
    category: "circuit-breakers",
    quantity: 10,
    unitCost: 45.99,
    totalCost: 459.90,
    inUse: 2
  },
  {
    id: "item2",
    description: "RCCB 25A",
    category: "circuit-breakers",
    quantity: 5,
    unitCost: 65.50,
    totalCost: 327.50,
    inUse: 0
  },
  {
    id: "item3",
    description: "Power Supply 24V",
    category: "power-supplies",
    quantity: 3,
    unitCost: 120.00,
    totalCost: 360.00,
    inUse: 1
  },
  {
    id: "item4",
    description: "Panel Enclosure 800x600",
    category: "enclosures",
    quantity: 1,
    unitCost: 350.00,
    totalCost: 350.00,
    inUse: 0
  },
  {
    id: "item5",
    description: "DIN Rail 35mm (1m)",
    category: "accessories",
    quantity: 5,
    unitCost: 8.75,
    totalCost: 43.75,
    inUse: 0
  }
];

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
      gridSize: 20,
      drawGrid: true,
      background: {
        color: '#F8F9FA'
      }
    });
    paperInstanceRef.current = paper;
    
    // Load saved layout if available
    // This would be implemented with actual backend persistence
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
    
    // Setup drag-and-drop from BOM table to canvas
    paper.on('cell:pointerup', function(cellView: joint.dia.CellView) {
      // Fix: Use the dia.Cell's attributes to get the bomItemId
      const cell = cellView.model as joint.dia.Cell;
      const bomItemId = cell.get('bomItemId');
      
      if (bomItemId) {
        saveLayout();
      }
    });
    
    return () => {
      // Cleanup
      if (paperInstanceRef.current) {
        // Fix: Use proper dispose method
        paperInstanceRef.current.remove();
      }
    };
  }, [subProjectId]);
  
  // Save layout
  const saveLayout = () => {
    if (!graphRef.current) return;
    
    const serializedGraph = graphRef.current.toJSON();
    localStorage.setItem(`layout-${subProjectId}`, JSON.stringify(serializedGraph.cells));
    toast({
      description: "Your panel layout has been saved"
    });
  };
  
  // Create a component element on the canvas
  const createComponentElement = (bomItem: BomItem) => {
    if (!graphRef.current) return;
    
    // Check if item is available
    const available = bomItem.quantity - (bomItem.inUse || 0);
    if (available <= 0) {
      toast({
        description: "This item is out of stock",
        variant: "destructive"
      });
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
    
    graphRef.current.addCell(rect);
    
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
        <Button onClick={saveLayout}>Save Layout</Button>
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
            </div>
            <div 
              ref={paperRef} 
              className="flex-1 overflow-hidden"
            ></div>
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
    </div>
  );
};

export default PanelLayout;
