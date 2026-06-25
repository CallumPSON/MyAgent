export type OrgTab = 'framework' | 'assessment' | 'orgdesign' | 'roles';
export type OrgArchetype = 'liquid-lattice' | 'helix' | 'middle-managerless';
export type OrgView = 'as-is' | 'to-be';
export type RoleType = 'Strategy' | 'ValueArchitect' | 'BusinessPartner' | 'Operations' | 'CoE';

export interface ValueDimension {
  id: string;
  name: string;
  icon: string; // lucide icon name used as label
  traditional: string;
  valueArchitect: string;
  traditionalLabel: string;
  valueArchitectLabel: string;
}

export interface DimensionScore {
  dimensionId: string;
  asIs: number;  // 1–5
  toBe: number;  // 1–5
  narrative: string;
}

export interface OrgNode {
  id: string;
  title: string;
  roleType: RoleType;
  fte: number;
  parentId: string | null;
  location?: string;
  isNew?: boolean;
  isRemoved?: boolean;
  // used for lattice/helix positioning
  streamId?: string;
}

export interface RoleProfile {
  id: string;          // matches OrgNode.id
  title: string;
  roleType: RoleType;
  purpose: string;
  accountabilities: string[];
  skills: string[];
  fte: number;
}

export interface CareerStep {
  roleTitle: string;
  category: string;
  duration: string;
}

export interface OrgArchetypeTemplate {
  archetype: OrgArchetype;
  asIsNodes: OrgNode[];
  toBeNodes: OrgNode[];
}
