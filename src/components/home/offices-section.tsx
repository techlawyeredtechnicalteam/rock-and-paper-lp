import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ArrowLink } from "@/components/ui/arrow-link";

export type Office = {
	id: string;
	city: string;
	address: string[];
	image?: string | null;
};

interface OfficesSectionProps {
	offices: Office[];
	// Add the CMS content prop
	content?: {
		eyebrow?: string | null;
		title?: string | null;
		linkLabel?: string | null;
		linkUrl?: string | null;
	};
}

export function OfficesSection({ offices, content }: OfficesSectionProps) {
	if (!offices || offices.length === 0) {
		return null;
	}

	return (
		<section className="py-24 sm:py-32 lg:py-40">
			<Container>
				<div className="grid gap-12 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<p className="eyebrow text-taupe">
							{content?.eyebrow || "Our offices"}
						</p>
						<h2 className="display-title mt-8 text-5xl text-ink sm:text-6xl">
							{content?.title || "Close to the work. Connected in perspective."}
						</h2>
					</div>
					<div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
						{offices.map((office) => (
							<article
								key={office.id || office.city}
								className="group overflow-hidden bg-paper">
								<div className="p-8 sm:p-10">
									<MapPin className="size-5 text-taupe" strokeWidth={1.5} />
									<h3 className="mt-10 font-serif text-4xl text-ink">
										{office.city}
									</h3>
									<address className="mt-5 text-sm not-italic leading-7 text-muted">
										{Array.isArray(office.address)
											? office.address.map((line) => (
													<span key={line} className="block">
														{line}
													</span>
											  ))
											: String(office.address)
													.split("\n")
													.map((line) => (
														<span key={line} className="block">
															{line}
														</span>
													))}
									</address>
								</div>
							</article>
						))}
					</div>
				</div>
				<div className="mt-10 flex justify-end">
					<ArrowLink href={content?.linkUrl || "/contact"}>
						{content?.linkLabel || "Contact the firm"}
					</ArrowLink>
				</div>
			</Container>
		</section>
	);
}
