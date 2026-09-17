import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { people } from "@/content/people";

export function TeamSection() {
  return (
    <section className="py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionHeading
          eyebrow="Our people"
          title="Accessible counsel. Serious depth."
          description="A closely involved team with experience across transactions, advisory work and disputes."
        />

        <div className="mt-20 grid gap-10 md:grid-cols-3">
          {people.map((person) => (
            <Link key={person.slug} href={`/people/${person.slug}`} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-navy">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top grayscale-[18%] transition duration-500 group-hover:scale-[1.025] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
              </div>
              <div className="flex items-start justify-between border-b border-ink/15 py-5">
                <div>
                  <h3 className="font-serif text-2xl text-ink">{person.name}</h3>
                  <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-taupe">View profile</p>
                </div>
                <ArrowUpRight className="mt-1 size-5 text-ink/40 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-taupe" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
