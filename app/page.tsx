import type { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";
import TargetAudienceSection from "@/components/landing/TargetAudienceSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import MissionVisionSection from "@/components/landing/MissionVisionSection";
import InstructorSection from "@/components/landing/InstructorSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";
import PricingSection from "@/components/landing/PricingSection";
import LandingFlowGate from "@/components/landing/LandingFlowGate";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Professional Barber Training in Melbourne",
  description:
    "Learn barbering in a real Melbourne barbershop. Practical, hands-on training programs at Xclusive Barber Academy in Coburg — Barber Starter, Professional Xclusive Program, Elite Mentoring, and Barber Business Experience.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Xclusive Barber Academy | Professional Barber Training in Melbourne",
    description:
      "Learn barbering in a real Melbourne barbershop. Practical, hands-on training programs at Xclusive Barber Academy in Coburg.",
    url: "/",
  },
};

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = Boolean(user);

  return (
    <div className="flex flex-col min-h-screen text-[#d3cbba] bg-[#161616] overflow-x-hidden">

      {/* 1. HERO & INTRO */}
      <HeroSection />

      {/* 2. TARGET AUDIENCE (Para quién es) */}
      <TargetAudienceSection />

      <LandingFlowGate forceUnlocked={isAuthenticated}>
        <div id="landing-features-start">
          {/* 3. CORE FEATURES (Metodología) */}
          <FeaturesSection />
        </div>

        {/* 4. MISION & VISION */}
        <MissionVisionSection />

        {/* 5. INSTRUCTOR & CREDIBILITY */}
        <InstructorSection />

        {/* 7. FINAL CTA */}
        <FinalCtaSection />


        {/* 6. PRICING */}
        <PricingSection />


      </LandingFlowGate>

    </div>
  );
}
