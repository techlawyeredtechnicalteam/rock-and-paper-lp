import { Container } from "@/components/ui/container";
import { SectorCard } from "@/components/sectors/sector-card";
import { sectors } from "@/content/sectors";

export function SectorsGrid() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, index) => (
            <SectorCard key={sector.name} sector={sector} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
