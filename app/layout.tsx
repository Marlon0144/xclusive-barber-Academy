import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import HeaderWrapper from "@/components/HeaderWrapper";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import FloatingLanguageSwitcher from "@/components/i18n/FloatingLanguageSwitcher";
import { getServerLanguage } from "@/lib/i18n/server";

// Figma source of truth: Poppins (ExtraBold for headings, Regular for body)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Xclusive Barber Academy",
  description: "Professional barber training for committed students.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getServerLanguage();

  return (
    <html lang={language}>
      <body className={`${poppins.variable} antialiased bg-background text-foreground-strong`}>
        <LanguageProvider initialLanguage={language}>
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <FloatingLanguageSwitcher />
          <main>
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
