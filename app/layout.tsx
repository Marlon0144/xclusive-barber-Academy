import type { Metadata } from "next";
import { Inter } from "next/font/google"; // O la fuente que tengas
import "./globals.css";
import Header from "@/components/Header"; // <--- 1. IMPORTAR

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xclusive Barber Academy",
  description: "Plataforma de formación premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* 2. COLOCAR AQUÍ, ANTES DEL CHILDREN */}
        <Header />
        
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
