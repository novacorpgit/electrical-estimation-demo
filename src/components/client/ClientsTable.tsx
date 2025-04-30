
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="h-10 px-4 text-left">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={selectedClients.length === clients.length && clients.length > 0} 
                  onCheckedChange={onSelectAll}
                />
                <span>ID</span>
              </div>
            </th>
            <th className="h-10 px-4 text-left">Company Name</th>
            <th className="h-10 px-4 text-left">Client Type</th>
            <th className="h-10 px-4 text-left">Address</th>
            <th className="h-10 px-4 text-left">Sales Rep</th>
            <th className="h-10 px-4 text-left">Last Activity</th>
            <th className="h-10 px-4 text-left">Status</th>
            <th className="h-10 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan={8} className="h-24 text-center text-muted-foreground">
                No clients found.
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id} className="border-b hover:bg-muted/50">
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={() => onSelectClient(client.id)}
                    />
                    <span>{client.id}</span>
                  </div>
                </td>
                <td className="p-4 font-medium">{client.companyName}</td>
                <td className="p-4">{client.clientType}</td>
                <td className="p-4">{client.address}</td>
                <td className="p-4">{client.salesRep}</td>
                <td className="p-4">{client.lastActivityDate}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Projects</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
