import { Container } from "@/components/ui/container";
import { ArrowLink } from "@/components/ui/arrow-link";

export function ContactCtaSection() {
  return (
    <section className="border-t border-white/10 bg-ink py-24 text-white sm:py-32">
      <Container>
        <p className="eyebrow text-taupe">Start a conversation</p>
        <div className="mt-10 grid items-end gap-10 lg:grid-cols-12">
          <h2 className="display-title text-balance text-6xl sm:text-7xl lg:col-span-9 lg:text-8xl">
            Let’s look at the matter clearly.
          </h2>
          <div className="lg:col-span-3 lg:pb-3 lg:text-right"><ArrowLink href="/contact" light>Get in touch</ArrowLink></div>
        </div>
      </Container>
    </section>
  );
}
