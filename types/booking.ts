export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:00 format (8-15)
  customerName: string;
  customerEmail: string;
  carBrand: string;
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  count: number;
}
