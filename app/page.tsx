"use client";
import { useState, useEffect } from 'react';
import { AppointmentWithCustomer } from '@/types/booking';
import { loadAppointments, createCustomer, createAppointment } from '@/lib/bookingUtils';
import { CustomerView } from '@/composants/CustomerView';
import { Button } from '@/components/ui/button';
import { WrenchIcon, HomeIcon, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function App() {
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
              <div className="flex items-center gap-4">
                <Image
                  src="/logo-garages.jpg"
                  alt="PneuxExpress Logo"
                  width={50}
                  height={50}
                />
                <div>
                  <h1 className="text-primary text-2xl font-bold">PneuxExpress</h1>
                  <p className="text-muted-foreground mt-1">
                    Centre automobile - Changement de pneus
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/">
                  <Button variant="outline">
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Accueil
                  </Button>
                </Link>
                <Link href="/apropos">
                  <Button variant="outline">
                    <InfoIcon className="h-4 w-4 mr-2" />
                    À propos
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline">
                    <WrenchIcon className="h-4 w-4 mr-2" />
                    Administration
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h2 className="mb-2">Réservez votre changement de pneus</h2>
            <p className="text-muted-foreground">
              Choisissez une date et une heure qui vous conviennent. Notre équipe vous accueillera
              du lundi au vendredi de 8h00 à 16h00.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : (
            <CustomerView
              appointments={appointments}
              onBooking={handleAddAppointment}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t bg-card/95 mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>
              Horaires : Lundi au Vendredi, 8h00 - 16h00 • Rendez-vous de 60 minutes • Maximum 3
              véhicules par créneau
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
