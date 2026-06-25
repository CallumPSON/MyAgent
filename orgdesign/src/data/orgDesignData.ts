import type {
  ValueDimension, DimensionScore, OrgNode, RoleProfile,
  CareerStep, OrgArchetypeTemplate
} from '../types';

export const VALUE_DIMENSIONS: ValueDimension[] = [
  {
    id: 'resource',
    name: 'Resource Model',
    icon: 'Users',
    traditionalLabel: 'Category-Locked',
    valueArchitectLabel: 'Dynamically Allocated',
    traditional:
      'Resources are assigned to fixed category silos with limited ability to flex. Governance and budgeting processes are not aligned to enable fluid resource allocation. Spend is managed within vertical category boundaries.',
    valueArchitect:
      'Dynamic resource allocation based on market conditions and customer need. Rolling, outcome-based budgets and funding that flex with strategic priorities. People move where value can be created, not where categories are defined.',
  },
  {
    id: 'talent',
    name: 'Talent Model',
    icon: 'GraduationCap',
    traditionalLabel: 'Vertical Specialists',
    valueArchitectLabel: 'Multiskilled Value Architects',
    traditional:
      'Specialist category skills with rigid vertical career paths. Expertise is deep but narrow. Movement between categories is rare and structurally discouraged. Career progression is linear within a category tower.',
    valueArchitect:
      'Fluid movement of multiskilled experts with flexible, portfolio career paths. Procurement operates as a "university" — people rotate across categories, building breadth. Real-time, highly relevant supply insights are the norm across all areas of spend.',
  },
  {
    id: 'structure',
    name: 'Structure & Innovation',
    icon: 'Layers',
    traditionalLabel: 'Hierarchical Silos',
    valueArchitectLabel: 'Agile & Innovation-Led',
    traditional:
      'Multilayered hierarchical structure with separate functional pillars. Innovation is treated as a separate workstream or team rather than embedded in day-to-day delivery. Performance is measured on process compliance and cost targets.',
    valueArchitect:
      'Agile organisation built on transferable commercial skills: business partnering, contracting, commercial strategy. Innovation is at the core of every value stream. Impact on P&L and revenue is measured at both functional and individual level.',
  },
  {
    id: 'technology',
    name: 'Technology & AI',
    icon: 'Cpu',
    traditionalLabel: 'Fragmented Systems',
    valueArchitectLabel: 'AI-Augmented & Integrated',
    traditional:
      'Fragmented systems and data cause category managers to navigate multiple disconnected tools. AI may be available in pockets but is not systematically embedded or leveraged. Data sits in silos, limiting insight generation.',
    valueArchitect:
      'An integrated toolset fully embedded across teams and all value streams. AI augments humans at every stage of the procurement lifecycle — from market intelligence to contract analysis — delivering compounding value and freeing time for strategic work.',
  },
];

export const DEFAULT_SCORES: DimensionScore[] = VALUE_DIMENSIONS.map(d => ({
  dimensionId: d.id,
  asIs: 2,
  toBe: 4,
  narrative: '',
}));

// ─── Org node templates ──────────────────────────────────────────────────────

const LIQUID_LATTICE_AS_IS: OrgNode[] = [
  { id: 'll-cpo', title: 'Chief Procurement Officer', roleType: 'Strategy', fte: 1, parentId: null },
  { id: 'll-cat-it', title: 'Category Director — IT', roleType: 'Operations', fte: 1, parentId: 'll-cpo' },
  { id: 'll-cat-ind', title: 'Category Director — Indirect', roleType: 'Operations', fte: 1, parentId: 'll-cpo' },
  { id: 'll-cat-dir', title: 'Category Director — Direct', roleType: 'Operations', fte: 1, parentId: 'll-cpo' },
  { id: 'll-mgr-it1', title: 'Category Manager — SW & Cloud', roleType: 'Operations', fte: 2, parentId: 'll-cat-it' },
  { id: 'll-mgr-it2', title: 'Category Manager — HW & Infra', roleType: 'Operations', fte: 2, parentId: 'll-cat-it' },
  { id: 'll-mgr-ind1', title: 'Category Manager — MRO', roleType: 'Operations', fte: 2, parentId: 'll-cat-ind' },
  { id: 'll-mgr-ind2', title: 'Category Manager — Professional Services', roleType: 'Operations', fte: 2, parentId: 'll-cat-ind' },
  { id: 'll-mgr-dir1', title: 'Category Manager — Raw Materials', roleType: 'Operations', fte: 2, parentId: 'll-cat-dir' },
  { id: 'll-p2p', title: 'Head of P2P & Operations', roleType: 'Operations', fte: 1, parentId: 'll-cpo' },
];

