import { useState } from 'react';
import { Appointment } from '../types/booking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDisplayDate, isWeekday } from '../lib/bookingUtils';
import { PlusIcon, EditIcon, Trash2Icon, CalendarIcon, ClockIcon } from 'lucide-react';
import { format } from 'date-fns';

interface AdminDashboardProps {
  appointments: Appointment[];
  onAdd: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
}

const WORK_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

export function AdminDashboard({ appointments, onAdd, onUpdate, onDelete }: AdminDashboardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  
  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.time.localeCompare(b.time);
  });

  const handleAddSubmit = (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    onAdd(data);
    setIsAddDialogOpen(false);
  };

  const handleUpdateSubmit = (data: Omit<Appointment, 'id' | 'createdAt'>) => {
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
          {sortedAppointments.length === 0 ? (
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
                  {sortedAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{formatDisplayDate(appointment.date)}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.customerName}</TableCell>
                      <TableCell>{appointment.customerEmail}</TableCell>
                      <TableCell>{appointment.carBrand}</TableCell>
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
                                <EditIcon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Modifier le rendez-vous</DialogTitle>
                                <DialogDescription>
                                  Mettre à jour les informations du rendez-vous
                                </DialogDescription>
                              </DialogHeader>
                              <AppointmentForm
                                onSubmit={handleUpdateSubmit}
                                initialData={appointment}
                              />
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2Icon className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer le rendez-vous</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action
                                  est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(appointment.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
  onSubmit: (data: Omit<Appointment, 'id' | 'createdAt'>) => void;
  initialData?: Appointment;
}

function AppointmentForm({ onSubmit, initialData }: AppointmentFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.date + 'T12:00:00') : undefined
  );
  const [time, setTime] = useState(initialData?.time || '');
  const [name, setName] = useState(initialData?.customerName || '');
  const [email, setEmail] = useState(initialData?.customerEmail || '');
  const [carBrand, setCarBrand] = useState(initialData?.carBrand || '');

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
              {date ? format(date, 'PPP', { locale: undefined }) : 'Sélectionner une date'}
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
            className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-input-background text-foreground"
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
