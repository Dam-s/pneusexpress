"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HomeIcon, WrenchIcon, InfoIcon, GithubIcon, MailIcon, UserIcon, GraduationCapIcon, CalendarIcon, CodeIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AProposPage() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(/background-garage-new.jpg)',
        backgroundColor: '#f5f0e8'
      }}
    >
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
                    À propos de l'application
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
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Application Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <InfoIcon className="h-5 w-5 text-primary" />
                  <CardTitle>À propos de PneuxExpress</CardTitle>
                </div>
                <CardDescription>
                  Système de gestion de rendez-vous pour centre automobile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    PneuxExpress est une application web moderne de gestion de rendez-vous pour 
                    centres automobiles spécialisés dans le changement de pneus. L'application permet 
                    aux clients de réserver facilement un créneau horaire et aux administrateurs de 
                    gérer efficacement leur calendrier de rendez-vous.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Fonctionnalités principales</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Réservation de rendez-vous en ligne avec vérification de disponibilité en temps réel</li>
                    <li>Tableau de bord administrateur avec filtres avancés</li>
                    <li>Envoi automatique d'emails de confirmation</li>
                    <li>Authentification sécurisée pour l'accès administrateur</li>
                    <li>Gestion des créneaux horaires passés et disponibilités</li>
                    <li>Interface responsive et moderne</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Technologies utilisées</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Next.js 16', 'React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Shadcn/ui', 'Resend API'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Version Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CodeIcon className="h-5 w-5 text-primary" />
                  <CardTitle>Informations de version</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version de l'application :</span>
                      <span className="font-semibold">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date de sortie :</span>
                      <span className="font-semibold">Décembre 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Framework :</span>
                      <span className="font-semibold">Next.js 16.0.9</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base de données :</span>
                      <span className="font-semibold">Supabase PostgreSQL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Déploiement :</span>
                      <span className="font-semibold">Vercel</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Statut :</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-semibold">
                        Production
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Developer Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  <CardTitle>Informations du développeur</CardTitle>
                </div>
                <CardDescription>
                  Projet académique développé dans le cadre d'un cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Nom complet</p>
                          <p className="font-semibold">Marechal Damas</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MailIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Courriel</p>
                          <p className="font-semibold">202332555@cegeplapocatiere.qc.ca</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <GraduationCapIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Numéro étudiant</p>
                          <p className="font-semibold">202332555</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CodeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Nom du cours</p>
                          <p className="font-semibold">Programmation avancée</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Session</p>
                          <p className="font-semibold">Automne 2025</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <GithubIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Repository</p>
                          <a 
                            href="https://github.com/Dam-s/pneusexpress" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary hover:underline"
                          >
                            Voir sur GitHub
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground italic">
                      Ce projet a été développé dans le cadre d'un travail académique pour démontrer 
                      les compétences en développement web full-stack avec les technologies modernes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