const LIQUID_LATTICE_TO_BE: OrgNode[] = [
  { id: 'll-cpo', title: 'Chief Procurement Officer', roleType: 'Strategy', fte: 1, parentId: null },
  { id: 'll-coe', title: 'CoE & Strategy Lead', roleType: 'CoE', fte: 1, parentId: 'll-cpo', isNew: true, streamId: 'coe' },
  { id: 'll-insights', title: 'Market Intelligence & Analytics', roleType: 'CoE', fte: 2, parentId: 'll-coe', isNew: true, streamId: 'coe' },
  { id: 'll-va1', title: 'Value Architect — Technology', roleType: 'ValueArchitect', fte: 3, parentId: 'll-cpo', isNew: true, streamId: 'vs1' },
  { id: 'll-va2', title: 'Value Architect — Indirect Spend', roleType: 'ValueArchitect', fte: 3, parentId: 'll-cpo', isNew: true, streamId: 'vs2' },
  { id: 'll-va3', title: 'Value Architect — Direct Materials', roleType: 'ValueArchitect', fte: 3, parentId: 'll-cpo', isNew: true, streamId: 'vs3' },
  { id: 'll-bp1', title: 'Business Partner — Sales & Marketing', roleType: 'BusinessPartner', fte: 1, parentId: 'll-cpo', isNew: true, streamId: 'bp' },
  { id: 'll-bp2', title: 'Business Partner — Operations', roleType: 'BusinessPartner', fte: 1, parentId: 'll-cpo', isNew: true, streamId: 'bp' },
  { id: 'll-ops', title: 'P2P & Transactional Operations', roleType: 'Operations', fte: 3, parentId: 'll-cpo', streamId: 'ops' },
];

const HELIX_AS_IS: OrgNode[] = [
  { id: 'hx-cpo', title: 'Chief Procurement Officer', roleType: 'Strategy', fte: 1, parentId: null },
  { id: 'hx-dir1', title: 'Procurement Director', roleType: 'Operations', fte: 1, parentId: 'hx-cpo' },
  { id: 'hx-dir2', title: 'Procurement Director', roleType: 'Operations', fte: 1, parentId: 'hx-cpo' },
  { id: 'hx-mgr1', title: 'Senior Category Manager', roleType: 'Operations', fte: 2, parentId: 'hx-dir1' },
  { id: 'hx-mgr2', title: 'Senior Category Manager', roleType: 'Operations', fte: 2, parentId: 'hx-dir1' },
  { id: 'hx-mgr3', title: 'Category Manager', roleType: 'Operations', fte: 3, parentId: 'hx-dir2' },
  { id: 'hx-ops', title: 'Operations & P2P Manager', roleType: 'Operations', fte: 2, parentId: 'hx-cpo' },
];

const HELIX_TO_BE: OrgNode[] = [
  { id: 'hx-cpo', title: 'Chief Procurement Officer', roleType: 'Strategy', fte: 1, parentId: null },
  // Functional Excellence arm
  { id: 'hx-fe-head', title: 'Head of Functional Excellence', roleType: 'CoE', fte: 1, parentId: 'hx-cpo', isNew: true, streamId: 'functional' },
  { id: 'hx-fe-cap', title: 'Capability & Learning Lead', roleType: 'CoE', fte: 1, parentId: 'hx-fe-head', isNew: true, streamId: 'functional' },
  { id: 'hx-fe-ins', title: 'Insights & Analytics Lead', roleType: 'CoE', fte: 2, parentId: 'hx-fe-head', isNew: true, streamId: 'functional' },
  { id: 'hx-fe-tech', title: 'Technology & Tools Lead', roleType: 'CoE', fte: 1, parentId: 'hx-fe-head', isNew: true, streamId: 'functional' },
  // Value Delivery arm
  { id: 'hx-vd-head', title: 'Head of Value Delivery', roleType: 'Strategy', fte: 1, parentId: 'hx-cpo', isNew: true, streamId: 'delivery' },
  { id: 'hx-va1', title: 'Value Architect — Technology', roleType: 'ValueArchitect', fte: 3, parentId: 'hx-vd-head', isNew: true, streamId: 'delivery' },
  { id: 'hx-va2', title: 'Value Architect — Indirect', roleType: 'ValueArchitect', fte: 3, parentId: 'hx-vd-head', isNew: true, streamId: 'delivery' },
  { id: 'hx-va3', title: 'Value Architect — Direct', roleType: 'ValueArchitect', fte: 3, parentId: 'hx-vd-head', isNew: true, streamId: 'delivery' },
  { id: 'hx-bp', title: 'Business Partner Pool', roleType: 'BusinessPartner', fte: 4, parentId: 'hx-vd-head', isNew: true, streamId: 'delivery' },
  { id: 'hx-ops', title: 'P2P & Operations', roleType: 'Operations', fte: 3, parentId: 'hx-cpo', streamId: 'ops' },
];

