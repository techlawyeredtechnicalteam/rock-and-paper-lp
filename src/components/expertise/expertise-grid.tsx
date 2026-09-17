import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { practices } from "@/content/practices";

export function ExpertiseGrid() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid border-l border-t border-ink/10 md:grid-cols-2 lg:grid-cols-3">
          {practices.map((practice, index) => (
            <Link key={practice.slug} href={`/expertise/${practice.slug}`} className="group flex min-h-[31rem] flex-col overflow-hidden border-b border-r border-ink/10 transition-colors hover:bg-stone/40">
              <div className="relative aspect-[8/5] overflow-hidden bg-navy">
                <Image
                  src={practice.image}
                  alt={practice.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover saturate-[0.75] transition duration-500 group-hover:scale-[1.035] group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-ink/10 transition-colors group-hover:bg-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-8 sm:p-10">
                <div className="flex items-center justify-between">
                  <span className="text-[0.68rem] font-bold tracking-[0.18em] text-taupe">{String(index + 1).padStart(2, "0")}</span>
                  <ArrowUpRight className="size-5 text-ink/35 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-taupe" />
                </div>
                <div className="mt-auto pt-12">
                <h2 className="font-serif text-3xl leading-tight text-ink">{practice.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted">{practice.shortDescription}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
