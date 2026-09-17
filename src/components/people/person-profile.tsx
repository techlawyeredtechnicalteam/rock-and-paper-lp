import Image from "next/image";
import { Container } from "@/components/ui/container";
import type { Person } from "@/content/people";

export function PersonProfile({ person }: { person: Person }) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="relative aspect-[4/5] overflow-hidden bg-navy lg:col-span-4">
            <Image src={person.image} alt={person.name} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover object-top" priority />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="eyebrow text-taupe">Profile</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {person.expertise.map((item) => <span key={item} className="border border-ink/15 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink">{item}</span>)}
            </div>
            <div className="mt-12 space-y-7">
              {person.bio.map((paragraph, index) => <p key={index} className={`${index === 0 ? "font-serif text-3xl leading-[1.4] text-ink" : "text-base leading-8 text-muted"}`}>{paragraph}</p>)}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
