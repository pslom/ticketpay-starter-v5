export interface SFMTACitation {
  citation_number: string;
  license_plate: string;
  state: string;
  citation_issue_date: string;
  violation_description: string;
  violation_location: string;
  fine_amount: string;
  status: string;
  payment_due_date?: string;
}

export async function fetchSFMTACitations(
  plate: string,
  state: string
): Promise<SFMTACitation[]> {
  // Placeholder: implement actual fetch logic
  return [];
}

export function calculateDueDate(issueDate: string): Date {
  const date = new Date(issueDate);
  date.setDate(date.getDate() + 21);
  return date;
}
