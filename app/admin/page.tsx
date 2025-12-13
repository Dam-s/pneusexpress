"use client";
import { useState, useEffect } from 'react';
import { AppointmentWithCustomer } from '@/types/booking';
import { loadAppointments, createCustomer, createAppointment, updateAppointment, deleteAppointment, updateCustomer } from '@/lib/bookingUtils';
// import { sendConfirmationEmail } from '@/lib/emailService';
import { useAuth } from '@/lib/useAuth';
import { AdminDashboard } from '@/composants/AdminDashboard';
import { Button } from '@/components/ui/button';
import { HomeIcon, WrenchIcon, LogOutIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, loading: authLoading, signOut } = useAuth(true);
  const [appointments, setAppointments] = useState<AppointmentWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  // Load appointments on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await loadAppointments();
    setAppointments(data);
    setLoading(false);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  const handleAddAppointment = async (data: {
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
    carBrand: string;
  }) => {
    // Create or get customer
    const customer = await createCustomer(data.customerName, data.customerEmail);
    if (!customer) {
      alert('Erreur lors de la création du client');
      return;
    }

    // Create appointment
    const appointment = await createAppointment(
      data.date,
      data.time,
      customer.id,
      data.carBrand
    );

    if (!appointment) {
      alert('Erreur lors de la création du rendez-vous');
      return;
    }

    // Send confirmation email
    await fetch("/api/send-confirmation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: data.customerEmail,
      name: data.customerName,
      date: data.date,
      time: data.time,
      carBrand: data.carBrand,
    }),
  });

    // Reload appointments
    await loadData();
  };

  const handleUpdateAppointment = async (
    id: string,
    data: {
      date: string;
      time: string;
      customerName: string;
      customerEmail: string;
      carBrand: string;
    }
  ) => {
    // Find the current appointment to get customer ID
    const currentAppointment = appointments.find(apt => apt.id === id);
    if (!currentAppointment) {
      alert('Rendez-vous introuvable');
      return;
    }

    // Update customer information
    const customer = await updateCustomer(
      currentAppointment.id_customer,
      data.customerName,
      data.customerEmail
    );
    
    if (!customer) {
      alert('Erreur lors de la mise à jour du client');
      return;
    }

    // Update appointment
    const success = await updateAppointment(
      id,
      data.date,
      data.time,
      customer.id,
      data.carBrand
    );

    if (!success) {
      alert('Erreur lors de la mise à jour du rendez-vous');
      return;
    }

    // Reload appointments
    await loadData();
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      return;
    }

    const success = await deleteAppointment(id);

    if (!success) {
      alert('Erreur lors de la suppression du rendez-vous');
      return;
    }

    // Reload appointments
    await loadData();
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(/background-garage-new.jpg)',
        backgroundColor: '#f5f0e8'
      }}
    >
      {/* Overlay pour améliorer la lisibilité */}
      <div className="min-h-screen bg-white/80">
        {/* Header */}
        <header className="border-b bg-card/95">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-primary text-4xl font-bold">PneuxExpress</h1>
                <p className="text-muted-foreground mt-1">
                  Gestion des rendez-vous - Administration
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/">
                  <Button variant="outline">
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Accueil
                  </Button>
                </Link>
                <Button variant="outline" onClick={signOut}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : (
            <AdminDashboard
              appointments={appointments}
              onAdd={handleAddAppointment}
              onUpdate={handleUpdateAppointment}
              onDelete={handleDeleteAppointment}
            />
          )}
        </main>
      </div>
    </div>
  );
}