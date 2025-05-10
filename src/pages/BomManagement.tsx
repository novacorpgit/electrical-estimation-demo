
import React, { useState, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BomItem, BomCategory, defaultCategories } from "@/components/quote/bom/BomTypes";
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, FileText, Download, Filter, ArrowLeft, Layers } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Mock items (would be replaced with actual data in a real implementation)
const initialItems: BomItem[] = [
  { 
    id: "1", 
    description: "100A Main Switch", 
    quantity: 1, 
    unitCost: 450, 
    totalCost: 450, 
    category: "switchgear",
    partNumber: "MS-100A",
    supplier: "Electric Components Ltd"
  },
  { 
    id: "2", 
    description: "63A MCCB", 
    quantity: 4, 
    unitCost: 250, 
    totalCost: 1000, 
    category: "breakers",
    partNumber: "MCCB-63A",
    supplier: "Circuit Pro"
  },
  { 
    id: "3", 
    description: "Installation Labor", 
    quantity: 8, 
    unitCost: 120, 
    totalCost: 960, 
    category: "labor",
    supplier: "Internal"
  }
];

const BomManagement = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<BomItem[]>(initialItems);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [activeTab, setActiveTab] = useState<string>("bom-list");
  
  const { subProjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const subProject = location.state?.subProject;
  const projectId = location.state?.projectId;
  const projectName = location.state?.projectName;

  // Define columns for AG Grid
  const columnDefs: ColDef[] = [
    { 
      field: 'description', 
      headerName: 'Description',
      flex: 2,
      editable: editMode,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'category', 
      headerName: 'Category',
      flex: 1,
      editable: editMode,
      filter: 'agSetColumnFilter',
      valueFormatter: params => {
        const category = defaultCategories.find(cat => cat.id === params.value);
        return category ? category.name : params.value;
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: defaultCategories.map(cat => cat.id)
      }
    },
    { 
      field: 'partNumber', 
      headerName: 'Part Number',
      flex: 1,
      editable: editMode,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'supplier', 
      headerName: 'Supplier',
      flex: 1,
      editable: editMode,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'quantity', 
      headerName: 'Quantity',
      flex: 1,
      editable: editMode,
      filter: 'agNumberColumnFilter',
      valueParser: params => {
        return Number(params.newValue);
      }
    },
    { 
      field: 'unitCost', 
      headerName: 'Unit Cost',
      flex: 1,
      editable: editMode,
      filter: 'agNumberColumnFilter',
      valueFormatter: params => {
        return params.value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
      },
      valueParser: params => {
        return Number(params.newValue);
      }
    },
    { 
      field: 'totalCost', 
      headerName: 'Total Cost',
      flex: 1,
      editable: false,
      valueFormatter: params => {
        return params.value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
      }
    },
    {
      headerName: 'Actions',
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center justify-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDeleteRow(params.data.id)}
              className="p-1 h-8"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      }
    }
  ];

  const defaultColDef = {
    sortable: true,
    resizable: true
  };

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const handleAddRow = () => {
    const newItem: BomItem = {
      id: uuidv4(),
      description: "",
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
      category: defaultCategories[0].id
    };
    setRowData([...rowData, newItem]);
    
    // If in edit mode, start editing the description cell of the new row
    if (editMode && gridApi) {
      setTimeout(() => {
        const rowIndex = rowData.length;
        gridApi.startEditingCell({
          rowIndex,
          colKey: 'description'
        });
      }, 100);
    }
  };

  const handleDeleteRow = (id: string) => {
    const updatedRowData = rowData.filter(item => item.id !== id);
    setRowData(updatedRowData);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const recalculateTotals = useCallback(() => {
    const updatedData = rowData.map(item => ({
      ...item,
      totalCost: item.quantity * item.unitCost
    }));
    setRowData(updatedData);
  }, [rowData]);

  const onCellValueChanged = (event: any) => {
    // Recalculate total cost when quantity or unit cost changes
    if (event.column.colId === 'quantity' || event.column.colId === 'unitCost') {
      const rowIndex = event.rowIndex;
      const updatedRowData = [...rowData];
      updatedRowData[rowIndex].totalCost = 
        updatedRowData[rowIndex].quantity * updatedRowData[rowIndex].unitCost;
      setRowData(updatedRowData);
    }
  };

  const exportToCsv = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: 'bom-export.csv'
      });
    }
  };

  const applyFilter = () => {
    if (gridApi) {
      gridApi.setQuickFilter(filter);
      
      if (categoryFilter) {
        const filterInstance = gridApi.getFilterInstance('category');
        if (filterInstance) {
          filterInstance.setModel({
            type: 'equals',
            filter: categoryFilter
          });
          gridApi.onFilterChanged();
        }
      }
    }
  };

  const clearFilter = () => {
    setFilter("");
    setCategoryFilter("");
    if (gridApi) {
      gridApi.setQuickFilter("");
      
      // Clear individual column filters
      const filterModel = gridApi.getFilterModel();
      if (filterModel) {
        Object.keys(filterModel).forEach(key => {
          const filterInstance = gridApi.getFilterInstance(key);
          if (filterInstance) {
            filterInstance.setModel(null);
          }
        });
        gridApi.onFilterChanged();
      }
    }
  };

  // Calculate totals
  const totalMaterialCost = rowData
    .filter(item => item.category !== 'labor')
    .reduce((sum, item) => sum + item.totalCost, 0);
  
  const totalLaborCost = rowData
    .filter(item => item.category === 'labor')
    .reduce((sum, item) => sum + item.totalCost, 0);
  
  const grandTotal = totalMaterialCost + totalLaborCost;

  const goBackToProject = () => {
    if (projectId) {
      navigate(`/project/${projectId}`);
    } else {
      navigate('/');
    }
  };

  // Placeholder component for 2D view
  const TwoDView = () => (
    <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 border rounded-lg">
      <Layers className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-medium text-gray-600">2D Panel Layout View</h3>
      <p className="text-gray-500 mt-2 max-w-md text-center">
        This is where the 2D panel layout visualization would appear. 
        Components can be arranged and positioned on the panel.
      </p>
      <Button className="mt-6">Initialize Layout Builder</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="BOM Management" />
      
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
                  <h2 className="text-xl font-semibold">{subProject.name}</h2>
                  <p className="text-gray-600">ID: {subProject.id}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-gray-700">
                    <span className="font-medium">{subProject.panelType} Panel</span> | 
                    Qty: {subProject.quantity} | 
                    {subProject.boardRating}, {subProject.ipRating}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="bom-list">BOM Management</TabsTrigger>
            <TabsTrigger value="2d-view">2D Panel Layout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bom-list">
            <div className="mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    {subProject ? `BOM for ${subProject.name}` : "Bill of Materials Items"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="filter">Search</Label>
                      <Input
                        id="filter"
                        placeholder="Filter items..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoryFilter">Category</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger id="categoryFilter" className="w-48">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {defaultCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={applyFilter} variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Apply Filter
                      </Button>
                      <Button onClick={clearFilter} variant="outline">
                        Clear Filters
                      </Button>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <Button variant={editMode ? "default" : "outline"} onClick={toggleEditMode}>
                        {editMode ? "Done Editing" : "Edit Items"}
                      </Button>
                      <Button onClick={handleAddRow} className="ml-2">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                      <Button onClick={exportToCsv} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                      </Button>
                    </div>
                  </div>

                  <div 
                    className="ag-theme-alpine" 
                    style={{ 
                      height: '500px', 
                      width: '100%' 
                    }}
                  >
                    <AgGridReact
                      ref={gridRef}
                      rowData={rowData}
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      onGridReady={onGridReady}
                      rowSelection="multiple"
                      animateRows={true}
                      onCellValueChanged={onCellValueChanged}
                      suppressClickEdit={!editMode}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-medium text-sm text-muted-foreground">Materials Total</h3>
                        <p className="text-2xl font-bold">
                          {totalMaterialCost.toLocaleString('en-AU', { 
                            style: 'currency', 
                            currency: 'AUD' 
                          })}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-medium text-sm text-muted-foreground">Labor Total</h3>
                        <p className="text-2xl font-bold">
                          {totalLaborCost.toLocaleString('en-AU', { 
                            style: 'currency', 
                            currency: 'AUD' 
                          })}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-medium text-sm text-muted-foreground">Grand Total</h3>
                        <p className="text-2xl font-bold">
                          {grandTotal.toLocaleString('en-AU', { 
                            style: 'currency', 
                            currency: 'AUD' 
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="2d-view">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Layers className="mr-2 h-5 w-5" />
                  {subProject ? `2D Layout for ${subProject.name}` : "2D Panel Layout"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TwoDView />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BomManagement;
