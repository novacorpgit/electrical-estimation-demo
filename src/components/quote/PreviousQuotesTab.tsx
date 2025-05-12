
import React, { useState } from "react";
import { Search, Tag, Download, Eye, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

// Mock data for previous quotes
const mockPreviousQuotes = [
  {
    id: "Q100",
    quoteNumber: "B25-0431-DJ",
    date: "2025-03-15",
    revision: "1",
    status: "Approved",
    estimator: "David Jones",
    totalValue: 14250.50,
    currency: "AUD"
  },
  {
    id: "Q101",
    quoteNumber: "B25-0431-DJ-R1",
    date: "2025-03-20",
    revision: "2",
    status: "Approved",
    estimator: "David Jones",
    totalValue: 15775.25,
    currency: "AUD"
  },
  {
    id: "Q102",
    quoteNumber: "B25-0431-DJ-R2",
    date: "2025-04-02",
    revision: "3",
    status: "Draft",
    estimator: "Emily Wilson",
    totalValue: 16420.00,
    currency: "AUD"
  },
  {
    id: "Q103",
    quoteNumber: "B25-0456-EM",
    date: "2025-04-10",
    revision: "1",
    status: "Rejected",
    estimator: "Emily Wilson",
    totalValue: 12300.75,
    currency: "AUD"
  }
];

const PreviousQuotesTab = ({ projectId }: { projectId: string }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [showQuotePreview, setShowQuotePreview] = useState(false);
  
  // Filter quotes based on search term
  const filteredQuotes = mockPreviousQuotes.filter(quote => 
    quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.estimator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote);
    setShowQuotePreview(true);
  };

  const handleDownloadQuote = (quote: any) => {
    toast({
      title: "Downloading Quote",
      description: `Quote ${quote.quoteNumber} is being downloaded.`
    });
  };

  const handleTagQuote = (quote: any, tag: string) => {
    toast({
      title: "Quote Tagged",
      description: `Quote ${quote.quoteNumber} has been tagged as ${tag}.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case "Draft":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search quotes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            Export List
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="p-4 border rounded-md bg-gray-50">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="filters">
              <AccordionTrigger>Advanced Filters</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Status filter */}
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge className="bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200">Draft</Badge>
                      <Badge className="bg-green-100 text-green-800 cursor-pointer hover:bg-green-200">Approved</Badge>
                      <Badge className="bg-red-100 text-red-800 cursor-pointer hover:bg-red-200">Rejected</Badge>
                    </div>
                  </div>
                  
                  {/* Estimator filter */}
                  <div>
                    <label className="text-sm font-medium">Estimator</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200">David Jones</Badge>
                      <Badge className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200">Emily Wilson</Badge>
                    </div>
                  </div>

                  {/* Date range filter */}
                  <div>
                    <label className="text-sm font-medium">Date Range</label>
                    <div className="flex gap-2 mt-1">
                      <Input type="date" className="text-sm" />
                      <Input type="date" className="text-sm" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" size="sm">Reset</Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      <Table>
        <TableCaption>Previous quotes for this project.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Quote Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Revision</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Estimator</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredQuotes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                No quotes found for this project.
              </TableCell>
            </TableRow>
          ) : (
            filteredQuotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">{quote.quoteNumber}</TableCell>
                <TableCell>{quote.date}</TableCell>
                <TableCell>Rev {quote.revision}</TableCell>
                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                <TableCell>{quote.estimator}</TableCell>
                <TableCell>
                  {quote.totalValue.toLocaleString('en-AU', { 
                    style: 'currency', 
                    currency: quote.currency 
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewQuote(quote)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadQuote(quote)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Tag className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tag Quote</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleTagQuote(quote, "Final")}>
                          Final
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTagQuote(quote, "Client Approved")}>
                          Client Approved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTagQuote(quote, "For Review")}>
                          For Review
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTagQuote(quote, "Superseded")}>
                          Superseded
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Quote Preview Dialog */}
      <Dialog open={showQuotePreview} onOpenChange={setShowQuotePreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Quote Preview: {selectedQuote?.quoteNumber}</DialogTitle>
            <DialogDescription>
              {selectedQuote ? `Revision ${selectedQuote.revision} - ${selectedQuote.status}` : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-md p-6 bg-gray-50 min-h-[400px] flex items-center justify-center">
            <p className="text-gray-500">Quote preview would appear here.</p>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setShowQuotePreview(false)}>
              Close
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => handleDownloadQuote(selectedQuote)}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button>
                Open Full View
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreviousQuotesTab;
