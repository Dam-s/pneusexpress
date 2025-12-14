"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HomeIcon, LockIcon, InfoIcon } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('Identifiants incorrects. Veuillez réessayer.');
        console.error('Login error:', error);
        return;
      }

      if (data.user) {
        router.push('/admin');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
      style={{
        backgroundImage: 'url(/background-garage.jpg)',
        backgroundColor: '#f5f0e8'
      }}
    >
      <div className="min-h-screen bg-white/80 w-full flex items-center justify-center">
        <div className="w-full max-w-md p-4">
          {/* Header with Home Link */}
          <div className="mb-8 text-center flex gap-2 justify-center">
            <Link href="/">
              <Button variant="outline">
                <HomeIcon className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
            <Link href="/apropos">
              <Button variant="outline">
                <InfoIcon className="h-4 w-4 mr-2" />
                À propos
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <LockIcon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Administration</CardTitle>
              <CardDescription>
                Connectez-vous pour accéder au tableau de bord
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Adresse courriel</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@pneuxexpress.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Accès réservé aux administrateurs</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
