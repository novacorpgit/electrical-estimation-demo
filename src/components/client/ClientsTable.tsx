
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock client data type
export type Client = {
  id: string;
  companyName: string;
  clientType: string;
  address: string;
  status: string;
  salesRep: string;
  lastActivityDate: string;
  tags: string[];
};

interface ClientsTableProps {
  clients: Client[];
  selectedClients: string[];
  onSelectClient: (clientId: string) => void;
  onSelectAll: () => void;
}

export const ClientsTable = ({
  clients,
  selectedClients,
  onSelectClient,
  onSelectAll,
}: ClientsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "Suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]">
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={selectedClients.length === clients.length && clients.length > 0} 
                onCheckedChange={onSelectAll}
              />
              <span>ID</span>
            </div>
          </TableHead>
          <TableHead>Company Name</TableHead>
          <TableHead>Client Type</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Sales Rep</TableHead>
          <TableHead>Last Activity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
              No clients found.
            </TableCell>
          </TableRow>
        ) : (
          clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => onSelectClient(client.id)}
                  />
                  <span>{client.id}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{client.companyName}</TableCell>
              <TableCell>{client.clientType}</TableCell>
              <TableCell>{client.address}</TableCell>
              <TableCell>{client.salesRep}</TableCell>
              <TableCell>{client.lastActivityDate}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Projects</Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
