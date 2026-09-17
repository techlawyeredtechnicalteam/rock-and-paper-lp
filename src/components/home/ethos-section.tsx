import { BriefcaseBusiness, Handshake, MessageSquareText } from "lucide-react";
import { Container } from "@/components/ui/container";

const principles = [
  {
    number: "01",
    title: "Commercial",
    copy: "Advice shaped around the decision the client needs to make.",
    Icon: BriefcaseBusiness,
  },
  {
    number: "02",
    title: "Clear",
    copy: "Direct communication about risks, options and realistic timelines.",
    Icon: MessageSquareText,
  },
  {
    number: "03",
    title: "Close",
    copy: "Responsive counsel with senior attention throughout every matter.",
    Icon: Handshake,
  },
] as const;

export function EthosSection() {
  return (
    <section className="border-y border-ink/10 bg-stone/45 py-24 sm:py-32 lg:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-taupe">Our ethos</p>
            <h2 className="display-title mt-8 text-5xl text-ink sm:text-6xl">Law in the context of business.</h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="font-serif text-2xl leading-10 text-ink sm:text-3xl sm:leading-[1.45]">
              Good legal work is not only about getting the law right. It is about understanding the objective, anticipating problems and helping the client make a sound decision.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-px bg-ink/10 lg:grid-cols-3">
          {principles.map(({ number, title, copy, Icon }) => (
            <div key={title} className="group bg-paper p-8 sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <p className="eyebrow pt-1 text-taupe">{number}</p>
                <div className="grid size-14 place-items-center border border-ink/10 bg-stone/35 text-ink transition-colors group-hover:border-ink/20 group-hover:bg-stone/65">
                  <Icon className="size-6" strokeWidth={1.4} aria-hidden="true" />
                </div>
              </div>
              <h3 className="mt-10 font-serif text-3xl text-ink">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{copy}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
