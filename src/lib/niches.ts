import type { InspectionNiche } from "./types";

export type NicheTemplate = {
  id: InspectionNiche;
  label: string;
  description: string;
  categories: string[];
};

export const inspectionNiches: NicheTemplate[] = [
  {
    id: "apartment_turnover",
    label: "Apartment turnover",
    description: "Move-out / make-ready — walls, fixtures, stains, trash, flooring.",
    categories: [
      "Wall damage",
      "Trash / debris",
      "Stains",
      "Broken fixtures",
      "Flooring",
      "Cleanliness",
      "Appliances",
    ],
  },
  {
    id: "equipment_inspection",
    label: "Equipment inspection",
    description: "Conveyors, dock doors, forklifts, compressors — visual condition check.",
    categories: [
      "Wear / damage",
      "Leaks",
      "Guards / safety",
      "Housekeeping",
      "Labels / signage",
    ],
  },
  {
    id: "roof_inspection",
    label: "Roof inspection",
    description: "Exterior roof — shingles, flashing, gutters, visible damage.",
    categories: [
      "Shingles / membrane",
      "Flashing",
      "Gutters / drainage",
      "Penetrations",
      "Structural visible issues",
    ],
  },
  {
    id: "vehicle_inspection",
    label: "Vehicle inspection",
    description: "Fleet / work vehicles — body, tires, lights, interior condition.",
    categories: [
      "Exterior damage",
      "Tires / wheels",
      "Lights / glass",
      "Interior",
      "Fluid leaks visible",
    ],
  },
];

export function getNiche(id: InspectionNiche) {
  return inspectionNiches.find((n) => n.id === id);
}

export const nicheLabel: Record<InspectionNiche, string> = {
  apartment_turnover: "Apartment turnover",
  equipment_inspection: "Equipment inspection",
  roof_inspection: "Roof inspection",
  vehicle_inspection: "Vehicle inspection",
};