const FLAT_AS_IS: OrgNode[] = [
  { id: 'fl-cpo', title: 'Chief Procurement Officer', roleType: 'Strategy', fte: 1, parentId: null },
  { id: 'fl-dir-strat', title: 'Director of Category Strategy', roleType: 'Strategy', fte: 1, parentId: 'fl-cpo' },
  { id: 'fl-dir-ops', title: 'Director of Procurement Ops', roleType: 'Operations', fte: 1, parentId: 'fl-cpo' },
  { id: 'fl-dir-it', title: 'Category Director — IT', roleType: 'Operations', fte: 1, parentId: 'fl-cpo' },
  { id: 'fl-mgr1', title: 'Senior Category Manager', roleType: 'Operations', fte: 2, parentId: 'fl-dir-it' },
  { id: 'fl-mgr2', title: 'Category Manager', roleType: 'Operations', fte: 2, parentId: 'fl-dir-it' },
  { id: 'fl-mgr3', title: 'Category Manager', roleType: 'Operations', fte: 2, parentId: 'fl-dir-strat' },
  { id: 'fl-analyst', title: 'Procurement Analyst', roleType: 'Operations', fte: 3, parentId: 'fl-dir-ops' },
  { id: 'fl-buyer', title: 'Buyer', roleType: 'Operations', fte: 4, parentId: 'fl-dir-ops' },
];

const FLAT_TO_BE: OrgNode[] = [
  { id: 'fl-cpo', title: 'Chief Procurement Officer', roleType: 'Strategy', fte: 1, parentId: null },
  { id: 'fl-coe', title: 'CoE Lead & Market Intelligence', roleType: 'CoE', fte: 2, parentId: 'fl-cpo', isNew: true },
  { id: 'fl-va1', title: 'Value Architect — Technology', roleType: 'ValueArchitect', fte: 3, parentId: 'fl-cpo', isNew: true },
  { id: 'fl-va2', title: 'Value Architect — Indirect', roleType: 'ValueArchitect', fte: 3, parentId: 'fl-cpo', isNew: true },
  { id: 'fl-va3', title: 'Value Architect — Direct', roleType: 'ValueArchitect', fte: 3, parentId: 'fl-cpo', isNew: true },
  { id: 'fl-bp', title: 'Business Partner Lead', roleType: 'BusinessPartner', fte: 3, parentId: 'fl-cpo', isNew: true },
  { id: 'fl-ops', title: 'P2P & Operations', roleType: 'Operations', fte: 3, parentId: 'fl-cpo' },
];

export const ARCHETYPE_TEMPLATES: OrgArchetypeTemplate[] = [
  { archetype: 'liquid-lattice', asIsNodes: LIQUID_LATTICE_AS_IS, toBeNodes: LIQUID_LATTICE_TO_BE },
  { archetype: 'helix', asIsNodes: HELIX_AS_IS, toBeNodes: HELIX_TO_BE },
  { archetype: 'middle-managerless', asIsNodes: FLAT_AS_IS, toBeNodes: FLAT_TO_BE },
];

// ─── Role profiles ────────────────────────────────────────────────────────────

