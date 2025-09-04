export type SFMTARecord = {
  citation_number: string;
  citation_issued_datetime: string; // ISO from feed
  violation?: string | null;
  violation_desc?: string | null;
  citation_location?: string | null;
  vehicle_plate_state: string;
  vehicle_plate: string;
  fine_amount?: number | null;
  date_added?: string | null;
  the_geom?: unknown | null;
  supervisor_districts?: string | null;
  analysis_neighborhood?: string | null;
  latitude?: string | null;
  longitude?: string | null;
};
