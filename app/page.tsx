import HeroSection from "@/components/landing/HeroSection";
import TargetAudienceSection from "@/components/landing/TargetAudienceSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import MissionVisionSection from "@/components/landing/MissionVisionSection";
import InstructorSection from "@/components/landing/InstructorSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";

export default async function Home() {
  // no server data needed on landing page
  return (
    <div className="flex flex-col min-h-screen text-[#d3cbba] bg-[#161616] overflow-x-hidden">

      {/* 1. HERO & INTRO */}
      <HeroSection />
      
      {/* 2. TARGET AUDIENCE (Para quién es) */}
      <TargetAudienceSection />

      {/* 3. CORE FEATURES (Metodología) */}
      <FeaturesSection />

      {/* 4. MISION & VISION */}
      <MissionVisionSection />

      {/* 5. INSTRUCTOR & CREDIBILITY */}
      <InstructorSection />

      {/* 6. FINAL CTA */}
      <FinalCtaSection />

    </div>
  );
}
