
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ContactPerson = {
  name: string;
  designation: string;
  email: string;
  phone: string;
  preferredCommunication: string;
  doNotContact: boolean;
};

interface ContactPersonFormProps {
  person: ContactPerson;
  index: number;
  onChange: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export const ContactPersonForm = ({
  person,
  index,
  onChange,
  onRemove,
  canRemove,
}: ContactPersonFormProps) => {
  return (
    <div className="border p-4 rounded-md space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Contact Person {index + 1}</h4>
        {canRemove && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input
            placeholder="Enter full name"
            value={person.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            required={index === 0}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Designation</Label>
          <Input
            placeholder="e.g., Project Manager"
            value={person.designation}
            onChange={(e) => onChange(index, 'designation', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            placeholder="Enter email address"
            value={person.email}
            onChange={(e) => onChange(index, 'email', e.target.value)}
            required={index === 0}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            placeholder="Enter phone number"
            value={person.phone}
            onChange={(e) => onChange(index, 'phone', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Preferred Communication</Label>
          <Select
            value={person.preferredCommunication}
            onValueChange={(value) => onChange(index, 'preferredCommunication', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Phone">Phone</SelectItem>
              <SelectItem value="SMS">SMS</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 flex items-end gap-2">
          <Checkbox 
            id={`doNotContact-${index}`} 
            checked={person.doNotContact}
            onCheckedChange={(checked) => onChange(index, 'doNotContact', checked)}
          />
          <Label htmlFor={`doNotContact-${index}`}>Do Not Contact</Label>
        </div>
      </div>
    </div>
  );
};
