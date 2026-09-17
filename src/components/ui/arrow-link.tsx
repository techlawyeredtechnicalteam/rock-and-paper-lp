import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type ArrowLinkProps = {
  href: string;
  children: React.ReactNode;
  light?: boolean;
};

export function ArrowLink({ href, children, light = false }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 border-b pb-2 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
        light
          ? "border-white/30 text-white hover:border-taupe hover:text-stone"
          : "border-ink/20 text-ink hover:border-taupe hover:text-taupe"
      }`}
    >
      {children}
      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
