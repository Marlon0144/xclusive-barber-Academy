import type { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";
import TargetAudienceSection from "@/components/landing/TargetAudienceSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import MissionVisionSection from "@/components/landing/MissionVisionSection";
import InstructorSection from "@/components/landing/InstructorSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";
import PricingSection from "@/components/landing/PricingSection";
import LandingFlowGate from "@/components/landing/LandingFlowGate";
import DifferentiatorsBar from "@/components/landing/DifferentiatorsBar";
import { getServerLanguage } from "@/lib/i18n/server";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = buildPageMetadata("/");

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = Boolean(user);
  const language = await getServerLanguage();

  return (
    <div className="flex flex-col min-h-screen text-[#d3cbba] bg-[#161616] overflow-x-hidden">

      {/* 1. HERO & INTRO */}
      <HeroSection />

      {/* 2. TARGET AUDIENCE (Para quién es) */}
      <TargetAudienceSection />

      {/* Differentiators: right after the intro blocks, in every language. (Placed after
          TargetAudienceSection on purpose: that section overlaps the hero with negative margins
          from the Figma layout, so anything inserted between them covers its title.) */}
      <DifferentiatorsBar language={language} />

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
