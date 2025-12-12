import { useState, useEffect } from 'react';
import { AppointmentWithCustomer } from '@/types/booking';
import { getAppointmentsByDateAndTime } from '@/lib/bookingUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { PlusIcon, CalendarIcon, ClockIcon, Pencil, Trash2, FilterIcon, XIcon } from 'lucide-react';
import { format } from 'date-fns';

interface AdminDashboardProps {
  appointments: AppointmentWithCustomer[];
  onAdd: (appointment: {
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
    carBrand: string;
  }) => void;
  onUpdate: (id: string, appointment: {
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
    carBrand: string;
  }) => void;
  onDelete: (id: string) => void;
}

const WORK_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const MAX_APPOINTMENTS_PER_SLOT = 3;

function isWeekday(date: Date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
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

export function AdminDashboard({ appointments, onAdd, onUpdate, onDelete }: AdminDashboardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithCustomer | null>(null);
  
  // Filters
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterTime, setFilterTime] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const handleAddSubmit = (data: {
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
    carBrand: string;
  }) => {
    onAdd(data);
    setIsAddDialogOpen(false);
  };

  const handleUpdateSubmit = (data: {
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
    carBrand: string;
  }) => {
    if (editingAppointment) {
      onUpdate(editingAppointment.id, data);
      setEditingAppointment(null);
    }
  };

  const clearFilters = () => {
    setFilterDate(undefined);
    setFilterTime('');
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    // Filter by date
    if (filterDate) {
      const filterDateStr = filterDate.toISOString().split('T')[0];
      if (appointment.date !== filterDateStr) {
        return false;
      }
    }

    // Filter by time
    if (filterTime) {
      if (appointment.time !== filterTime) {
        return false;
      }
    }

    return true;
  });

  const hasActiveFilters = filterDate || filterTime;

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tableau de bord administratif</CardTitle>
              <CardDescription>Gérer les rendez-vous du garage</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                Filtres
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {(filterDate ? 1 : 0) + (filterTime ? 1 : 0)}
                  </span>
                )}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Ajouter un rendez-vous
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouveau rendez-vous</DialogTitle>
                    <DialogDescription>Ajouter manuellement un rendez-vous</DialogDescription>
                  </DialogHeader>
                  <AppointmentForm onSubmit={handleAddSubmit} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        {/* Filters Section */}
        {showFilters && (
          <div className="px-6 pb-4 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Filtrer par date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterDate ? format(filterDate, 'PPP') : 'Toutes les dates'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filterDate}
                      onSelect={setFilterDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Filtrer par heure</Label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={filterTime}
                    onChange={(e) => setFilterTime(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-background text-foreground"
                  >
                    <option value="">Toutes les heures</option>
                    {WORK_HOURS.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2 flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="w-full"
                >
                  <XIcon className="h-4 w-4 mr-2" />
                  Effacer les filtres
                </Button>
              </div>
            </div>

            {/* Filter Summary */}
            {hasActiveFilters && (
              <div className="mt-4 text-sm text-muted-foreground">
                {filteredAppointments.length} rendez-vous trouvé(s)
                {filterDate && ` pour le ${format(filterDate, 'PPP')}`}
                {filterTime && ` à ${filterTime}`}
              </div>
            )}
          </div>
        )}

        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>
                {hasActiveFilters
                  ? 'Aucun rendez-vous ne correspond aux filtres sélectionnés'
                  : 'Aucun rendez-vous planifié'}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Courriel</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{formatDisplayDate(appointment.date)}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.customer.nom}</TableCell>
                      <TableCell>{appointment.customer.courriel}</TableCell>
                      <TableCell>{appointment.car_brand}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Dialog
                            open={editingAppointment?.id === appointment.id}
                            onOpenChange={(open) => {
                              if (!open) setEditingAppointment(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingAppointment(appointment)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Modifier le rendez-vous</DialogTitle>
                                <DialogDescription>
                                  Modifier les détails du rendez-vous
                                </DialogDescription>
                              </DialogHeader>
                              <AppointmentForm
                                onSubmit={handleUpdateSubmit}
                                initialData={appointment}
                              />
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(appointment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface AppointmentFormProps {
  onSubmit: (data: {
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
    carBrand: string;
  }) => void;
  initialData?: AppointmentWithCustomer;
}

function AppointmentForm({ onSubmit, initialData }: AppointmentFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.date + 'T12:00:00') : undefined
  );
  const [time, setTime] = useState(initialData?.time || '');
  const [name, setName] = useState(initialData?.customer.nom || '');
  const [email, setEmail] = useState(initialData?.customer.courriel || '');
  const [carBrand, setCarBrand] = useState(initialData?.car_brand || '');
  const [availability, setAvailability] = useState<Record<string, number>>({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Load availability for all time slots when date changes
  useEffect(() => {
    if (!date) {
      setAvailability({});
      return;
    }

    const loadAvailability = async () => {
      setLoadingAvailability(true);
      const dateStr = date.toISOString().split('T')[0];
      const availabilityData: Record<string, number> = {};

      for (const hour of WORK_HOURS) {
        const count = await getAppointmentsByDateAndTime(dateStr, hour);
        // If editing, don't count the current appointment
        const adjustedCount = initialData && initialData.date === dateStr && initialData.time === hour 
          ? count - 1 
          : count;
        availabilityData[hour] = MAX_APPOINTMENTS_PER_SLOT - adjustedCount;
      }

      setAvailability(availabilityData);
      setLoadingAvailability(false);
    };

    loadAvailability();
  }, [date, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    // Check if time slot has passed
    if (isTimeSlotPassed(date, time)) {
      alert('Impossible de créer un rendez-vous à une heure déjà passée.');
      return;
    }

    // Check availability
    const availableSlots = availability[time] ?? MAX_APPOINTMENTS_PER_SLOT;
    if (availableSlots <= 0) {
      alert('Ce créneau horaire est complet. Veuillez choisir un autre horaire.');
      return;
    }

    const dateStr = date.toISOString().split('T')[0];
    onSubmit({
      date: dateStr,
      time,
      customerName: name,
      customerEmail: email,
      carBrand,
    });
  };

  const getAvailableSlots = (hour: string): number => {
    return availability[hour] ?? MAX_APPOINTMENTS_PER_SLOT;
  };

  const isValid = date && time && name.trim() && email.trim() && carBrand.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : 'Sélectionner une date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                setTime(''); // Reset time when date changes
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today || !isWeekday(date);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {date && (
        <div className="space-y-2">
          <Label htmlFor="time">Heure</Label>
          {loadingAvailability ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Chargement des disponibilités...
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {WORK_HOURS.map((hour) => {
                const isSelected = time === hour;
                const isPassed = isTimeSlotPassed(date, hour);
                const availableSlots = getAvailableSlots(hour);
                const isFull = availableSlots <= 0;

                return (
                  <Button
                    key={hour}
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => setTime(hour)}
                    disabled={isPassed || isFull}
                    className="w-full flex flex-col h-auto py-2"
                  >
                    <span className="font-semibold">{hour}</span>
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

      <div className="space-y-2">
        <Label htmlFor="name">Nom du client</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jean Tremblay"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Courriel</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jean.tremblay@exemple.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="carBrand">Marque du véhicule</Label>
        <Input
          id="carBrand"
          value={carBrand}
          onChange={(e) => setCarBrand(e.target.value)}
          placeholder="Toyota Camry"
        />
      </div>

      <Button type="submit" disabled={!isValid} className="w-full">
        {initialData ? 'Mettre à jour' : 'Ajouter'}
      </Button>
    </form>
  );
}
