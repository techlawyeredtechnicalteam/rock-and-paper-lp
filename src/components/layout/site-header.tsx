"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { contact } from "@/content/firm";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/expertise", label: "Expertise" },
  { href: "/people", label: "People" },
  { href: "/articles", label: "Articles" },
  { href: "/contact", label: "Contact" },
];

function XSocialIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!mobileMenuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur-md">
      <Container className="flex h-[var(--header-height)] items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Rock & Paper LP home">
          <Image
            src="/images/brand/rock-and-paper-mark.png"
            alt=""
            width={52}
            height={52}
            className="size-11 object-cover mix-blend-multiply"
            priority
          />
          <span className="font-serif text-xl font-semibold tracking-[0.12em] text-ink sm:text-2xl">
            ROCK & PAPER LP
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-taupe"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={contact.x}
            target="_blank"
            rel="noreferrer"
            aria-label="Follow Rock & Paper LP on X"
            title="Follow us on X"
            className="flex size-9 items-center justify-center border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            <XSocialIcon />
          </a>
        </nav>

        <div ref={mobileMenuRef} className="relative lg:hidden">
          <button
            type="button"
            className="flex size-11 items-center justify-center text-ink"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          {isMenuOpen ? (
            <div
              id="mobile-navigation"
              className="absolute right-0 top-14 w-64 border border-ink/10 bg-paper p-6 shadow-xl"
            >
              <nav className="flex flex-col" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="border-b border-ink/10 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink last:border-0"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href={contact.x}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-5 flex items-center justify-between bg-ink px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-paper"
                >
                  <span>Follow us on X</span>
                  <XSocialIcon />
                </a>
              </nav>
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
