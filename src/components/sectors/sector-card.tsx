import Image from "next/image";
import type { Sector } from "@/content/sectors";

type SectorCardProps = {
  sector: Sector;
  index: number;
  dark?: boolean;
};

export function SectorCard({ sector, index, dark = false }: SectorCardProps) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden border transition-colors ${
        dark
          ? "border-white/10 bg-white/[0.035] hover:bg-white/[0.07]"
          : "border-ink/10 bg-paper hover:bg-stone/35"
      }`}
    >
      <div className="relative aspect-[8/5] overflow-hidden bg-navy">
        <Image
          src={sector.image}
          alt={sector.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover saturate-[0.78] transition duration-500 group-hover:scale-[1.035] group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-ink/10 transition-colors group-hover:bg-transparent" />
        <span className="absolute left-4 top-4 bg-ink/80 px-2.5 py-1.5 text-[0.62rem] font-bold tracking-[0.18em] text-white backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className={`font-serif text-2xl ${dark ? "text-white" : "text-ink"}`}>
          {sector.name}
        </h3>
        <p className={`mt-3 text-sm leading-6 ${dark ? "text-stone/60" : "text-muted"}`}>
          {sector.description}
        </p>
      </div>
    </article>
  );
}
