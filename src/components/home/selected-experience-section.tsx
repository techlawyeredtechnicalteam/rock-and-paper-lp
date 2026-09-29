import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

// Define the shape of your data
export type Experience = {
	id: string;
	title: string;
	value: string;
	description: string;
	image: string;
	imageAlt: string;
};

// Accept experiences as a prop
interface SelectedExperienceSectionProps {
	experiences: Experience[];
}

export function SelectedExperienceSection({
	experiences,
}: SelectedExperienceSectionProps) {
	// Hide the section completely if there's no data
	if (!experiences || experiences.length === 0) {
		return null;
	}

	return (
		<section className="paper-grain py-24 sm:py-32 lg:py-40">
			<Container>
				<SectionHeading
					eyebrow="Selected experience"
					title="Experience measured by what it moves forward."
					description="Representative matters handled by members of our team before and during their time at Rock & Paper LP."
				/>

				<div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{experiences.map((item) => (
						<article
							key={item.id}
							className="group overflow-hidden border border-ink/10 bg-paper/60">
							<div className="relative aspect-[8/5] overflow-hidden bg-navy">
								<Image
									src={item.image}
									alt={item.imageAlt || item.title}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
									className="object-cover saturate-[0.72] transition duration-500 group-hover:scale-[1.035] group-hover:saturate-100"
								/>
							</div>
							<div className="p-7 sm:p-8">
								<p className="font-serif text-4xl text-taupe sm:text-5xl">
									{item.value}
								</p>
								<h3 className="mt-10 font-serif text-2xl text-ink">
									{item.title}
								</h3>
								<p className="mt-4 text-sm leading-7 text-muted">
									{item.description}
								</p>
							</div>
						</article>
					))}
				</div>
			</Container>
		</section>
	);
}
