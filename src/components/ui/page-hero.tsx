import Image from "next/image";
import { Container } from "@/components/ui/container";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
}: PageHeroProps) {
  return (
    <section className="border-b border-ink/10 pb-16 pt-24 sm:pb-24 sm:pt-32">
      <Container>
        <p className="eyebrow text-taupe">{eyebrow}</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <h1 className="display-title text-balance text-6xl text-ink sm:text-7xl lg:col-span-8 lg:text-[6.5rem]">
            {title}
          </h1>
          <p className="max-w-xl self-end text-base leading-8 text-muted lg:col-span-4 lg:pb-2">
            {description}
          </p>
        </div>
        {image ? (
          <figure className="mt-16 sm:mt-20">
            <div className="relative aspect-[16/9] overflow-hidden bg-navy sm:aspect-[16/7]">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="100vw"
                className="object-cover saturate-[0.78]"
                priority
              />
              <div className="absolute inset-0 bg-ink/10" />
            </div>
          </figure>
        ) : null}
      </Container>
    </section>
  );
}
