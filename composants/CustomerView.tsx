import { useState, useEffect } from 'react';
import { Appointment } from '../types/booking';
import { BookingCalendar } from './BookingCalendar';
import { BookingForm } from './BookingForm';
import { getAvailableTimeSlots, formatDate, formatDisplayDate } from '../lib/bookingUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2Icon } from 'lucide-react';

interface CustomerViewProps {
  appointments: Appointment[];
  onBooking: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
}

export function CustomerView({ appointments, onBooking }: CustomerViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [bookingComplete, setBookingComplete] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = formatDate(selectedDate);
      const slots = getAvailableTimeSlots(dateStr, appointments);
      setAvailableSlots(slots);
      
      // Reset time selection if previously selected time is no longer available
      if (selectedTime) {
        const slot = slots.find(s => s.time === selectedTime);
        if (slot && !slot.available) {
          setSelectedTime(undefined);
        }
      }
    }
  }, [selectedDate, appointments, selectedTime]);

  const handleBookingSubmit = (data: { name: string; email: string; carBrand: string }) => {
    if (!selectedDate || !selectedTime) return;

    const dateStr = formatDate(selectedDate);
    onBooking({
      date: dateStr,
      time: selectedTime,
      customerName: data.name,
      customerEmail: data.email,
      carBrand: data.carBrand,
    });

    setBookingComplete(true);
    setTimeout(() => {
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setBookingComplete(false);
    }, 3000);
  };

  const canBook = selectedDate && selectedTime;

  if (bookingComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-primary">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle2Icon className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="mb-2">Réservation confirmée !</h2>
            <p className="text-muted-foreground">
              Votre rendez-vous a été enregistré avec succès.
            </p>
            {selectedDate && selectedTime && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <p>{formatDisplayDate(formatDate(selectedDate))}</p>
                <p className="mt-1">{selectedTime}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <BookingCalendar
        availableSlots={availableSlots}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onDateSelect={setSelectedDate}
        onTimeSelect={setSelectedTime}
      />
      
      <BookingForm
        onSubmit={handleBookingSubmit}
        disabled={!canBook}
      />
    </div>
  );
}
