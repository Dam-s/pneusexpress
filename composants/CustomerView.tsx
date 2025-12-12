import { useState, useEffect } from 'react';
import { AppointmentWithCustomer } from '@/types/booking';
import { getAppointmentsByDateAndTime } from '@/lib/bookingUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CalendarIcon, ClockIcon, UserIcon, MailIcon, CarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface CustomerViewProps {
  appointments: AppointmentWithCustomer[];
  onBooking: (data: {
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
    carBrand: string;
  }) => void;
}

const WORK_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const MAX_APPOINTMENTS_PER_SLOT = 3;

function isWeekday(date: Date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function isTimeSlotPassed(date: Date, time: string): boolean {
  const now = new Date();
  const selectedDate = new Date(date);
  
  // Reset hours for comparison
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const compareDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  
  // If the date is in the future, slot is not passed
  if (compareDate > todayDate) {
    return false;
  }
  
  // If the date is in the past, slot is passed
  if (compareDate < todayDate) {
    return true;
  }
  
  // Same day: compare times
  const [hours, minutes] = time.split(':').map(Number);
  const slotTime = hours * 60 + minutes;
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  return slotTime <= currentTime;
}

export function CustomerView({ appointments, onBooking }: CustomerViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [carBrand, setCarBrand] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availability, setAvailability] = useState<Record<string, number>>({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Load availability for all time slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailability({});
      return;
    }

    const loadAvailability = async () => {
      setLoadingAvailability(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const availabilityData: Record<string, number> = {};

      for (const time of WORK_HOURS) {
        const count = await getAppointmentsByDateAndTime(dateStr, time);
        availabilityData[time] = MAX_APPOINTMENTS_PER_SLOT - count;
      }

      setAvailability(availabilityData);
      setLoadingAvailability(false);
    };

    loadAvailability();
  }, [selectedDate]);

  const getAvailableSlots = (time: string): number => {
    return availability[time] ?? MAX_APPOINTMENTS_PER_SLOT;
  };

  const checkSlotAvailability = async (time: string) => {
    if (!selectedDate) return;
    
    // Check if time slot has passed
    if (isTimeSlotPassed(selectedDate, time)) {
      alert('Ce créneau horaire est déjà passé. Veuillez choisir un autre horaire.');
      return;
    }

    const available = getAvailableSlots(time);
    
    if (available > 0) {
      setSelectedTime(time);
    } else {
      alert('Ce créneau est complet. Veuillez choisir un autre horaire.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    // Verify time slot hasn't passed
    if (isTimeSlotPassed(selectedDate, selectedTime)) {
      alert('Ce créneau horaire est déjà passé. Veuillez choisir un autre horaire.');
      setSelectedTime('');
      return;
    }

    // Verify slot is still available
    setCheckingAvailability(true);
    const dateStr = selectedDate.toISOString().split('T')[0];
    const count = await getAppointmentsByDateAndTime(dateStr, selectedTime);
    const available = MAX_APPOINTMENTS_PER_SLOT - count;
    setCheckingAvailability(false);

    if (available <= 0) {
      alert('Ce créneau vient d\'être réservé. Veuillez choisir un autre horaire.');
      setSelectedTime('');
      return;
    }

    onBooking({
      date: dateStr,
      time: selectedTime,
      customerName,
      customerEmail,
      carBrand,
    });

    // Reset form
    setSelectedDate(undefined);
    setSelectedTime('');
    setCustomerName('');
    setCustomerEmail('');
    setCarBrand('');

    alert('Votre rendez-vous a été réservé avec succès!');
  };

  const isFormValid = selectedDate && selectedTime && customerName.trim() && customerEmail.trim() && carBrand.trim();

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Réserver un rendez-vous</CardTitle>
          <CardDescription>
            Sélectionnez une date et une heure, puis remplissez vos informations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Calendar Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Choisir une date
              </Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(''); // Reset time when date changes
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today || !isWeekday(date);
                  }}
                  className="rounded-md border"
                />
              </div>
              {selectedDate && (
                <p className="text-sm text-center text-muted-foreground">
                  Date sélectionnée : {format(selectedDate, 'PPP')}
                </p>
              )}
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  Choisir une heure
                </Label>
                {loadingAvailability ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Chargement des disponibilités...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {WORK_HOURS.map((time) => {
                      const isSelected = selectedTime === time;
                      const isPassed = isTimeSlotPassed(selectedDate, time);
                      const availableSlots = getAvailableSlots(time);
                      const isFull = availableSlots <= 0;

                      return (
                        <Button
                          key={time}
                          type="button"
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => checkSlotAvailability(time)}
                          disabled={checkingAvailability || isPassed || isFull}
                          className="w-full flex flex-col h-auto py-3"
                        >
                          <span className="font-semibold">{time}</span>
                          <span className="text-xs mt-1">
                            {isPassed 
                              ? '(passé)' 
                              : isFull 
                                ? '(complet)' 
                                : `${availableSlots}/${MAX_APPOINTMENTS_PER_SLOT} dispo`
                            }
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Customer Information */}
            {selectedTime && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Vos informations</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Nom complet
                  </Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Jean Tremblay"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail" className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4" />
                    Courriel
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="jean.tremblay@exemple.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carBrand" className="flex items-center gap-2">
                    <CarIcon className="h-4 w-4" />
                    Marque et modèle du véhicule
                  </Label>
                  <Input
                    id="carBrand"
                    value={carBrand}
                    onChange={(e) => setCarBrand(e.target.value)}
                    placeholder="Toyota Camry 2020"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            {selectedTime && (
              <Button
                type="submit"
                disabled={!isFormValid || checkingAvailability}
                className="w-full"
                size="lg"
              >
                Confirmer le rendez-vous
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
