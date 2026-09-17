import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { Practice } from "@/content/practices";

export function ExpertiseDetail({ practice }: { practice: Practice }) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-taupe">How we help</p>
            <p className="mt-8 font-serif text-3xl leading-[1.4] text-ink sm:text-4xl">{practice.description}</p>
          </div>
          <div className="border-t border-ink/15 lg:col-span-6 lg:col-start-7">
            {practice.services.map((service) => (
              <div key={service} className="grid grid-cols-[1.5rem_1fr] gap-4 border-b border-ink/15 py-6">
                <Check className="mt-1 size-4 text-taupe" />
                <p className="text-sm leading-7 text-charcoal">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
