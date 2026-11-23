import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import {
	ContactDetails,
	type ContactInfo,
	type Office,
} from "@/components/contact/contact-details";
import { createPageMetadata } from "@/lib/seo";
import { PageSection } from "@/generated/prisma/client";
import {
	contact as fallbackContact,
	offices as fallbackOffices,
} from "@/content/firm";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	let seo: any = {};

	try {
		const record = await prisma.pageSeo.findUnique({
			where: { pageSlug: "contact" },
		});
		if (record) seo = record;
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
	let contents: PageSection[] = [];
	let offices: Office[] = fallbackOffices.map((office) => ({
		city: office.city,
		address: [...office.address],
		image: office.image,
	}));
	let firmDetail: ContactInfo = {
		generalEmail: fallbackContact.generalEmail,
		partnerEmail: fallbackContact.partnerEmail,
		phones: [...fallbackContact.phones],
		hours: fallbackContact.hours,
	};

	try {
		const [dbContents, dbOffices, dbFirmDetail] = await Promise.all([
			prisma.pageSection.findMany({ where: { pageSlug: "contact" } }),
			prisma.office.findMany({ orderBy: { createdAt: "asc" } }),
			prisma.firmDetail.findFirst(),
		]);

		contents = dbContents;
		if (dbOffices.length > 0) {
			offices = dbOffices;
		}
		if (dbFirmDetail) {
			firmDetail = { ...firmDetail, ...dbFirmDetail };
		}
	} catch (error) {
		console.error("Failed to fetch contact page data:", error);
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
			<ContactDetails offices={offices} contact={firmDetail} />
		</>
	);
}
