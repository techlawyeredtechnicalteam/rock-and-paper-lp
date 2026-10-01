import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export type Practice = {
	id: string;
	slug: string;
	title: string;
	shortDescription: string;
	image: string;
	imageAlt: string;
	services: string[];
	description: string;
};

interface PracticeAreasSectionProps {
	practices: Practice[];
	// Add the CMS content prop
	content?: {
		eyebrow?: string | null;
		title?: string | null;
		description?: string | null;
	};
}

export function PracticeAreasSection({
	practices,
	content,
}: PracticeAreasSectionProps) {
	if (!practices || practices.length === 0) {
		return null;
	}

	return (
		<section className="bg-ink py-24 text-white sm:py-32 lg:py-40">
			<Container>
				{/* Dynamically render the section heading */}
				<SectionHeading
					eyebrow={content?.eyebrow || "Our expertise"}
					title={content?.title || "Counsel across the business lifecycle."}
					description={
						content?.description ||
						"From market entry and financing to regulatory engagement and dispute resolution, we bring connected thinking to complex legal questions."
					}
					light
				/>

				<div className="mt-20 border-t border-white/15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{practices.map((practice, index) => (
						<article
							key={practice.slug || practice.id}
							className="group border-b border-white/15 py-7 transition-colors hover:bg-white/[0.035] flex flex-col gap-3">
							<div className="relative aspect-[8/5] overflow-hidden bg-navy sm:col-span-3">
								<Link
									href={`/expertise/${practice.slug}`}
									className="absolute inset-0">
									<Image
										src={practice.image}
										alt={practice.imageAlt || practice.title}
										fill
										sizes="(max-width: 640px) 100vw, 25vw"
										className="object-cover saturate-[0.72] transition duration-500 group-hover:scale-[1.04] group-hover:saturate-100"
									/>
									<span className="absolute left-3 top-3 z-10 bg-ink/80 px-2 py-1 text-[0.62rem] font-bold tracking-[0.18em] text-white">
										{String(index + 1).padStart(2, "0")}
									</span>
								</Link>
							</div>
							<h3 className="font-serif text-2xl text-white sm:col-span-3 sm:text-3xl">
								<Link
									href={`/expertise/${practice.slug}`}
									className="transition-colors hover:text-taupe">
									{practice.title}
								</Link>
							</h3>
							<p className="max-w-lg text-sm leading-7 text-stone/60 sm:col-span-5">
								{practice.shortDescription}
							</p>
							<Link
								href={`/expertise/${practice.slug}`}
								aria-label={`View ${practice.title}`}
								className="sm:col-span-1 sm:justify-self-end">
								<ArrowUpRight className="size-5 text-stone/50 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-taupe" />
							</Link>
						</article>
					))}
				</div>
			</Container>
		</section>
	);
}
