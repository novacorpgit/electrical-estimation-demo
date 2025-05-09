
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

export interface ClientInfo {
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
}

interface ClientInfoFormProps {
  formData: ClientInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  salesReps?: Array<{ id: string; name: string }>;
}

export const ClientInfoForm: React.FC<ClientInfoFormProps> = ({ 
  formData, 
  onChange, 
  onSelectChange,
  salesReps = []
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input 
            id="companyName" 
            name="companyName" 
            value={formData.companyName}
            onChange={onChange}
            placeholder="Enter company name" 
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientType">Client Type</Label>
          <Select 
            value={formData.clientType} 
            onValueChange={(value) => onSelectChange('clientType', value)}
          >
            <SelectTrigger id="clientType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Contractor">Contractor</SelectItem>
              <SelectItem value="Consultant">Consultant</SelectItem>
              <SelectItem value="Government">Government</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Input 
            id="address" 
            name="address" 
            value={formData.address}
            onChange={onChange}
            placeholder="Enter address" 
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => onSelectChange('status', value)}
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
          <Label htmlFor="priorityLevel">Priority Level</Label>
          <Select 
            value={formData.priorityLevel} 
            onValueChange={(value) => onSelectChange('priorityLevel', value)}
          >
            <SelectTrigger id="priorityLevel">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Strategic">Strategic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredCurrency">Preferred Currency</Label>
          <Select 
            value={formData.preferredCurrency} 
            onValueChange={(value) => onSelectChange('preferredCurrency', value)}
          >
            <SelectTrigger id="preferredCurrency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AUD">AUD</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredPricingTier">Pricing Tier</Label>
          <Select 
            value={formData.preferredPricingTier} 
            onValueChange={(value) => onSelectChange('preferredPricingTier', value)}
          >
            <SelectTrigger id="preferredPricingTier">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salesRep">Sales Representative</Label>
          <Select 
            value={formData.salesRep} 
            onValueChange={(value) => onSelectChange('salesRep', value)}
          >
            <SelectTrigger id="salesRep">
              <SelectValue placeholder="Select sales rep" />
            </SelectTrigger>
            <SelectContent>
              {salesReps.map(rep => (
                <SelectItem key={rep.id} value={rep.id}>{rep.name}</SelectItem>
              ))}
              {salesReps.length === 0 && (
                <SelectItem value="" disabled>No sales reps available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            name="notes" 
            value={formData.notes}
            onChange={onChange}
            placeholder="Enter additional notes or comments" 
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};
