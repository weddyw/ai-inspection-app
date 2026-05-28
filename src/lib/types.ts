export type InspectionNiche =
  | "apartment_turnover"
  | "equipment_inspection"
  | "roof_inspection"
  | "vehicle_inspection";

export type Severity = "low" | "medium" | "high" | "critical";

export type TurnoverReady = "yes" | "no" | "conditional" | "n/a";

export type InspectionInput = {
  niche: InspectionNiche;
  propertyLabel: string;
  unitNotes: string;
  inspectorName: string;
};

export type InspectionIssue = {
  id: string;
  category: string;
  severity: Severity;
  location: string;
  description: string;
  recommendedAction: string;
  photoIndex?: number;
};

export type PhotoNote = {
  photoIndex: number;
  fileName: string;
  note: string;
};

export type UploadedPhoto = {
  id: string;
  fileName: string;
  dataUrl: string;
  file: File;
};

export type InspectionReport = {
  id: string;
  title: string;
  generatedAt: string;
  niche: InspectionNiche;
  propertyLabel: string;
  inspectorName: string;
  summary: string;
  overallAssessment: string;
  turnoverReady: TurnoverReady;
  issues: InspectionIssue[];
  recommendedActions: string[];
  photoNotes: PhotoNote[];
  printableSummary: string;
};
