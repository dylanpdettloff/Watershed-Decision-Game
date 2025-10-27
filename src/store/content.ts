export type RoleKey = 'NYCDEP' | 'TOWN' | 'FARMER' | 'NGO';

export const roles: { key: RoleKey; name: string; blurb: string }[] = [
  { key: 'NYCDEP', name: 'NYCDEP Official', blurb: 'Responsible for drinking water quality and compliance.' },
  { key: 'TOWN',   name: 'Watershed Town Supervisor', blurb: 'Balances livelihoods, tax base, and land use.' },
  { key: 'FARMER', name: 'Farmer', blurb: 'Implements BMPs while keeping the farm viable.' },
  { key: 'NGO',    name: 'Environmental NGO', blurb: 'Advocates for ecosystems and long-term sustainability.' },
];

export const roleTaglines: Record<RoleKey, string> = {
  NYCDEP: 'Drinking water first, at scale.',
  TOWN:   'Livability, tax base, and place.',
  FARMER: 'Soil, stock, and solvency.',
  NGO:    'Ecosystems and accountability.',
};

export const roleMultipliers: Record<RoleKey, Partial<{ water:number; equity:number; cost:number }>> = {
  NYCDEP: { water: 1.15, equity: 1.0,  cost: 0.95 },
  TOWN:   { water: 1.0,  equity: 1.15, cost: 1.0  },
  FARMER: { water: 1.05, equity: 1.10, cost: 1.0  },
  NGO:    { water: 1.10, equity: 1.10, cost: 1.0  },
};

export type Option = {
  id: string;
  label: string;
  consequence: string;
  delta: Partial<{ water: number; equity: number; cost: number }>;
  roles?: RoleKey[]; // show only for these roles (omit = all)
};

export type Scenario = {
  id: string;
  act: 0 | 1; // 0=Intro/successes, 1=Challenges
  title: string;
  prompt: string;
  options: Option[];
};

export type Strategy = {
  id: string;
  title: string;
  summary: string;
  delta: Partial<{ water: number; equity: number; cost: number }>;
  roles?: RoleKey[]; // available only for these roles (omit = all)
};

