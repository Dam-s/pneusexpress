export interface Customer {
  id: string;
  created_at: string;
  nom: string;
  courriel: string;
}

export interface Appointment {
  id: string;
  created_at: string;
  date: string;
  time: string;
  id_customer: string;
  car_brand: string;
  customer?: Customer;
}

export interface AppointmentWithCustomer extends Appointment {
  customer: Customer;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  count: number;
}
