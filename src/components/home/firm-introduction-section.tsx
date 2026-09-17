import { Container } from "@/components/ui/container";
import { ArrowLink } from "@/components/ui/arrow-link";

export function FirmIntroductionSection() {
  return (
    <section className="py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <p className="eyebrow pt-3 text-taupe">The firm</p>
          <div className="lg:col-span-8 lg:col-start-5">
            <p className="font-serif text-4xl leading-[1.12] tracking-[-0.025em] text-ink sm:text-5xl lg:text-6xl">
              A full-service Nigerian law firm built around close attention, technical depth and commercial clarity.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <p className="text-base leading-8 text-muted">
                We advise companies, investors, government-linked entities and individuals across transactional, advisory and contentious matters.
              </p>
              <p className="text-base leading-8 text-muted">
                Our structure keeps our lawyers accessible and closely involved, from the immediate legal question to the wider commercial picture.
              </p>
            </div>
            <div className="mt-10">
              <ArrowLink href="/about">Discover the firm</ArrowLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
