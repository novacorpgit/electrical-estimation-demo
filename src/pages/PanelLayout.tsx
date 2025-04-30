
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Navigation } from "@/components/Navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Grid, ZoomIn, ZoomOut, RotateCw, RefreshCcw } from "lucide-react";
import { BomItem, defaultCategories } from "@/components/quote/bom/BomTypes";
import { Resizable } from "react-resizable-panels";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import * as joint from "jointjs";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";

// Mock items (would be replaced with actual data in a real implementation)
const initialItems: BomItem[] = [
  { 
    id: "1", 
    description: "100A Main Switch", 
    quantity: 10, 
    unitCost: 450, 
    totalCost: 4500, 
    category: "switchgear",
    partNumber: "MS-100A",
    supplier: "Electric Components Ltd"
  },
  { 
    id: "2", 
    description: "63A MCCB", 
    quantity: 8, 
    unitCost: 250, 
    totalCost: 2000, 
    category: "breakers",
    partNumber: "MCCB-63A",
    supplier: "Circuit Pro"
  },
  { 
    id: "3", 
    description: "32A MCB", 
    quantity: 24, 
    unitCost: 45, 
    totalCost: 1080, 
    category: "breakers",
    partNumber: "MCB-32A",
    supplier: "Circuit Pro"
  },
  { 
    id: "4", 
    description: "Installation Labor", 
    quantity: 8, 
    unitCost: 120, 
    totalCost: 960, 
    category: "labor",
    supplier: "Internal"
  },
  { 
    id: "5", 
    description: "Terminal Blocks", 
    quantity: 50, 
    unitCost: 5, 
    totalCost: 250, 
    category: "terminals",
    partNumber: "TB-10mm",
    supplier: "Connect Systems"
  }
];

// Define category colors
const categoryColors: Record<string, string> = {
  "breakers": "#FF6B6B",
  "switchgear": "#4ECDC4",
  "enclosures": "#1A535C",
  "terminals": "#FFE66D",
  "cables": "#6699CC",
  "other": "#F7FFF7",
  "labor": "#CCCCCC"
};

type LayoutItem = {
  id: string;
  bomItemId: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rotation: number;
  element: joint.dia.Element;
};

