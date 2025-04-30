
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtendedUser } from "@/types/panelboard-types";
import { v4 as uuidv4 } from "uuid";

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  roleId: z.string().min(1, "Role is required"),
  department: z.string().optional(),
  workHoursPerWeek: z.coerce.number().min(1).max(80),
  contactNumber: z.string().optional(),
  managerId: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  onSubmit: (user: ExtendedUser) => void;
  onCancel: () => void;
  initialData?: Partial<ExtendedUser>;
}

// Mock data - would be replaced with actual API calls
const roles = [
  { id: "1", name: "Admin" },
  { id: "2", name: "Estimator" },
  { id: "3", name: "Sales Rep" },
  { id: "4", name: "Project Manager" },
  { id: "5", name: "Viewer" },
];

const departments = [
  "Engineering",
  "Sales",
  "Production",
  "Finance",
  "Human Resources",
  "Management",
];

const managers = [
  { id: "1", name: "John Doe" },
  { id: "3", name: "Michael Wilson" },
];

export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
}) => {
  const generateUniqueCode = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    const prefix = role ? role.name.substring(0, 3).toUpperCase() : "USR";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      roleId: initialData.roleId || "",
      department: initialData.department || "",
      workHoursPerWeek: initialData.workHoursPerWeek || 40,
      contactNumber: initialData.contactNumber || "",
      managerId: initialData.managerId || "",
    },
  });

  const handleSubmit = (values: UserFormValues) => {
    const selectedRole = roles.find(r => r.id === values.roleId);
    
    const newUser: ExtendedUser = {
      ...values,
      id: initialData.id || uuidv4(),
      uniqueCode: initialData.uniqueCode || generateUniqueCode(values.roleId),
      roleName: selectedRole?.name,
      status: "Active",
      initials: values.name.split(" ").map((n) => n[0]).join(""),
      role: selectedRole?.name || "User",
      joinDate: initialData.joinDate || new Date().toISOString().split("T")[0],
      holidays: initialData.holidays || [],
      leaveBalance: initialData.leaveBalance || {
        annual: 20,
        sick: 10,
        personal: 3,
        maternity: 0,
        paternity: 0,
        carried: 0,
      },
    };

    onSubmit(newUser);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workHoursPerWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Hours Per Week</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="80" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="managerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manager</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save User</Button>
        </div>
      </form>
    </Form>
  );
};
