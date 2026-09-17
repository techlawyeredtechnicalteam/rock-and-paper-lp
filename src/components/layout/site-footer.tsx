import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { contact, offices } from "@/content/firm";

export function SiteFooter() {
  return (
    <footer className="bg-ink py-16 text-white sm:py-20">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-4" aria-label="Rock & Paper LP home">
              <Image
                src="/images/brand/rock-and-paper-mark.png"
                alt=""
                width={60}
                height={60}
                className="size-12 rounded-sm object-cover"
              />
              <span className="font-serif text-2xl tracking-[0.1em]">ROCK & PAPER LP</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-stone/65">
              Commercially focused legal counsel for businesses, investors, institutions and individuals.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5">
            {offices.map((office) => (
              <div key={office.city}>
                <p className="eyebrow text-taupe">{office.city}</p>
                <address className="mt-5 text-sm not-italic leading-7 text-stone/70">
                  {office.address.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </address>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 lg:text-right">
            <a
              href={`mailto:${contact.generalEmail}`}
              className="group inline-flex items-center gap-3 border-b border-white/20 pb-2 text-sm hover:border-taupe"
            >
              {contact.generalEmail}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <div className="mt-8 flex gap-5 text-xs font-bold uppercase tracking-[0.16em] lg:justify-end">
              <a href={contact.x} target="_blank" rel="noreferrer" className="text-stone/60 hover:text-white">X</a>
              <Link href="/contact" className="text-stone/60 hover:text-white">Contact</Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-[0.68rem] uppercase tracking-[0.14em] text-stone/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Rock & Paper LP</p>
          <p>Abuja · Lagos · Nigeria</p>
        </div>
      </Container>
    </footer>
  );
}
