import { Container } from "@/components/ui/container";

const values = [
  { title: "Useful", copy: "We measure our advice by its usefulness to the client, not merely its complexity." },
  { title: "Direct", copy: "We communicate clearly about risks, available options and realistic timelines." },
  { title: "Precise", copy: "We bring the same care to routine compliance as we do to significant transactions." },
  { title: "Responsive", copy: "Our structure allows us to remain accessible and closely involved in every matter." },
] as const;

export function AboutEthos() {
  return (
    <section className="bg-ink py-24 text-white sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-taupe">Our approach</p>
            <h2 className="display-title mt-8 text-5xl sm:text-6xl">Commercially minded. Deliberately close.</h2>
          </div>
          <div className="grid gap-px bg-white/15 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {values.map((value) => (
              <article key={value.title} className="bg-ink p-8">
                <h3 className="font-serif text-3xl">{value.title}</h3>
                <p className="mt-5 text-sm leading-7 text-stone/65">{value.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
