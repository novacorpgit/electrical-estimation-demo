
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ClientInfo = {
  companyName: string;
  clientType: string;
  address: string;
  tags: string[];
  status: string;
  preferredCurrency: string;
  preferredPricingTier: string;
  priorityLevel: string;
  salesRep: string;
  notes: string;
};

interface ClientInfoFormProps {
  formData: ClientInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export const ClientInfoForm = ({
  formData,
  onChange,
  onSelectChange,
}: ClientInfoFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Client Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Enter company name"
            value={formData.companyName}
            onChange={onChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientType">Client Type *</Label>
          <Select
            value={formData.clientType}
            onValueChange={(value) => onSelectChange("clientType", value)}
          >
            <SelectTrigger id="clientType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Contractor">Contractor</SelectItem>
              <SelectItem value="Consultant">Consultant</SelectItem>
              <SelectItem value="Developer">Developer</SelectItem>
              <SelectItem value="Government">Government</SelectItem>
              <SelectItem value="Industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            name="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={onChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => onSelectChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredCurrency">Preferred Currency</Label>
          <Select
            value={formData.preferredCurrency}
            onValueChange={(value) => onSelectChange("preferredCurrency", value)}
          >
            <SelectTrigger id="preferredCurrency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AUD">AUD</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="NZD">NZD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredPricingTier">Preferred Pricing Tier</Label>
          <Select
            value={formData.preferredPricingTier}
            onValueChange={(value) => onSelectChange("preferredPricingTier", value)}
          >
            <SelectTrigger id="preferredPricingTier">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="WS">Wholesale (WS)</SelectItem>
              <SelectItem value="WS+7">Wholesale +7% (WS+7)</SelectItem>
              <SelectItem value="Contractor">Contractor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priorityLevel">Priority Level</Label>
          <Select
            value={formData.priorityLevel}
            onValueChange={(value) => onSelectChange("priorityLevel", value)}
          >
            <SelectTrigger id="priorityLevel">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Strategic">Strategic Account</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salesRep">Assigned Sales Rep</Label>
          <Input
            id="salesRep"
            name="salesRep"
            placeholder="Enter sales rep name"
            value={formData.salesRep}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Client Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Enter any relationship notes, preferences, etc."
          value={formData.notes}
          onChange={onChange}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};
