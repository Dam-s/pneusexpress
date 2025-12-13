import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name, date, time, carBrand } = await req.json();

  try {
    await resend.emails.send({
      from: "PneuxExpress <onboarding@resend.dev>",
      to: email,
      subject: "Confirmation de votre rendez-vous – PneuxExpress",
      html: `
        <div style="font-family:Arial; max-width:600px">
          <h2 style="color:#0b3f5d">Rendez-vous confirmé</h2>

          <p>Bonjour <strong>${name}</strong>,</p>

          <p>Votre rendez-vous pour le changement de pneus est confirmé :</p>

          <table style="width:100%; border-collapse:collapse">
            <tr><td><strong>Date :</strong></td><td>${date}</td></tr>
            <tr><td><strong>Heure :</strong></td><td>${time}</td></tr>
            <tr><td><strong>Véhicule :</strong></td><td>${carBrand}</td></tr>
          </table>

          <p style="margin-top:20px">
            📍 PneuxExpress<br/>
            ⏰ Lundi au vendredi – 8h00 à 16h00
          </p>

          <p>Merci pour votre confiance.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur email :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