export const scenariosByAct: Scenario[][] = [
  // Act I — successes
  [
    {
      id: 'intro-land-acquisition',
      act: 0,
      title: 'Land Acquisition Program',
      prompt: 'Conservation easements protected sensitive lands. How do you frame expansion today?',
      options: [
        {
          id: 'lac-voluntary-incentives',
          label: 'Expand voluntary easements with higher incentives',
          consequence: 'Protects buffers; increases upfront program cost; improves local buy-in.',
          delta: { water: +8, equity: +6, cost: -5 },
          roles: ['NYCDEP','NGO','TOWN'],
        },
        {
          id: 'lac-targeted-priority',
          label: 'Target only high-priority parcels',
          consequence: 'Efficient protection per dollar; narrower geographic equity.',
          delta: { water: +6, equity: -2, cost: +3 },
          // all roles can see
        },
        {
          id: 'lac-farm-pilots',
          label: 'Pilot farm-friendly easements (grazing + riparian buffers)',
          consequence: 'Protects water while keeping farm operations viable; needs tailored contracts.',
          delta: { water: +6, equity: +5, cost: -3 },
          roles: ['FARMER','TOWN'],
        },
      ],
    },
    {
      id: 'intro-cwc-governance',
      act: 0,
      title: 'Local Governance via CWC',
      prompt: 'CWC channels local voice. Choose a tweak to strengthen legitimacy and delivery.',
      options: [
        {
          id: 'cwc-add-youth-rep',
          label: 'Add youth & farmworker advisory seats',
          consequence: 'Broadens representation; may lengthen deliberation.',
          delta: { equity: +8, water: +2, cost: -2 },
          roles: ['TOWN','NGO'],
        },
        {
          id: 'cwc-streamline-grants',
          label: 'Streamline small grants for BMPs',
          consequence: 'Faster BMP uptake; requires admin upgrades.',
          delta: { water: +5, equity: +3, cost: -3 },
        },
        {
          id: 'cwc-compliance-liaison',
          label: 'Create a DEP–CWC compliance liaison desk',
          consequence: 'Reduces friction on permits; requires new staffing.',
          delta: { equity: +3, water: +3, cost: -2 },
          roles: ['NYCDEP','TOWN'],
        },
      ],
    },
  ],
  // Act II — challenges
  [
    {
      id: 'challenge-turbidity',
      act: 1,
      title: 'Climate-Driven Turbidity Spike',
      prompt: 'A storm triggers turbidity in Schoharie. Pick your immediate response priority.',
      options: [
        {
          id: 'turbidity-adaptive-ops',
          label: 'Adaptive reservoir ops & monitoring surge',
          consequence: 'Protects delivered quality; ops complexity & staffing costs rise.',
          delta: { water: +9, cost: -4 },
          roles: ['NYCDEP'],
        },
        {
          id: 'turbidity-public-comm',
          label: 'Transparent comms & precautionary advisories',
          consequence: 'Builds trust and equity; indirect economic costs to households.',
          delta: { equity: +6, cost: -3, water: +2 },
        },
        {
          id: 'turbidity-onfarm-bmps',
          label: 'Rapid on-farm BMP deployment (sacrifice paddocks, cover crops)',
          consequence: 'Cuts sediment pulses; coordination burden for farms.',
          delta: { water: +6, equity: +2, cost: -3 },
          roles: ['FARMER','NGO'],
        },
      ],
    },
    {
      id: 'challenge-growth',
      act: 1,
      title: 'Population Growth Pressure',
      prompt: 'New subdivisions increase impervious cover. Choose a near-term lever.',
      options: [
        {
          id: 'growth-gi-requirements',
          label: 'Require green infrastructure in new builds',
          consequence: 'Reduces runoff; higher developer costs now, lower muni costs later.',
          delta: { water: +7, cost: -2, equity: +2 },
          roles: ['TOWN','NGO','NYCDEP'],
        },
        {
          id: 'growth-transfer-dev-rights',
          label: 'Implement transfer of development rights (TDR)',
          consequence: 'Concentrates growth away from sensitive areas; complex to administer.',
          delta: { water: +5, equity: +3, cost: -2 },
        },
        {
          id: 'growth-tap-fee-offsets',
          label: 'Tap fee offsets for GI + infill near hamlet cores',
          consequence: 'Steers growth away from sensitive lands with incentives.',
          delta: { water: +5, equity: +3, cost: -1 },
          roles: ['TOWN'],
        },
      ],
    },
  ],
];

export const strategies: Strategy[] = [
  { id: 'strat-gi-retrofits',     title: 'Watershed GI Retrofits',             summary: 'Retrofit GI in hamlets.',                                  delta: { water: +7, equity: +2, cost: -3 } },
  { id: 'strat-bmp-incentives',   title: 'Performance-Based BMP Incentives',   summary: 'Tiered payments for reductions.',                        delta: { water: +6, equity: +4, cost: -4 }, roles: ['FARMER','TOWN'] },
  { id: 'strat-co-management',    title: 'City–Town Co-Management Council',    summary: 'Formalize joint decisions.',                             delta: { equity: +8, water: +2, cost: -3 }, roles: ['NYCDEP','TOWN'] },
  { id: 'strat-smart-permitting', title: 'Adaptive Permitting & Monitoring',   summary: 'Trigger-based permits & signals.',                       delta: { water: +5, cost: -2 },             roles: ['NYCDEP','NGO'] },
  { id: 'strat-rate-design',      title: 'Equitable Rate Design & Assistance', summary: 'Affordability + conservation pricing.',                  delta: { equity: +6, cost: -2 },            roles: ['NYCDEP','TOWN'] },
];