export type Jurisdiction = {
  id: string;
  name: string;
  timezone: string;
};

export type Plate = {
  id: string;
  plate: string;
  state: string;
  jurisdiction_id: string;
  created: string;
};

export type Ticket = {
  id: string;
  plate_id: string;
  jurisdiction_id: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: string;
  late_fee_date?: string;
};
