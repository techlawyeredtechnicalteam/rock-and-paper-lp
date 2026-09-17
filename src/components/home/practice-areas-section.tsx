import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { practices } from "@/content/practices";

export function PracticeAreasSection() {
  return (
    <section className="bg-ink py-24 text-white sm:py-32 lg:py-40">
      <Container>
        <SectionHeading
          eyebrow="Our expertise"
          title="Counsel across the business lifecycle."
          description="From market entry and financing to regulatory engagement and dispute resolution, we bring connected thinking to complex legal questions."
          light
        />

        <div className="mt-20 border-t border-white/15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practices.map((practice, index) => (
            <article
              key={practice.slug}
              className="group border-b border-white/15 py-7 transition-colors hover:bg-white/[0.035] flex flex-col gap-3 "
            >
              <div className="relative aspect-[8/5] overflow-hidden bg-navy sm:col-span-3">
                <Link href={`/expertise/${practice.slug}`} className="absolute inset-0">
                  <Image
                    src={practice.image}
                    alt={practice.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover saturate-[0.72] transition duration-500 group-hover:scale-[1.04] group-hover:saturate-100"
                  />
                  <span className="absolute left-3 top-3 z-10 bg-ink/80 px-2 py-1 text-[0.62rem] font-bold tracking-[0.18em] text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              </div>
              <h3 className="font-serif text-2xl text-white sm:col-span-3 sm:text-3xl">
                <Link href={`/expertise/${practice.slug}`} className="transition-colors hover:text-taupe">
                  {practice.title}
                </Link>
              </h3>
              <p className="max-w-lg text-sm leading-7 text-stone/60 sm:col-span-5">
                {practice.shortDescription}
              </p>
              <Link
                href={`/expertise/${practice.slug}`}
                aria-label={`View ${practice.title}`}
                className="sm:col-span-1 sm:justify-self-end"
              >
                <ArrowUpRight className="size-5 text-stone/50 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-taupe" />
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
