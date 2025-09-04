import { PlateProvider, Citation } from './types';
import { queryCitationsByPlate } from '@/lib/sfdata';

export const sfParkingProvider: PlateProvider = {
  id: 'sf_parking',
  supportsPlateLookup: true,
  async queryByPlate({ plate, state, sinceISO }): Promise<Citation[]> {
    const rows = await queryCitationsByPlate({ plate, state, sinceISO, limit: 200 });
    return rows.map(r => ({
      citation_id: r.citation_number,
      issued_at: r.citation_issued_datetime ? new Date(r.citation_issued_datetime) : new Date(),
      violation_desc: r.violation_desc,
      fine_amount: r.fine_amount != null ? Number(r.fine_amount) : undefined,
      plate: r.vehicle_plate,
      state: r.vehicle_plate_state,
      source: 'sf_parking'
    }));
  }
};
