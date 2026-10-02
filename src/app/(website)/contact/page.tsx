import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ContactDetails } from "@/components/contact/contact-details";
import { createPageMetadata } from "@/lib/seo";
import { FirmDetail, Office, PageSection } from "@/generated/prisma/client";

export async function generateMetadata(): Promise<Metadata> {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
	let seo: any = {};

	try {
		const res = await fetch(`${baseUrl}/api/page-seo?page=contact`, {
			next: { revalidate: 3600 },
		});
		if (res.ok) {
			const json = await res.json();
			seo = json.data || {};
		}
	} catch (error) {
		console.error("Failed to fetch contact page SEO:", error);
	}

	return await createPageMetadata({
		title: seo.title || "Contact",
		description:
			seo.description || "Contact Rock & Paper LP in Abuja or Lagos.",
		path: "/contact",
		ogImage: seo.ogImage || undefined,
	});
}

export default async function ContactPage() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	let contents: PageSection[] = [];
	let offices: Office[] = [];
	let firmDetail: FirmDetail | null = null;

	try {
		const [contentRes, officesRes, firmDetailRes] = await Promise.all([
			fetch(`${baseUrl}/api/page-content?page=people`),
			fetch(`${baseUrl}/api/offices`),
			fetch(`${baseUrl}/api/firm-detail`),
		]);

		if (contentRes.ok) {
			const json = await contentRes.json();
			contents = json.data || [];
		}

		if (officesRes.ok) {
			const json = await officesRes.json();
			offices = json.data || [];
		}

		if (firmDetailRes.ok) {
			const json = await firmDetailRes.json();
			firmDetail = json.data || [];
		}
	} catch (error) {
		console.error("Failed to fetch homepage data:", error);
	}

	const formattedContents = contents.reduce((acc: any, section: any) => {
		acc[section.sectionKey] = section;
		return acc;
	}, {});

	const heroContent = formattedContents["hero"];

	return (
		<>
			<PageHero
				eyebrow={heroContent?.eyebrow || "Contact us"}
				title={heroContent?.title || "Start with a clear conversation."}
				description={
					heroContent?.description ||
					"Contact our Abuja or Lagos office to discuss how we may help with your matter."
				}
			/>
			{firmDetail && <ContactDetails offices={offices} contact={firmDetail} />}
		</>
	);
}
