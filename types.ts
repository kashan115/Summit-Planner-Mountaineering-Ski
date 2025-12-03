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
  logistics: {
    permits: string;
    parking: string;
    nearestTown: string;
  };
  emergency: {
    nearestHospital: string;
    rangerStation: string;
    emergencyPhone: string;
  };
  gearList: GearCategory[];
  betaLinks: LinkResource[]; // Specific useful links found by the AI
  groundingSources: LinkResource[]; // Sources used to generate the response
}

export interface PlanRequest {
  destination: string;
  activity: ActivityType;
  details: string;
}