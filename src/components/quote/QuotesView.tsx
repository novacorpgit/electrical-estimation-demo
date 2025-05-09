
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QuoteForm } from "./QuoteForm";
import { BomItem, Quote } from "./bom/BomTypes";
import { QuoteDetailView } from "./QuoteDetailView";
import { X } from "lucide-react";
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu";
import { toast } from "sonner";

// Mock quote data with BOM items
const mockQuotes: Quote[] = [
  {
    id: "Q001",
    quoteNumber: "B25-0431M-DJ",
    subProjectId: "SP001",
    subProjectName: "Main Distribution Board",
    currency: "AUD",
    finalValue: 12500.00,
    status: "Draft",
    createdBy: "David Jones",
    createdDate: "2025-04-15",
    expiryDate: "2025-05-15",
    bomItems: [
      { id: "1", description: "100A Main Switch", quantity: 1, unitCost: 450, totalCost: 450, category: "switchgear" },
      { id: "2", description: "63A MCCB", quantity: 4, unitCost: 250, totalCost: 1000, category: "breakers" },
      { id: "3", description: "Installation Labor", quantity: 8, unitCost: 120, totalCost: 960, category: "labor" }
    ]
  },
  {
    id: "Q002",
    quoteNumber: "S25-0432M-DJ",
    subProjectId: "SP002",
    subProjectName: "Emergency Lighting Panel",
    currency: "AUD",
    finalValue: 4750.00,
    status: "Approved",
    createdBy: "David Jones",
    createdDate: "2025-04-16",
    expiryDate: "2025-05-16",
    bomItems: [
      { id: "1", description: "Emergency Lighting Controller", quantity: 1, unitCost: 1200, totalCost: 1200, category: "switchgear" },
      { id: "2", description: "10A MCB", quantity: 6, unitCost: 45, totalCost: 270, category: "breakers" }
    ]
  },
  {
    id: "Q003",
    quoteNumber: "B25-0433M-DJ",
    subProjectId: "SP003",
    subProjectName: "HVAC Control Panel",
    currency: "AUD",
    finalValue: 8920.00,
    status: "Pending Approval",
    createdBy: "David Jones",
    createdDate: "2025-04-17",
    expiryDate: "2025-05-17",
    bomItems: [] as BomItem[]
  },
  {
    id: "Q004",
    quoteNumber: "B25-0434M-DJ",
    subProjectId: "SP004",
    subProjectName: "Basement Distribution Board",
    currency: "USD",
    finalValue: 9500.00,
    status: "Draft",
    createdBy: "David Jones",
    createdDate: "2025-04-18",
    expiryDate: "2025-05-18",
    bomItems: [] as BomItem[]
  },
  {
    id: "Q005",
    quoteNumber: "M25-0435M-DJ",
    subProjectId: "SP005",
    subProjectName: "Office Floor DB",
    currency: "AUD",
    finalValue: 6250.00,
    status: "Rejected",
    createdBy: "David Jones",
    createdDate: "2025-04-19",
    expiryDate: "2025-05-19",
    bomItems: [] as BomItem[]
  }
];

