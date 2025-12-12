import { Appointment, TimeSlot } from '../types/booking';

const WORK_HOURS = [8, 9, 10, 11, 12, 13, 14, 15]; // 8h-16h (last slot at 15h)
const MAX_APPOINTMENTS_PER_SLOT = 3;

export function getAvailableTimeSlots(date: string, appointments: Appointment[]): TimeSlot[] {
  // Filter appointments for the selected date
  const dayAppointments = appointments.filter(apt => apt.date === date);
  
  // Get current date and time for comparison
  const now = new Date();
  const today = formatDate(now);
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  
  return WORK_HOURS.map(hour => {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    const count = dayAppointments.filter(apt => apt.time === timeStr).length;
    
    // Check if this time slot has passed (for today only)
    let isPast = false;
    if (date === today) {
      // A slot is in the past if:
      // - The slot hour is less than current hour, OR
      // - The slot hour equals current hour (since slots are 60min, we're already in that slot)
      isPast = hour <= currentHour;
    }
    
    return {
      time: timeStr,
      available: !isPast && count < MAX_APPOINTMENTS_PER_SLOT,
      count
    };
  });
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

export function saveAppointments(appointments: Appointment[]): void {
  localStorage.setItem('pneux-appointments', JSON.stringify(appointments));
}

export function loadAppointments(): Appointment[] {
  const stored = localStorage.getItem('pneux-appointments');
  return stored ? JSON.parse(stored) : [];
}