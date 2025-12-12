"use client";
import { useState, useEffect } from 'react';
import { Appointment } from '@/types/booking';
import { loadAppointments, saveAppointments } from '@/lib/bookingUtils';
import { CustomerView } from '@/composants/CustomerView';
import { AdminDashboard } from '@/composants/AdminDashboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WrenchIcon, UserIcon } from 'lucide-react';

export default function App() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');

  // Load appointments on mount
  useEffect(() => {
    const loaded = loadAppointments();
    setAppointments(loaded);
  }, []);

  // Save appointments whenever they change
  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  const handleAddAppointment = (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setAppointments([...appointments, newAppointment]);
  };

  const handleUpdateAppointment = (
    id: string,
    data: Omit<Appointment, 'id' | 'createdAt'>
  ) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, ...data } : apt
      )
    );
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-primary">PneuxExpress</h1>
              <p className="text-muted-foreground mt-1">
                Centre automobile - Changement de pneus
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'customer' ? 'default' : 'outline'}
                onClick={() => setActiveTab('customer')}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Réserver
              </Button>
              <Button
                variant={activeTab === 'admin' ? 'default' : 'outline'}
                onClick={() => setActiveTab('admin')}
              >
                <WrenchIcon className="h-4 w-4 mr-2" />
                Administration
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'customer' ? (
          <div>
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <h2 className="mb-2">Réservez votre changement de pneus</h2>
              <p className="text-muted-foreground">
                Choisissez une date et une heure qui vous conviennent. Notre équipe vous accueillera
                du lundi au vendredi de 8h00 à 16h00.
              </p>
            </div>
            <CustomerView
              appointments={appointments}
              onBooking={handleAddAppointment}
            />
          </div>
        ) : (
          <AdminDashboard
            appointments={appointments}
            onAdd={handleAddAppointment}
            onUpdate={handleUpdateAppointment}
            onDelete={handleDeleteAppointment}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Horaires : Lundi au Vendredi, 8h00 - 16h00 • Rendez-vous de 60 minutes • Maximum 3
            véhicules par créneau
          </p>
        </div>
      </footer>
    </div>
  );
}
