export type Citation = {
  citation_id: string;
  issued_at: Date;
  violation_desc?: string;
  fine_amount?: number;
  plate?: string;
  state?: string;
  source: 'sf_parking';
};

export interface PlateProvider {
  id: 'sf_parking';
  supportsPlateLookup: true;
  queryByPlate(opts: { plate: string; state: string; sinceISO?: string }): Promise<Citation[]>;
}
