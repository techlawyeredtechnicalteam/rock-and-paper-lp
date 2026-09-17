import Image from "next/image";
import { Container } from "@/components/ui/container";
import { ArrowLink } from "@/components/ui/arrow-link";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100svh-var(--header-height))] overflow-hidden border-b border-ink/10">
      <Container className="relative grid min-h-[calc(100svh-var(--header-height))] items-stretch lg:grid-cols-12">
        <div className="relative z-10 flex flex-col justify-between py-12 sm:py-16 lg:col-span-8 lg:py-20">

          <div className="my-20 lg:my-16">
            <h1 className="display-title text-balance max-w-5xl text-[4.3rem] text-ink sm:text-[6rem] lg:text-[7.6rem] xl:text-[9rem]">
              Clear thinking.
              <span className="block text-taupe">Sound counsel.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-muted sm:text-lg">
              We help businesses, investors and institutions navigate transactions, disputes and regulation with practical legal advice.
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <ArrowLink href="/expertise">Explore our expertise</ArrowLink>
            <ArrowLink href="/contact">Speak with our team</ArrowLink>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-36 top-1/2 w-[34rem] -translate-y-1/2 opacity-[0.1] mix-blend-multiply sm:-right-28 sm:w-[44rem] lg:right-[-10%] lg:w-[58rem] lg:opacity-[0.14]">
          <Image
            src="/images/brand/rock-and-paper-mark.png"
            alt=""
            width={1254}
            height={1254}
            className="h-auto w-full"
            priority
          />
        </div>

        <div className="pointer-events-none absolute right-12 top-0 hidden h-full w-px bg-ink/10 lg:block" />
      </Container>
    </section>
  );
}