export const QuotesView = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showQuoteDetail, setShowQuoteDetail] = useState(false);
  const [selectedSubProject, setSelectedSubProject] = useState({ id: "", name: "" });
  
  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    quoteNumber: true,
    subProjectName: true,
    currency: true,
    finalValue: true,
    bomItems: true,
    status: true,
    createdDate: true,
    id: true,
  });
  
  // Filter quotes based on search term and active tab
  const filteredQuotes = useMemo(() => {
    return mockQuotes.filter(quote => {
      const matchesSearch = 
        quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.subProjectName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === "all") return matchesSearch;
      if (activeTab === "draft") return matchesSearch && quote.status === "Draft";
      if (activeTab === "pending") return matchesSearch && quote.status === "Pending Approval";
      if (activeTab === "approved") return matchesSearch && quote.status === "Approved";
      if (activeTab === "rejected") return matchesSearch && quote.status === "Rejected";
      
      return matchesSearch;
    });
  }, [searchTerm, activeTab]);
  
  // AG Grid Column Definitions with properly typed fields - REORDERED to put quote number first
  const columnDefs = useMemo<ColDef<Quote>[]>(() => [
    {
      headerName: 'Quote #',
      field: 'quoteNumber',
      resizable: true,
      width: 150,
      editable: true,
      cellClass: 'editable-cell'
    },
    {
      headerName: 'Sub-Project',
      field: 'subProjectName',
      resizable: true,
      width: 200,
      editable: true,
      cellClass: 'editable-cell'
    },
    {
      headerName: 'Currency',
      field: 'currency',
      resizable: true,
      width: 120,
      editable: true,
      cellClass: 'editable-cell'
    },
    {
      headerName: 'Value',
      field: 'finalValue',
      resizable: true,
      width: 150,
      editable: true,
      cellClass: 'editable-cell',
      valueFormatter: (params: any) => {
        return params.value.toLocaleString('en-AU', { 
          style: 'currency', 
          currency: params.data.currency 
        });
      }
    },
    {
      headerName: 'Items',
      field: 'bomItems',
      resizable: true,
      width: 120,
      editable: false,
      valueFormatter: (params: any) => {
        return `${params.value.length} items`;
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      resizable: true,
      width: 150,
      editable: true,
      cellClass: 'editable-cell'
    },
    {
      headerName: 'Created Date',
      field: 'createdDate',
      resizable: true,
      width: 150,
      editable: true,
      cellClass: 'editable-cell'
    },
    {
      headerName: 'Actions',
      field: 'id',
      resizable: true,
      sortable: false,
      filter: false,
      width: 200,
      editable: false,
      cellRenderer: (params: any) => {
        return `
          <button class="ag-grid-button view-button">View</button>
          <button class="ag-grid-button edit-button">Edit</button>
          <button class="ag-grid-button send-button">Send</button>
        `;
      }
    }
  ], []);

  // AG Grid Default Column Definitions
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    suppressMenu: true, // We'll use our own context menu
  }), []);

  // AG Grid Cell Click Event
  const onCellClicked = (params: any) => {
    if (params.column.colId === 'id') {
      const classList = params.event.target.classList;
      if (classList.contains('view-button')) {
        handleViewQuote(params.data.id);
      } else if (classList.contains('edit-button')) {
        handleEditQuote(params.data.id);
      } else if (classList.contains('send-button')) {
        handleSendQuote(params.data.id);
      }
    }
  };
  
  const handleCreateQuote = (subProjectId: string, subProjectName: string) => {
    setSelectedSubProject({ id: subProjectId, name: subProjectName });
    setShowCreateQuote(true);
    setShowQuoteDetail(false);
  };

  const handleViewQuote = (id: string) => {
    const quote = mockQuotes.find(q => q.id === id);
    if (quote) {
      setSelectedQuote(quote);
      setShowQuoteDetail(true);
      setShowCreateQuote(false);
    }
  };

  const handleEditQuote = (id: string) => {
    const quote = mockQuotes.find(q => q.id === id);
    if (quote) {
      setSelectedSubProject({ id: quote.subProjectId, name: quote.subProjectName });
      setSelectedQuote(quote);
      setShowCreateQuote(true);
      setShowQuoteDetail(false);
    }
  };

  const handleSendQuote = (id: string) => {
    // Mock functionality for sending a quote
    toast.success(`Quote ${id} sent successfully!`);
  };

  // Cell value changed event handler
  const onCellValueChanged = useCallback((params: any) => {
    // In a real app, we would update the data in a database
    toast.success(`Updated ${params.colDef.headerName} to ${params.newValue}`);
  }, []);

  // Toggle column visibility function
  const toggleColumnVisibility = (field: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Get visible columns for AG Grid
  const columnDef = useMemo(() => {
    return columnDefs.filter(col => columnVisibility[col.field as string] !== false);
  }, [columnDefs, columnVisibility]);

  return (
    <div>
      {showQuoteDetail && selectedQuote ? (
        <QuoteDetailView 
          quote={selectedQuote}
          onEdit={() => handleEditQuote(selectedQuote.id)}
          onBack={() => setShowQuoteDetail(false)}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Quotes</h2>
            <Button onClick={() => handleCreateQuote("SP006", "New Panel")}>Create Quote</Button>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="w-1/3">
                  <Input
                    placeholder="Search quotes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-x-2">
                  <Button variant="outline">Export</Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Quotes</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-4">
                  <ContextMenu>
                    <ContextMenuTrigger className="w-full">
                      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                        <AgGridReact
                          rowData={filteredQuotes}
                          columnDefs={columnDef}
                          defaultColDef={defaultColDef}
                          onCellClicked={onCellClicked}
                          onCellValueChanged={onCellValueChanged}
                          pagination={true}
                          paginationPageSize={10}
                          paginationPageSizeSelector={[5, 10, 20, 50]}
                          singleClickEdit={false}
                          undoRedoCellEditing={true}
                          enableCellChangeFlash={true}
                          enableCellTextSelection={true}
                        />
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>Refresh Data</ContextMenuItem>
                      <ContextMenuItem>Export to Excel</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuCheckboxItem 
                        checked={columnVisibility.quoteNumber} 
                        onCheckedChange={() => toggleColumnVisibility('quoteNumber')}
                      >
                        Show Quote #
                      </ContextMenuCheckboxItem>
                      <ContextMenuCheckboxItem 
                        checked={columnVisibility.subProjectName} 
                        onCheckedChange={() => toggleColumnVisibility('subProjectName')}
                      >
                        Show Sub-Project
                      </ContextMenuCheckboxItem>
                      <ContextMenuCheckboxItem 
                        checked={columnVisibility.currency} 
                        onCheckedChange={() => toggleColumnVisibility('currency')}
                      >
                        Show Currency
                      </ContextMenuCheckboxItem>
                      <ContextMenuCheckboxItem 
                        checked={columnVisibility.finalValue} 
                        onCheckedChange={() => toggleColumnVisibility('finalValue')}
                      >
                        Show Value
                      </ContextMenuCheckboxItem>
                      <ContextMenuCheckboxItem 
                        checked={columnVisibility.bomItems} 
                        onCheckedChange={() => toggleColumnVisibility('bomItems')}
                      >
                        Show Items
                      </ContextMenuCheckboxItem>
                      <ContextMenuCheckboxItem 
                        checked={columnVisibility.status} 
                        onCheckedChange={() => toggleColumnVisibility('status')}
                      >
                        Show Status
                      </ContextMenuCheckboxItem>
                      <ContextMenuCheckboxItem 
                        checked={columnVisibility.createdDate} 
                        onCheckedChange={() => toggleColumnVisibility('createdDate')}
                      >
                        Show Created Date
                      </ContextMenuCheckboxItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

      {showCreateQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto relative">
            <Button 
              variant="ghost" 
              className="absolute right-2 top-2 p-2" 
              onClick={() => {
                setShowCreateQuote(false);
                setSelectedQuote(null);
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
            <CardHeader>
              <CardTitle>Create Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <QuoteForm 
                subProjectId={selectedSubProject.id}
                subProjectName={selectedSubProject.name}
                onCancel={() => {
                  setShowCreateQuote(false);
                  setSelectedQuote(null);
                }} 
                onSuccess={() => {
                  setShowCreateQuote(false);
                  setSelectedQuote(null);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
