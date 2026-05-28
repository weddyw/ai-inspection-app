import type { InspectionNiche } from "./types";

export type InspectionTemplate = {
  id: InspectionNiche;
  label: string;
  description: string;
  /** What AI vision should look for — shown to user + sent in prompt */
  visionTargets: string[];
  categories: string[];
};

export const inspectionTemplates: InspectionTemplate[] = [
  {
    id: "apartment_turnover",
    label: "Apartment turnover",
    description: "Move-out / make-ready inspection for units between tenants.",
    visionTargets: [
      "Debris and trash left behind",
      "Water damage / stains / moisture marks",
      "Cracked or hole drywall",
      "Scuffs and holes in walls",
      "Broken fixtures (faucets, blinds, doors)",
      "Flooring damage or excessive wear",
      "Dirty appliances or cabinets",
      "Missing ceiling tiles",
      "Mold or mildew signs (visible only)",
    ],
    categories: [
      "Debris / trash",
      "Water damage",
      "Drywall damage",
      "Stains",
      "Broken fixtures",
      "Flooring",
      "Cleanliness",
      "Ceiling / tiles",
    ],
  },
  {
    id: "equipment_inspection",
    label: "Equipment inspection",
    description: "Visual check of conveyors, dock doors, forklifts, compressors, and plant equipment.",
    visionTargets: [
      "Rust and corrosion",
      "Oil or fluid leaks",
      "Missing or damaged guards",
      "Debris on or under equipment",
      "Worn belts, chains, or rollers",
      "Damaged labels or signage",
      "Housekeeping around equipment",
    ],
    categories: ["Rust", "Leaks", "Guards / safety", "Wear", "Debris", "Housekeeping"],
  },
  {
    id: "roof_inspection",
    label: "Roof inspection",
    description: "Exterior roof condition from ground or ladder photos.",
    visionTargets: [
      "Missing or damaged shingles",
      "Ponding water / debris on roof",
      "Damaged flashing",
      "Clogged or damaged gutters",
      "Visible penetrations or seal failures",
      "Sagging or visible structural concerns (note limits)",
    ],
    categories: [
      "Shingles / membrane",
      "Flashing",
      "Gutters / drainage",
      "Debris",
      "Penetrations",
    ],
  },
  {
    id: "vehicle_inspection",
    label: "Vehicle inspection",
    description: "Fleet and work vehicle condition documentation.",
    visionTargets: [
      "Body damage and dents",
      "Tire wear or damage",
      "Broken or cloudy lights / glass",
      "Interior damage or debris",
      "Visible fluid leaks under vehicle",
      "Missing mirrors or parts",
    ],
    categories: [
      "Exterior damage",
      "Tires",
      "Lights / glass",
      "Interior",
      "Leaks",
      "Debris",
    ],
  },
];

/** @deprecated use inspectionTemplates */
export const inspectionNiches = inspectionTemplates;

export function getTemplate(id: InspectionNiche) {
  return inspectionTemplates.find((t) => t.id === id);
}

export const nicheLabel: Record<InspectionNiche, string> = {
  apartment_turnover: "Apartment turnover",
  equipment_inspection: "Equipment inspection",
  roof_inspection: "Roof inspection",
  vehicle_inspection: "Vehicle inspection",
};
