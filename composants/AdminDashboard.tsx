import { useState } from 'react';
import { AppointmentWithCustomer } from '@/types/booking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { PlusIcon, CalendarIcon, ClockIcon, Pencil, Trash2 } from 'lucide-react';
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

function isWeekday(date: Date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function AdminDashboard({ appointments, onAdd, onUpdate, onDelete }: AdminDashboardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithCustomer | null>(null);

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

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tableau de bord administratif</CardTitle>
              <CardDescription>Gérer les rendez-vous du garage</CardDescription>
            </div>
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
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucun rendez-vous planifié</p>
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
                  {appointments.map((appointment) => (
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    const dateStr = date.toISOString().split('T')[0];
    onSubmit({
      date: dateStr,
      time,
      customerName: name,
      customerEmail: email,
      carBrand,
    });
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
              onSelect={setDate}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today || !isWeekday(date);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Heure</Label>
        <div className="relative">
          <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-background text-foreground"
          >
            <option value="">Sélectionner une heure</option>
            {WORK_HOURS.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        </div>
      </div>

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
