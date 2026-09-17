import { Container } from "@/components/ui/container";

const matters = [
  "Advising through a government-backed gas infrastructure funding process that secured more than US$8 million.",
  "Company secretarial support to a US$100 million gas investment company.",
  "Advisory work connected with a gas-to-power facility valued at more than US$80 million.",
  "Navigating upstream, midstream and downstream oil and gas licensing regimes for multiple operators.",
  "Experience in HKIAC and ad hoc arbitration proceedings involving energy, technology and commercial claims.",
  "Intellectual property, domain-name and brand-protection matters for local and international businesses.",
  "Employment and labour advice for financial institutions and corporate organisations.",
  "Litigation experience across Nigeria for major consumer and technology businesses.",
] as const;

export function AboutExperience() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-taupe">Selected experience</p>
            <h2 className="display-title mt-8 text-5xl text-ink sm:text-6xl">A broad view of the matter.</h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-muted">
              Representative matters handled by members of our team before and during their time at the firm.
            </p>
          </div>
          <ol className="border-t border-ink/15 lg:col-span-7 lg:col-start-6">
            {matters.map((matter, index) => (
              <li key={matter} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-ink/15 py-6">
                <span className="text-[0.65rem] font-bold tracking-[0.16em] text-taupe">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-sm leading-7 text-charcoal">{matter}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
