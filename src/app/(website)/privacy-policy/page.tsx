import type { Metadata } from "next";
import { PrivacyPolicyContent } from "@/components/privacy/privacy-policy-content";
import { Container } from "@/components/ui/container";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	return createPageMetadata({
		title: "Privacy Policy",
		description:
			"How Rock & Paper LP collects, uses, protects and retains personal information.",
		path: "/privacy-policy",
	});
}

export default function PrivacyPolicyPage() {
	return (
		<>
			<section className="border-b border-ink/10 bg-paper pb-16 pt-24 sm:pb-24 sm:pt-32">
				<Container>
					<p className="eyebrow text-taupe">Legal</p>
					<div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
						<h1 className="display-title text-balance text-6xl text-ink sm:text-7xl lg:col-span-8 lg:text-[6.5rem]">
							Privacy Policy.
						</h1>
						<div className="space-y-2 text-sm leading-6 text-muted lg:col-span-4 lg:pb-2">
							<p>
								<span className="font-semibold text-ink">Effective date:</span>{" "}
								<time dateTime="2026-10-05">5 October 2026</time>
							</p>
							<p>
								<span className="font-semibold text-ink">Last updated:</span>{" "}
								<time dateTime="2026-10-05">5 October 2026</time>
							</p>
						</div>
					</div>
				</Container>
			</section>
			<PrivacyPolicyContent />
		</>
	);
}
