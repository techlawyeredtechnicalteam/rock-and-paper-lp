import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { people } from "@/content/people";

export function PeopleGrid() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
          {people.map((person) => (
            <Link key={person.slug} href={`/people/${person.slug}`} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-navy">
                <Image src={person.image} alt={person.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-top transition duration-500 group-hover:scale-[1.025]" />
              </div>
              <div className="flex justify-between border-b border-ink/15 py-5">
                <div>
                  <h2 className="font-serif text-3xl text-ink">{person.name}</h2>
                  <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-taupe">View profile</p>
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
