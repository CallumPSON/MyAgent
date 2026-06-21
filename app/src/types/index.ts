export type Page = 'dashboard' | 'spend' | 'opportunities' | 'initiatives';

export type Complexity = 'Low' | 'Medium' | 'High';
export type RAGStatus = 'Green' | 'Amber' | 'Red';
export type InitiativeStatus = 'Planning' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
export type OpportunityStatus = 'Identified' | 'Qualifying' | 'In Progress' | 'Realized' | 'Closed';
export type MilestoneStatus = 'Pending' | 'Complete' | 'Overdue';

export interface Opportunity {
  id: string;
  title: string;
  category: string;
  businessUnit: string;
  currentSpend: number;
  potentialSaving: number;
  savingPercent: number;
  complexity: Complexity;
  timeToRealize: string;
  status: OpportunityStatus;
  owner: string;
  description: string;
  createdDate: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: MilestoneStatus;
}

export interface SavingsMonth {
  month: string;
  target: number;
  actual: number;
}

export interface Initiative {
  id: string;
  name: string;
  category: string;
  businessUnit: string;
  owner: string;
  sponsor: string;
  targetSaving: number;
  actualSaving: number;
  status: InitiativeStatus;
  ragStatus: RAGStatus;
  startDate: string;
  endDate: string;
  description: string;
  milestones: Milestone[];
  savingsProfile: SavingsMonth[];
}

export interface SpendByCategory {
  category: string;
  amount: number;
  color: string;
}

export interface SpendByMonth {
  month: string;
  IT: number;
  ProfServices: number;
  Facilities: number;
  Marketing: number;
  Logistics: number;
  HR: number;
}

export interface Supplier {
  name: string;
  category: string;
  annualSpend: number;
  invoiceCount: number;
  country: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  contractExpiry: string;
}
