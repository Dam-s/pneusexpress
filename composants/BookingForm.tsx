import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserIcon, MailIcon, CarIcon } from 'lucide-react';

interface BookingFormProps {
  onSubmit: (data: { name: string; email: string; carBrand: string }) => void;
  disabled: boolean;
}

export function BookingForm({ onSubmit, disabled }: BookingFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [carBrand, setCarBrand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, carBrand });
  };

  const isValid = name.trim() && email.trim() && carBrand.trim();

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Vos informations</CardTitle>
        <CardDescription>Complétez le formulaire pour confirmer votre réservation</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Tremblay"
                className="pl-10"
                disabled={disabled}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Courriel</Label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean.tremblay@exemple.com"
                className="pl-10"
                disabled={disabled}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="carBrand">Marque du véhicule</Label>
            <div className="relative">
              <CarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="carBrand"
                value={carBrand}
                onChange={(e) => setCarBrand(e.target.value)}
                placeholder="Toyota Camry"
                className="pl-10"
                disabled={disabled}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={disabled || !isValid}
            className="w-full"
          >
            Confirmer la réservation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
