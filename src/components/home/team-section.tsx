import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export type Person = {
	id: string;
	slug: string;
	name: string;
	image: string;
	imagePosition: string;
};

interface TeamSectionProps {
	people: Person[];
	content?: {
		eyebrow?: string | null;
		title?: string | null;
		description?: string | null;
	};
}

export function TeamSection({ people, content }: TeamSectionProps) {
	if (!people || people.length === 0) {
		return null;
	}

	return (
		<section className="py-24 sm:py-32 lg:py-40">
			<Container>
				<SectionHeading
					eyebrow={content?.eyebrow || "Our people"}
					title={content?.title || "Accessible counsel. Serious depth."}
					description={
						content?.description ||
						"A closely involved team with experience across transactions, advisory work and disputes."
					}
				/>

				<div className="mt-20 grid gap-10 md:grid-cols-3">
					{people.map((person) => (
						<Link
							key={person.slug || person.id}
							href={`/people/${person.slug}`}
							className="group">
							<div className="relative aspect-[4/5] overflow-hidden bg-navy">
								<Image
									src={person.image}
									alt={person.name}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									quality={95}
									style={{ objectPosition: person.imagePosition || "50% 50%" }}
									className="object-cover grayscale-[18%] transition duration-500 group-hover:scale-[1.025] group-hover:grayscale-0"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
							</div>
							<div className="flex items-start justify-between border-b border-ink/15 py-5">
								<div>
									<h3 className="font-serif text-2xl text-ink">
										{person.name}
									</h3>
									<p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-taupe">
										View profile
									</p>
								</div>
								<ArrowUpRight className="mt-1 size-5 text-ink/40 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-taupe" />
							</div>
						</Link>
					))}
				</div>
			</Container>
		</section>
	);
}
