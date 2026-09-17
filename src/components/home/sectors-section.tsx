import { Container } from "@/components/ui/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import { SectorCard } from "@/components/sectors/sector-card";
import { sectors } from "@/content/sectors";

export function SectorsSection() {
  return (
    <section className="overflow-hidden bg-navy py-24 text-white sm:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-taupe">Sector focus</p>
            <h2 className="display-title mt-8 max-w-4xl text-5xl sm:text-6xl">
              Understanding the world around the matter.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <ArrowLink href="/sectors" light>View all sectors</ArrowLink>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, index) => (
            <SectorCard key={sector.name} sector={sector} index={index} dark />
          ))}
        </div>
      </Container>
    </section>
  );
}
