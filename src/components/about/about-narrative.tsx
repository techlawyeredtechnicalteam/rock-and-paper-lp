import { Container } from "@/components/ui/container";

interface AboutNarrativeProps {
	content?: {
		eyebrow?: string | null;
		title?: string | null;
		description?: string | null;
	};
}

export function AboutNarrative({ content }: AboutNarrativeProps) {
	// Default description with the pipe delimiter already included
	const defaultDesc =
		"Our team brings experience across transactional, advisory and contentious work, from energy and infrastructure transactions to intellectual property, commercial agreements, regulatory compliance, arbitration and litigation. | We work closely with founders, boards and in-house teams. We start by understanding what the client is trying to achieve, identify the legal issues and provide clear, workable solutions.";

	const descriptionText = content?.description || defaultDesc;

	// Split the description into two parts
	const [firstDesc, secondDesc] = descriptionText.split("|");

	return (
		<section className="py-24 sm:py-32">
			<Container>
				<div className="grid gap-12 lg:grid-cols-12">
					<p className="eyebrow pt-2 text-taupe">
						{content?.eyebrow || "Who we are"}
					</p>
					<div className="space-y-8 lg:col-span-7 lg:col-start-5">
						<p className="font-serif text-3xl leading-[1.35] text-ink sm:text-4xl">
							{content?.title ||
								"Rock & Paper LP is a Nigerian full-service law firm advising businesses, investors, institutions and individuals."}
						</p>
						<div className="grid gap-8 text-base leading-8 text-muted sm:grid-cols-2">
							{/* Render the first half */}
							<p>{firstDesc?.trim()}</p>

							{/* Render the second half only if a pipe was used */}
							{secondDesc && <p>{secondDesc.trim()}</p>}
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
