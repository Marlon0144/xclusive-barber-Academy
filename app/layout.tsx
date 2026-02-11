import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-cinzel" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "Xclusive Barber Academy | Formación Profesional",
  description: "Formación profesional en barbería para latinos en Australia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${cinzel.variable} ${montserrat.variable} antialiased bg-[#050505] text-[#EDEDED]`}>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
