import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { contact, offices } from "@/content/firm";

type PolicySectionProps = {
  number: number;
  title: string;
  children: ReactNode;
};

const sections = [
  "About Rock & Paper LP",
  "Information We Collect",
  "How We Collect Your Information",
  "How We Use Personal Information",
  "Lawful Basis for Processing",
  "Confidentiality and Legal Professional Privilege",
  "Sharing of Personal Information",
  "Data Security",
  "Website and Cookies",
  "Third-Party Websites",
  "Data Retention",
  "Your Data Protection Rights",
  "Children’s Privacy",
  "Changes to This Privacy Policy",
  "Contact Us",
] as const;

function PolicySection({ number, title, children }: PolicySectionProps) {
  return (
    <section id={`section-${number}`} className="scroll-mt-32 border-t border-ink/10 pt-10">
      <p className="eyebrow text-taupe">{String(number).padStart(2, "0")}</p>
      <h2 className="mt-4 font-serif text-3xl font-medium tracking-[-0.02em] text-ink sm:text-4xl">
        {title}
      </h2>
      <div className="mt-6 space-y-5 text-[0.98rem] leading-8 text-muted">{children}</div>
    </section>
  );
}

function PolicyList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3 pl-1">
      {items.map((item) => (
        <li key={item} className="flex gap-4">
          <span className="mt-[0.82rem] size-1.5 shrink-0 rounded-full bg-taupe" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PrivacyPolicyContent() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow text-taupe">On this page</p>
              <nav aria-label="Privacy policy sections" className="mt-7">
                <ol className="space-y-3 border-l border-ink/10 pl-5 text-xs leading-5 text-muted">
                  {sections.map((section, index) => (
                    <li key={section}>
                      <a href={`#section-${index + 1}`} className="transition-colors hover:text-ink">
                        {index + 1}. {section}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          <article className="space-y-14 lg:col-span-8 lg:col-start-5">
            <div className="space-y-5 text-lg leading-9 text-charcoal">
              <p>
                Rock &amp; Paper LP (“Rock &amp; Paper”, “we”, “us” or “our”) respects your privacy and is
                committed to protecting personal information entrusted to us.
              </p>
              <p>
                This Privacy Policy explains how we handle personal information when you visit our website,
                contact us through the website, or otherwise communicate with us in connection with our legal
                services.
              </p>
              <p>
                We process personal information in accordance with applicable data protection laws and
                regulations, including the Nigeria Data Protection Act 2023 (NDPA).
              </p>
            </div>

            <PolicySection number={1} title={sections[0]}>
              <p>
                Rock &amp; Paper LP is a Nigerian law firm providing legal services to individuals, businesses,
                institutions and other clients.
              </p>
              <p>Our offices are located at:</p>
              <div className="grid gap-6 sm:grid-cols-2">
                {offices.map((office) => (
                  <address key={office.city} className="border-l border-taupe pl-5 not-italic">
                    <strong className="block text-ink">{office.city} Office</strong>
                    {office.address.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                    <span className="block">Nigeria</span>
                  </address>
                ))}
              </div>
              <p>
                For privacy-related enquiries, contact us at{" "}
                <a className="font-semibold text-ink underline decoration-taupe underline-offset-4" href={`mailto:${contact.generalEmail}`}>
                  {contact.generalEmail}
                </a>.
              </p>
            </PolicySection>

            <PolicySection number={2} title={sections[1]}>
              <p>Depending on how you interact with us, we may collect personal information such as:</p>
              <PolicyList items={[
                "Your name",
                "Email address",
                "Telephone number",
                "Address",
                "Company or organisation details",
                "Professional information",
                "Information contained in enquiries or communications sent to us",
                "Documents or information you voluntarily provide to us",
                "Other information necessary for us to provide our legal services or comply with our legal and professional obligations",
              ]} />
              <p>We only seek to collect information that is reasonably necessary for the relevant purpose.</p>
            </PolicySection>

            <PolicySection number={3} title={sections[2]}>
              <p>We may collect personal information when you:</p>
              <PolicyList items={[
                "Contact us through our website",
                "Send us an email",
                "Call or otherwise communicate with members of the Firm",
                "Request information about our legal services",
                "Engage us to provide legal services",
                "Provide information to us in connection with a legal matter",
              ]} />
              <p>
                We may also receive personal information from third parties where such collection is lawful and
                necessary for the provision of our services.
              </p>
            </PolicySection>

            <PolicySection number={4} title={sections[3]}>
              <p>We may use personal information to:</p>
              <PolicyList items={[
                "Respond to enquiries and requests",
                "Communicate with prospective and existing clients",
                "Provide legal advice and legal services",
                "Assess and manage potential client relationships",
                "Conduct necessary conflict checks and due diligence",
                "Manage legal matters and maintain appropriate records",
                "Communicate with you concerning our services",
                "Comply with legal, regulatory and professional obligations",
                "Protect our legal rights and interests",
                "Carry out other activities permitted or required by applicable law",
              ]} />
            </PolicySection>

            <PolicySection number={5} title={sections[4]}>
              <p>
                Where applicable, we process personal information on lawful grounds recognised under applicable
                data protection law, including:
              </p>
              <PolicyList items={[
                "Your consent",
                "Taking steps at your request before entering into an agreement",
                "Performing a contract or providing requested services",
                "Compliance with a legal or regulatory obligation",
                "Our legitimate interests, where applicable",
                "Other lawful grounds permitted under applicable law",
              ]} />
              <p>Where processing is based on consent, you may withdraw your consent where permitted by law.</p>
            </PolicySection>

            <PolicySection number={6} title={sections[5]}>
              <p>
                As a law firm, we recognise the confidential nature of information provided by our clients and
                prospective clients.
              </p>
              <p>
                Information provided to us in connection with legal matters may be subject to professional
                confidentiality, legal privilege or other protections under applicable law.
              </p>
              <p>
                Submitting information through this website does not, by itself, create a solicitor-client
                relationship between you and Rock &amp; Paper LP.
              </p>
              <p>
                You should not submit highly confidential, privileged or time-sensitive information through a
                general website enquiry channel unless we have specifically requested that you do so.
              </p>
            </PolicySection>

            <PolicySection number={7} title={sections[6]}>
              <p>We do not sell your personal information.</p>
              <p>We may disclose personal information where reasonably necessary and lawful, including to:</p>
              <PolicyList items={[
                "Our lawyers, employees and authorised personnel",
                "Professional advisers and service providers",
                "Persons or organisations involved in a legal matter where necessary and lawful",
                "Courts, tribunals, regulators, government authorities or law enforcement agencies where required or permitted by law",
                "Other persons where you have provided appropriate consent or where disclosure is otherwise permitted by law",
              ]} />
              <p>
                Where third parties process personal information on our behalf, we take reasonable steps to ensure
                that appropriate safeguards are maintained.
              </p>
            </PolicySection>

            <PolicySection number={8} title={sections[7]}>
              <p>
                We take reasonable technical and organisational measures to protect personal information against
                unauthorised access, loss, misuse, alteration, disclosure or destruction.
              </p>
              <p>However, no method of electronic transmission or storage can be guaranteed to be completely secure.</p>
            </PolicySection>

            <PolicySection number={9} title={sections[8]}>
              <p>
                Our website is primarily intended to provide information about Rock &amp; Paper LP and our legal
                services.
              </p>
              <p>
                The website may use limited technical functionality necessary for the operation, security and
                proper display of the website.
              </p>
              <p>
                Where cookies or similar technologies are used in a manner that involves the processing of personal
                information, we will provide appropriate information and, where required by law, obtain the necessary
                consent.
              </p>
            </PolicySection>

            <PolicySection number={10} title={sections[9]}>
              <p>
                Our website may contain links to third-party websites or services. Rock &amp; Paper LP is not
                responsible for the privacy practices, security or content of third-party websites. We encourage you
                to review the privacy policies of those websites before providing them with personal information.
              </p>
            </PolicySection>

            <PolicySection number={11} title={sections[10]}>
              <p>
                We retain personal information only for as long as reasonably necessary for the purpose for which it
                was collected, including providing legal services, maintaining appropriate professional and business
                records, complying with legal obligations and protecting our legal rights.
              </p>
              <p>
                The period for which information is retained may vary depending on its nature and the circumstances
                in which it was collected.
              </p>
            </PolicySection>

            <PolicySection number={12} title={sections[11]}>
              <p>Subject to applicable law and relevant limitations, you may have rights to:</p>
              <PolicyList items={[
                "Request access to personal information we hold about you",
                "Request correction of inaccurate or incomplete information",
                "Request deletion of personal information in appropriate circumstances",
                "Request restriction of processing in appropriate circumstances",
                "Object to certain processing activities",
                "Request portability of your personal information where applicable",
                "Withdraw consent where processing is based on consent",
              ]} />
              <p>
                You may also have the right to lodge a complaint with the relevant data protection authority where
                you believe your data protection rights have been infringed.
              </p>
              <p>
                To exercise an applicable right, please contact us using the details below. We may take reasonable
                steps to verify your identity before responding to your request.
              </p>
            </PolicySection>

            <PolicySection number={13} title={sections[12]}>
              <p>
                Our website is not specifically directed at children. We do not knowingly collect personal
                information from children except where permitted or required by applicable law.
              </p>
            </PolicySection>

            <PolicySection number={14} title={sections[13]}>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our services, legal
                obligations or privacy practices. Any updated version will be published on this website together with
                the applicable effective or updated date.
              </p>
            </PolicySection>

            <PolicySection number={15} title={sections[14]}>
              <p>
                If you have any questions about this Privacy Policy or wish to exercise an applicable data
                protection right, please contact:
              </p>
              <div className="border-l border-taupe pl-5">
                <strong className="block text-ink">Rock &amp; Paper LP</strong>
                <a className="font-semibold text-ink underline decoration-taupe underline-offset-4" href={`mailto:${contact.generalEmail}`}>
                  {contact.generalEmail}
                </a>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {offices.map((office) => (
                  <address key={office.city} className="not-italic">
                    <strong className="block text-ink">{office.city} Office</strong>
                    {office.address.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                    <span className="block">Nigeria</span>
                  </address>
                ))}
              </div>
            </PolicySection>

            <p className="border-t border-ink/10 pt-8 text-sm text-muted">
              © 2026 Rock &amp; Paper LP. All rights reserved.
            </p>
          </article>
        </div>
      </Container>
    </section>
  );
}
