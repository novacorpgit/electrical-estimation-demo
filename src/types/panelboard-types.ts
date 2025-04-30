// Core Entity Types

export interface Project {
  id: string;
  clientId: string;
  projectName: string;
  state: string; // B, P, S, M, T
  estimatorId?: string;
  estimatorHours?: number; // Added field for estimator hours
  notes?: string;
  poNumber?: string;
  files?: string[];
  address: string;
  classification?: 'Tender' | 'Direct' | 'Repeat';
  startDate?: string;
  priority?: 'Normal' | 'High' | 'Critical';
  status: 'Draft' | 'In Progress' | 'Completed' | 'On Hold';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubProject {
  id: string;
  projectId: string;
  name: string;
  quantity: number;
  customLabels?: string[];
  panelType: string; // DB, MSB, Control, etc.
  formType: string; // Form 1, 2, 3B, etc.
  installationType: 'Indoor' | 'Outdoor';
  tiers?: number;
  boardRating: number; // in Amps
  ipRating: string;
  shortCircuitRating: number; // in kA
  poleCapacity?: number;
  switchboardName?: string;
  linkedBomTemplate?: string;
  linkedLayoutTemplate?: string;
  status: 'Draft' | 'In Progress' | 'Completed';
  notes?: string;
  files?: string[];
}

export interface Client {
  id: string;
  companyName: string;
  clientType: string; // Contractor, Consultant, Government, etc.
  tags?: string[]; // Healthcare, Hospitality, etc.
  address: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  preferredCurrency?: string;
  preferredPricingTier?: string;
  priorityLevel?: 'Normal' | 'High' | 'Strategic';
  salesRepId?: string;
  notes?: string;
  attachments?: string[];
  createdDate: string;
  lastActivityDate?: string;
  contacts?: ClientContact[];
}

export interface ClientContact {
  id: string;
  clientId: string;
  name: string;
  designation?: string;
  email: string;
  phone?: string;
  preferredCommunication?: string;
  doNotContact?: boolean;
}

export interface BOMItem {
  id: string;
  quoteId: string;
  itemCode: string;
  itemName: string;
  partNumber?: string;
  manufacturer?: string;
  supplierId: string;
  supplierSKU?: string;
  category: string;
  subcategory?: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  currency: string;
  laborMinutes: number;
  totalLaborTime: number;
  installationType?: 'Indoor' | 'Outdoor';
  ratedCurrent?: number; // in Amps
  numberOfPoles?: number;
  ipRating?: string;
  breakingCapacity?: number; // in kA
  mountingType?: string;
  wattLoss?: number;
  weight?: number;
  bomFlag: boolean;
  designEnabled: boolean;
  stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock';
  leadTime?: number; // in days
  remarks?: string;
  includedInOffer: boolean;
  customLaborRate?: number;
}

export interface Quote {
  id: string;
  subProjectId: string;
  quoteNumber: string;
  status: 'Draft' | 'Approved' | 'Rejected';
  margin: number;
  marginType: 'Markup' | 'Margin';
  currency: string;
  fxRate: number;
  subtotalMaterials: number;
  subtotalLabor: number;
  additionalCosts?: number;
  discount?: number;
  finalQuotedValue: number;
  options?: QuoteOption[];
  approvalStatus: 'Draft' | 'Approved' | 'Rejected';
  includedInOffer: boolean;
  offerExpiryDate?: string;
  sentDate?: string;
}

export interface QuoteOption {
  id: string;
  quoteId: string;
  name: string;
  description?: string;
  additionalCost: number;
  selected: boolean;
}

// Layout Related Types

export interface ComponentLayout {
  subProjectId: string;
  components: LayoutComponent[];
  version: string;
  createdAt: string;
  notes?: string;
}

export interface LayoutComponent {
  id: string;
  bomItemId: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rotation: number;
  quantity: number;
  label: string;
}

// Template Related Types

export interface PanelTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  createdBy: string;
  items: TemplateItem[];
}

export interface TemplateItem {
  id: string;
  templateId: string;
  itemCode: string;
  defaultQuantity: number;
  positionData?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Utility Types

export interface CalculationFormula {
  id: string;
  name: string;
  expression: string;
  type: string;
  status: 'Active' | 'Inactive';
}

export interface Note {
  id: string;
  subProjectId: string;
  text: string;
  createdBy: string;
  createdAt: string;
  category?: 'Technical' | 'Internal' | 'Client Feedback';
  isInternal: boolean;
}

export interface Document {
  id: string;
  subProjectId: string;
  fileName: string;
  type: 'Drawing' | 'Spec' | 'Email' | 'Other';
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Estimator' | 'Sales Rep' | 'Project Manager' | 'Viewer';
  status: 'Active' | 'Inactive';
  initials: string;
}

// User Management Related Types

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  description: string;
}

export interface ExtendedUser extends User {
  roleId: string;
  roleName?: string;
  uniqueCode: string;
  workHoursPerWeek: number;
  department?: string;
  managerId?: string;
  contactNumber?: string;
  emergencyContact?: string;
  joinDate: string;
  holidays: Holiday[];
  leaveBalance: LeaveBalance;
  profilePicture?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  countryCode: string;
  isRecurring: boolean;
  type: 'National' | 'Religious' | 'Optional' | 'Corporate';
}

export interface LeaveRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  type: 'Annual' | 'Sick' | 'Personal' | 'Maternity' | 'Paternity' | 'Unpaid';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  reason?: string;
  approvedById?: string;
  createdAt: string;
  updatedAt: string;
  googleCalendarEventId?: string;
}

export interface LeaveBalance {
  annual: number;
  sick: number;
  personal: number;
  maternity: number;
  paternity: number;
  carried: number;
}

export interface WorkHoursLog {
  id: string;
  userId: string;
  projectId?: string;
  date: string;
  hours: number;
  description: string;
  status: 'Logged' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}