const PanelLayout = () => {
  const { subProjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const subProject = location.state?.subProject;
  const projectId = location.state?.projectId;
  const projectName = location.state?.projectName;
  
  const [bomItems, setBomItems] = useState<BomItem[]>(initialItems);
  const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const paperRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<joint.dia.Graph | null>(null);
  const paperInstanceRef = useRef<joint.dia.Paper | null>(null);
  
  // Calculate used quantities
  const usedQuantities = React.useMemo(() => {
    const used: Record<string, number> = {};
    layoutItems.forEach(item => {
      if (used[item.bomItemId]) {
        used[item.bomItemId]++;
      } else {
        used[item.bomItemId] = 1;
      }
    });
    return used;
  }, [layoutItems]);
  
  // Filter BOM items based on the showOnlyAvailable toggle
  const filteredBomItems = React.useMemo(() => {
    if (!showOnlyAvailable) return bomItems;
    return bomItems.filter(item => {
      const used = usedQuantities[item.id] || 0;
      return item.quantity - used > 0;
    });
  }, [bomItems, usedQuantities, showOnlyAvailable]);
  
  // Initialize JointJS
  useEffect(() => {
    if (!paperRef.current) return;
    
    // Create graph and paper if they don't exist yet
    if (!graphRef.current) {
      const namespace = joint.shapes;
      const graph = new joint.dia.Graph({}, { cellNamespace: namespace });
      graphRef.current = graph;
      
      const paper = new joint.dia.Paper({
        el: paperRef.current,
        model: graph,
        width: paperRef.current.clientWidth,
        height: paperRef.current.clientHeight,
        gridSize: 20,
        drawGrid: showGrid ? { name: 'mesh', args: { color: '#cccccc', thickness: 1 } } : false,
        background: { color: '#f8f9fa' },
        snapLinks: true,
        interactive: true,
        cellViewNamespace: namespace
      });
      
      paperInstanceRef.current = paper;
      
      // Event handlers
      paper.on('element:contextmenu', (elementView) => {
        showContextMenu(elementView);
      });
      
      // Resize handler
      const resizeObserver = new ResizeObserver(() => {
        if (paperRef.current && paperInstanceRef.current) {
          paperInstanceRef.current.setDimensions(
            paperRef.current.clientWidth,
            paperRef.current.clientHeight
          );
        }
      });
      
      resizeObserver.observe(paperRef.current);
      
      return () => {
        resizeObserver.disconnect();
        paper.remove();
        graph.clear();
      };
    }
    
    // Update grid visibility when the showGrid state changes
    if (paperInstanceRef.current) {
      paperInstanceRef.current.setGridSize(20);
      paperInstanceRef.current.drawGrid(
        showGrid ? { name: 'mesh', args: { color: '#cccccc', thickness: 1 } } : false
      );
    }
  }, [paperRef.current, showGrid]);
  
  // Apply zoom level
  useEffect(() => {
    if (paperInstanceRef.current) {
      paperInstanceRef.current.scale(zoomLevel, zoomLevel);
    }
  }, [zoomLevel]);
  
  // Show context menu for element
  const showContextMenu = (elementView: joint.dia.ElementView) => {
    const element = elementView.model;
    const bomItemId = element.get('bomItemId');
    
    // Create a custom context menu
    const menuDiv = document.createElement('div');
    menuDiv.className = 'absolute bg-white shadow-lg rounded-md p-2 z-50';
    menuDiv.style.left = `${elementView.getBBox().x + elementView.getBBox().width + 10}px`;
    menuDiv.style.top = `${elementView.getBBox().y}px`;
    
    // Rotate button
    const rotateBtn = document.createElement('button');
    rotateBtn.className = 'flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-md text-sm';
    rotateBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>Rotate 90°';
    rotateBtn.onclick = () => {
      const currentRotation = element.get('angle') || 0;
      element.rotate(currentRotation + 90);
      
      // Update the layout item
      setLayoutItems(prevItems => {
        return prevItems.map(item => {
          if (item.element.id === element.id) {
            return {
              ...item,
              rotation: (item.rotation + 90) % 360
            };
          }
          return item;
        });
      });
      
      document.body.removeChild(menuDiv);
    };
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'flex items-center gap-2 w-full px-3 py-2 hover:bg-red-100 text-red-600 rounded-md text-sm mt-2';
    deleteBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>Delete';
    deleteBtn.onclick = () => {
      element.remove();
      
      // Update the layout items
      setLayoutItems(prevItems => prevItems.filter(item => item.element.id !== element.id));
      
      document.body.removeChild(menuDiv);
    };
    
    menuDiv.appendChild(rotateBtn);
    menuDiv.appendChild(deleteBtn);
    document.body.appendChild(menuDiv);
    
    // Close the menu when clicking elsewhere
    const closeMenu = (e: MouseEvent) => {
      if (!menuDiv.contains(e.target as Node)) {
        document.body.removeChild(menuDiv);
        document.removeEventListener('mousedown', closeMenu);
      }
    };
    
    document.addEventListener('mousedown', closeMenu);
  };
  
  // Handle drag from BOM table to canvas
  const handleDragStart = (e: React.DragEvent, item: BomItem) => {
    // Check if item is available
    const used = usedQuantities[item.id] || 0;
    if (item.quantity - used <= 0) {
      e.preventDefault();
      return;
    }
    
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copy';
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const json = e.dataTransfer.getData('application/json');
    if (!json) return;
    
    try {
      const item = JSON.parse(json) as BomItem;
      const used = usedQuantities[item.id] || 0;
      if (item.quantity - used <= 0) return;
      
      if (graphRef.current && paperInstanceRef.current) {
        const paperOffset = paperRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        const x = Math.round((e.clientX - paperOffset.left) / 20) * 20;
        const y = Math.round((e.clientY - paperOffset.top) / 20) * 20;
        
        // Get category color
        const category = item.category;
        const color = categoryColors[category] || categoryColors.other;
        
        // Create a rectangle element
        const rect = new joint.shapes.standard.Rectangle({
          position: { x, y },
          size: { width: 80, height: 40 },
          attrs: {
            body: {
              fill: color,
              stroke: '#000000',
              strokeWidth: 1,
            },
            label: {
              text: `[${item.description}]`,
              fill: '#000000',
              fontSize: 10,
              fontFamily: 'Arial, sans-serif',
              textVerticalAnchor: 'middle',
              textAnchor: 'middle'
            }
          },
          bomItemId: item.id
        });
        
        graphRef.current.addCell(rect);
        
        // Add the item to layout items
        const newLayoutItem: LayoutItem = {
          id: uuidv4(),
          bomItemId: item.id,
          positionX: x,
          positionY: y,
          width: 80,
          height: 40,
          rotation: 0,
          element: rect
        };
        
        setLayoutItems(prev => [...prev, newLayoutItem]);
        
        // Auto-save layout
        saveLayout([...layoutItems, newLayoutItem]);
      }
    } catch (error) {
      console.error("Error adding element to canvas:", error);
    }
  };
  
  // Save the current layout
  const saveLayout = _.debounce((items: LayoutItem[]) => {
    console.log("Layout saved:", items);
    // In a real app, this would be a call to save the layout to the server
    // For now, we just log it to the console
  }, 1000);
  
  // Reset the view
  const resetView = () => {
    if (graphRef.current && paperInstanceRef.current) {
      // Clear all elements
      graphRef.current.clear();
      setLayoutItems([]);
      setZoomLevel(1);
      paperInstanceRef.current.scale(1, 1);
    }
  };
  
  // Go back to project
  const goBackToProject = () => {
    if (projectId) {
      navigate(`/project/${projectId}`);
    } else {
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="2D Panel Layout" />
      
      <div className="container mx-auto p-4">
        {/* Sub-project panel header */}
        {subProject && (
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={goBackToProject}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Project
              </Button>
              <h1 className="text-2xl font-bold">{projectName || "Project"}</h1>
            </div>
            <div className="bg-white p-4 rounded-md shadow mt-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{subProject.name} - 2D Layout</h2>
                  <p className="text-gray-600">ID: {subProject.id}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-gray-700">
                    <span className="font-medium">{subProject.panelType} Panel</span> | 
                    {subProject.boardRating}, {subProject.ipRating}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col h-[calc(100vh-250px)]">
          <Resizable>
            <ResizablePanel defaultSize={60} minSize={30}>
              <Card>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Panel Layout Canvas</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Toggle
                        pressed={showGrid}
                        onPressedChange={setShowGrid}
                        aria-label="Toggle grid"
                      >
                        <Grid className="h-4 w-4" />
                      </Toggle>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 2))}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={resetView}
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 border-t">
                  <div 
                    ref={paperRef}
                    className="w-full h-full min-h-[300px]"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {/* JointJS will render here */}
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>
            
            <ResizableHandle />
            
            <ResizablePanel defaultSize={40} minSize={20}>
              <Card>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Components Inventory</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="show-available"
                          checked={showOnlyAvailable}
                          onCheckedChange={(checked) => 
                            setShowOnlyAvailable(checked === true)
                          }
                        />
                        <label
                          htmlFor="show-available"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Show only available items
                        </label>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-auto max-h-[calc(100vh-500px)]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Qty Total</TableHead>
                          <TableHead className="text-right">In Use</TableHead>
                          <TableHead className="text-right">Available</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBomItems.map((item) => {
                          const used = usedQuantities[item.id] || 0;
                          const available = item.quantity - used;
                          const category = defaultCategories.find(cat => cat.id === item.category);
                          
                          return (
                            <TableRow
                              key={item.id}
                              className={cn(
                                "cursor-pointer hover:bg-muted/50",
                                available <= 0 && "opacity-50 cursor-not-allowed"
                              )}
                              draggable={available > 0}
                              onDragStart={(e) => handleDragStart(e, item)}
                              style={{
                                "--category-color": categoryColors[item.category] || "#cccccc"
                              } as React.CSSProperties}
                            >
                              <TableCell>
                                <div className="flex items-center">
                                  <div 
                                    className="w-3 h-3 mr-2 rounded-sm" 
                                    style={{backgroundColor: categoryColors[item.category] || "#cccccc"}}
                                  />
                                  {item.description}
                                </div>
                              </TableCell>
                              <TableCell>{category?.name || item.category}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">{used}</TableCell>
                              <TableCell className="text-right font-medium">{available}</TableCell>
                            </TableRow>
                          );
                        })}
                        {filteredBomItems.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              No components available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>
          </Resizable>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Instructions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-muted/30 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Adding Components</h4>
                  <p className="text-sm text-muted-foreground">
                    Drag components from the inventory table to the canvas to place them.
                    Only components with available quantity can be placed.
                  </p>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Moving Components</h4>
                  <p className="text-sm text-muted-foreground">
                    Click and drag components on the canvas to reposition them.
                    Components will snap to a 20px grid.
                  </p>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Component Actions</h4>
                  <p className="text-sm text-muted-foreground">
                    Right-click on a component to access the context menu with options to rotate or delete it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PanelLayout;
