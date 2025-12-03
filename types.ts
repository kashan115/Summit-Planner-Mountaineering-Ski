export type ActivityType = 'Mountaineering' | 'Alpine Climbing' | 'Rock Climbing' | 'Ski Touring' | 'Hiking' | 'Scrambling';

export interface GearItem {
  item: string;
  reason: string;
  checked?: boolean;
}

export interface GearCategory {
  categoryName: string;
  items: GearItem[];
}

export interface LinkResource {
  title: string;
  url: string;
  description?: string;
}

export interface ClimbPlan {
  destination: string;
  activity: string;
  summary: string;
  difficulty: string;
  routeInfo: {
    name: string;
    description: string;
    length: string;
    elevationGain: string;
    technicalNotes: string;
  };
  conditions: {
    weatherSummary: string;
    avalancheRisk: string;
    seasonality: string;
  };
  // New section for Smart Analysis
  decisionAid: {
    monthlyAnalysis: string;
    goNoGoCriteria: string[];
    criticalHazards: string[];
  };
  driving: {
    trailheadName: string;
    directions: string;
    passes: string;
  };
  logistics: {
    permits: string;
    nearestTown: string;
  };
  emergency: {
    nearestHospital: string;
    rangerStation: string;
    emergencyPhone: string;
  };
  gearList: GearCategory[];
  betaLinks: LinkResource[]; 
  groundingSources: LinkResource[];
}

export interface PlanRequest {
  destination: string;
  activity: ActivityType;
  month: string;
  details: string;
}