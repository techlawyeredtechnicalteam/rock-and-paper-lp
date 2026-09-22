import Image from "next/image";
import { Container } from "@/components/ui/container";

export function ArticlesSection() {
  return (
    <section className="border-y border-ink/10 bg-paper py-24 sm:py-32 lg:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[8/5] overflow-hidden bg-navy lg:col-span-5">
            <Image
              src="/images/expertise/regulatory-compliance.webp"
              alt="Structured architectural lines representing legal analysis"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover saturate-[0.72]"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow text-taupe">Articles</p>
            <h2 className="display-title mt-8 text-5xl text-ink sm:text-6xl">Articles.</h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-muted">
              No article yet, check back later.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
