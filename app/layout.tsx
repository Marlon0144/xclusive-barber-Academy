import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import HeaderWrapper from "@/components/HeaderWrapper";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import FloatingLanguageSwitcher from "@/components/i18n/FloatingLanguageSwitcher";
import { getServerLanguage } from "@/lib/i18n/server";
import { getOrganizationSchema } from "@/lib/seo/organization-schema";
import { GoogleTagManagerScript, GoogleTagManagerNoScript } from "@/components/analytics/GoogleTagManager";
import { MetaPixelScript, MetaPixelNoScript } from "@/components/analytics/MetaPixel";
import { GoogleAnalyticsScript } from "@/components/analytics/GoogleAnalytics";

// Figma source of truth: Poppins (ExtraBold for headings, Regular for body)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xclusiveacademy.com.au";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Xclusive Barber Academy | Professional Barber Training in Melbourne",
    template: "%s | Xclusive Barber Academy",
  },
  description:
    "Learn barbering in a real Melbourne barbershop. Practical, hands-on barber training programs at Xclusive Barber Academy in Coburg, Melbourne.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "Xclusive Barber Academy",
    title: "Xclusive Barber Academy | Professional Barber Training in Melbourne",
    description:
      "Learn barbering in a real Melbourne barbershop. Practical, hands-on barber training programs at Xclusive Barber Academy in Coburg, Melbourne.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xclusive Barber Academy | Professional Barber Training in Melbourne",
    description:
      "Learn barbering in a real Melbourne barbershop. Practical, hands-on barber training programs at Xclusive Barber Academy in Coburg, Melbourne.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getServerLanguage();
  const organizationSchema = getOrganizationSchema();

  return (
    <html lang={language}>
      <head>
        <GoogleTagManagerScript />
        <GoogleAnalyticsScript />
        <MetaPixelScript />
      </head>
      <body className={`${poppins.variable} antialiased bg-background text-foreground-strong`}>
        <GoogleTagManagerNoScript />
        <MetaPixelNoScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
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
