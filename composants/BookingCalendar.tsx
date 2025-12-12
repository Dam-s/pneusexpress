import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimeSlot } from '../types/booking';
import { isWeekday, formatDate } from '../lib/bookingUtils';
import { CalendarIcon } from 'lucide-react';

interface BookingCalendarProps {
  availableSlots: TimeSlot[];
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
}

export function BookingCalendar({
  availableSlots,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect
}: BookingCalendarProps) {
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Choisir un rendez-vous</CardTitle>
            <CardDescription>Sélectionnez une date et une heure disponibles</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-3">Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || !isWeekday(date);
            }}
            className="rounded-lg border bg-card"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Le garage est ouvert du lundi au vendredi
          </p>
        </div>

        {selectedDate && (
          <div>
            <h3 className="mb-3">Heure disponible</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? 'default' : 'outline'}
                  disabled={!slot.available}
                  onClick={() => onTimeSelect(slot.time)}
                  className="justify-between"
                >
                  <span>{slot.time}</span>
                  <span className="text-xs opacity-70">
                    {slot.count}/3
                  </span>
                </Button>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Maximum 3 véhicules par créneau
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