export const DEFAULT_ROLE_PROFILES: RoleProfile[] = [
  {
    id: 'rp-cpo',
    title: 'Chief Procurement Officer',
    roleType: 'Strategy',
    purpose: 'Lead the transformation of procurement from a process function to a value-creation engine, driving measurable commercial impact across the enterprise.',
    accountabilities: [
      'Set the strategic vision and operating model for the procurement function',
      'Sponsor and govern the Value Architect transformation programme',
      'Own the procurement P&L contribution and revenue impact metrics',
      'Build and sustain senior stakeholder relationships across the C-suite',
      'Ensure the function attracts, develops, and retains world-class commercial talent',
    ],
    skills: ['Commercial Strategy', 'Executive Stakeholder Management', 'Organisational Design', 'P&L Ownership', 'Change Leadership'],
    fte: 1,
  },
  {
    id: 'rp-va',
    title: 'Value Architect',
    roleType: 'ValueArchitect',
    purpose: 'Act as the primary commercial driver for a portfolio of spend, deploying deep market insight and creative commercial thinking to unlock incremental value for the business — beyond cost reduction.',
    accountabilities: [
      'Design and execute category strategies that create measurable value beyond cost reduction',
      'Build deep supplier and market insight to inform commercial decisions in real time',
      'Partner with business stakeholders to co-create value-driving sourcing strategies',
      'Lead complex commercial negotiations with a value — not just price — mindset',
      'Identify and pursue innovation opportunities within the supply base',
      'Mentor and develop junior Value Architects rotating into the category',
    ],
    skills: ['Commercial Strategy', 'Supply Market Insights', 'Business Partnering', 'Contracting & Negotiation', 'Data & Analytics', 'Stakeholder Management'],
    fte: 3,
  },
  {
    id: 'rp-bp',
    title: 'Business Partner',
    roleType: 'BusinessPartner',
    purpose: 'Embed procurement thinking at the heart of business decisions, translating commercial strategy into business-unit-relevant outcomes and ensuring procurement is a trusted advisor to the enterprise.',
    accountabilities: [
      'Serve as the primary interface between procurement and assigned business units',
      'Translate business strategy into procurement requirements and category priorities',
      'Influence budget-holders to leverage procurement capability effectively',
      'Advocate for procurement\'s role in revenue growth and innovation — not just cost',
      'Manage stakeholder expectations and communicate value delivered clearly',
    ],
    skills: ['Business Partnering', 'Stakeholder Management', 'Commercial Strategy', 'Influencing Skills', 'Value Communication'],
    fte: 2,
  },
  {
    id: 'rp-coe',
    title: 'CoE & Strategy Lead',
    roleType: 'CoE',
    purpose: 'Provide the intellectual backbone of the procurement function — setting standards, building capability, generating market intelligence, and ensuring the function continuously learns and improves.',
    accountabilities: [
      'Develop and maintain the Procurement Centre of Excellence framework and standards',
      'Generate and distribute real-time supply market intelligence across all value streams',
      'Design and run the capability development programme (the "procurement university")',
      'Own procurement technology and data strategy, including AI tool adoption',
      'Measure and communicate the function\'s value contribution to senior leadership',
    ],
    skills: ['Market Intelligence', 'Capability Building', 'Data & Analytics', 'Technology Strategy', 'Organisational Learning'],
    fte: 2,
  },
  {
    id: 'rp-ops',
    title: 'P2P & Operations Lead',
    roleType: 'Operations',
    purpose: 'Ensure smooth, efficient, and compliant transactional procurement operations — freeing Value Architects to focus on strategic value creation by owning the operational engine.',
    accountabilities: [
      'Own the purchase-to-pay process end-to-end, driving efficiency and compliance',
      'Manage supplier onboarding, vendor master, and contract repository',
      'Deliver operational procurement KPIs (PO cycle time, invoice accuracy, compliance rate)',
      'Identify and implement process automation opportunities across the P2P cycle',
      'Provide timely data and reporting to support strategic decision-making',
    ],
    skills: ['P2P Process Management', 'Process Improvement', 'Systems & Tools', 'Data Reporting', 'Compliance Management'],
    fte: 3,
  },
  {
    id: 'rp-insights',
    title: 'Market Intelligence & Analytics Lead',
    roleType: 'CoE',
    purpose: 'Ensure every Value Architect has access to the best supply market intelligence and data available — turning external insight into commercial advantage for the business.',
    accountabilities: [
      'Design and run an always-on supply market monitoring capability',
      'Synthesise external market signals into actionable commercial intelligence',
      'Build procurement analytics dashboards that surface value contribution in real time',
      'Embed AI tools into the insights workflow to scale and accelerate intelligence generation',
      'Support Value Architects with data-driven category strategy development',
    ],
    skills: ['Supply Market Insights', 'Data & Analytics', 'AI & Technology', 'Commercial Strategy', 'Research & Synthesis'],
    fte: 2,
  },
];

// ─── Career pathway example ───────────────────────────────────────────────────

export const SAMPLE_CAREER_PATH: CareerStep[] = [
  { roleTitle: 'Procurement Analyst', category: 'Indirect (MRO)', duration: '18 months' },
  { roleTitle: 'Junior Value Architect', category: 'IT & Technology', duration: '18 months' },
  { roleTitle: 'Value Architect', category: 'Direct Materials', duration: '24 months' },
  { roleTitle: 'Senior Value Architect', category: 'Professional Services', duration: '24 months' },
  { roleTitle: 'Business Partner', category: 'Sales & Operations BU', duration: '18 months' },
  { roleTitle: 'Value Architect Lead', category: 'Multi-category portfolio', duration: 'Ongoing' },
];

// ─── All transferable skills ──────────────────────────────────────────────────

export const ALL_SKILLS = [
  'Commercial Strategy',
  'Supply Market Insights',
  'Business Partnering',
  'Contracting & Negotiation',
  'Data & Analytics',
  'Stakeholder Management',
  'P&L Ownership',
  'AI & Technology',
  'Market Intelligence',
  'Capability Building',
  'Process Improvement',
  'Value Communication',
];
