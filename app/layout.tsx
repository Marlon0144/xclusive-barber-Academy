import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import HeaderWrapper from "@/components/HeaderWrapper";

// Figma source of truth: Poppins (ExtraBold for headings, Regular for body)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

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
      <body className={`${poppins.variable} antialiased bg-background text-foreground-strong`}>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
