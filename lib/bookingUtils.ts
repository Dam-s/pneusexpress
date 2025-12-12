import { supabase } from '@/lib/supabaseClient';
import { Appointment, Customer, AppointmentWithCustomer } from '@/types/booking';

export async function loadAppointments(): Promise<AppointmentWithCustomer[]> {
  try {
    const { data, error } = await supabase
      .from('appointment')
      .select(`
        *,
        customer (*)
      `)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Error loading appointments:', error);
      return [];
    }

    return data as AppointmentWithCustomer[];
  } catch (error) {
    console.error('Error loading appointments:', error);
    return [];
  }
}

export async function createCustomer(nom: string, courriel: string): Promise<Customer | null> {
  try {
    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from('customer')
      .select('*')
      .eq('courriel', courriel)
      .single();

    if (existingCustomer) {
      return existingCustomer as Customer;
    }

    // Create new customer
    const { data, error } = await supabase
      .from('customer')
      .insert({ nom, courriel })
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      return null;
    }

    return data as Customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
}

export async function createAppointment(
  date: string,
  time: string,
  id_customer: string,
  car_brand: string
): Promise<Appointment | null> {
  try {
    const { data, error } = await supabase
      .from('appointment')
      .insert({ date, time, id_customer, car_brand })
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return null;
    }

    return data as Appointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    return null;
  }
}

export async function updateAppointment(
  id: string,
  date: string,
  time: string,
  id_customer: string,
  car_brand: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('appointment')
      .update({ date, time, id_customer, car_brand })
      .eq('id', id);

    if (error) {
      console.error('Error updating appointment:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating appointment:', error);
    return false;
  }
}

export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('appointment')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting appointment:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }
}

export async function getAppointmentsByDateAndTime(date: string, time: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('appointment')
      .select('*', { count: 'exact', head: true })
      .eq('date', date)
      .eq('time', time);

    if (error) {
      console.error('Error counting appointments:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error counting appointments:', error);
    return 0;
  }
}

export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday = 1, Friday = 5
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('fr-CA', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}