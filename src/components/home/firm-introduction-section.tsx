import { Container } from "@/components/ui/container";
import { ArrowLink } from "@/components/ui/arrow-link";

interface FirmIntroductionSectionProps {
	content?: {
		eyebrow?: string | null;
		title?: string | null;
		description?: string | null;
		linkLabel?: string | null;
		linkUrl?: string | null;
	};
}

export function FirmIntroductionSection({
	content,
}: FirmIntroductionSectionProps) {
	// 1. Setup fallbacks
	const eyebrowText = content?.eyebrow || "The firm";
	const titleText =
		content?.title ||
		"A full-service Nigerian law firm built around close attention, technical depth and commercial clarity.";
	const linkLabel = content?.linkLabel || "Discover the firm";
	const linkUrl = content?.linkUrl || "/about";

	// 2. Default description with the pipe delimiter already in place
	const defaultDesc =
		"We advise companies, investors, government-linked entities and individuals across transactional, advisory and contentious matters. | Our structure keeps our lawyers accessible and closely involved, from the immediate legal question to the wider commercial picture.";

	// 3. Split the description by the pipe character and clean up whitespace
	const descriptionText = content?.description || defaultDesc;
	const paragraphs = descriptionText
		.split("|")
		.map((p) => p.trim())
		.filter(Boolean);

	return (
		<section className="py-24 sm:py-32 lg:py-40">
			<Container>
				<div className="grid gap-10 lg:grid-cols-12">
					<p className="eyebrow pt-3 text-taupe">{eyebrowText}</p>

					<div className="lg:col-span-8 lg:col-start-5">
						<p className="font-serif text-4xl leading-[1.12] tracking-[-0.025em] text-ink sm:text-5xl lg:text-6xl text-balance">
							{titleText}
						</p>

						<div className="mt-10 grid gap-8 sm:grid-cols-2">
							{/* 4. Dynamically map the paragraphs so it works for 1, 2, or 3 blocks of text */}
							{paragraphs.map((para, index) => (
								<p key={index} className="text-base leading-8 text-muted">
									{para}
								</p>
							))}
						</div>

						<div className="mt-10">
							<ArrowLink href={linkUrl}>{linkLabel}</ArrowLink>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
