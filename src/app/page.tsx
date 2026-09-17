import { HeroSection } from "@/components/home/hero-section";
import { FirmIntroductionSection } from "@/components/home/firm-introduction-section";
import { PracticeAreasSection } from "@/components/home/practice-areas-section";
import { SelectedExperienceSection } from "@/components/home/selected-experience-section";
import { EthosSection } from "@/components/home/ethos-section";
import { TeamSection } from "@/components/home/team-section";
import { SectorsSection } from "@/components/home/sectors-section";
import { OfficesSection } from "@/components/home/offices-section";
import { ContactCtaSection } from "@/components/home/contact-cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FirmIntroductionSection />
      <PracticeAreasSection />
      <SelectedExperienceSection />
      <EthosSection />
      <TeamSection />
      <SectorsSection />
      <OfficesSection />
      <ContactCtaSection />
    </>
  );
}
