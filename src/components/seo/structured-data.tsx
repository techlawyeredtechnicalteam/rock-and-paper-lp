import { getSiteConfig } from "@/lib/seo";
import prisma from "@/lib/prisma";

export async function StructuredData() {
	// Fetch all required data in parallel directly from Prisma
	const [siteConfig, firmRecord, officesData] = await Promise.all([
		getSiteConfig(),
		prisma.firmDetail.findFirst().catch(() => null),
		prisma.office
			.findMany({ orderBy: { createdAt: "asc" } })
			.catch(() => []),
	]);

	const firmData = firmRecord || ({} as Partial<NonNullable<typeof firmRecord>>);

	// Construct the schema using live DB data with fallbacks
	const schema = {
		"@context": "https://schema.org",
		"@type": "LegalService",
		"@id": `${siteConfig.url}/#organization`,
		name: siteConfig.name,
		url: siteConfig.url,
		logo: `${siteConfig.url}/images/brand/rock-and-paper-logo.png`,
		image: `${siteConfig.url}${siteConfig.ogImage}`,
		description: siteConfig.description,
		email: firmData.generalEmail || "",
		telephone: firmData.phones?.[0] || "",
		openingHours: firmData.hours || "Mo-Fr 08:00-18:00",
		areaServed: {
			"@type": "Country",
			name: "Nigeria",
		},
		address: officesData.map((office: any) => ({
			"@type": "PostalAddress",
			addressLocality: office.city,
			streetAddress: office.address?.join(", ") || "",
			addressCountry: "NG",
		})),
		sameAs: firmData.xUrl ? [firmData.xUrl] : [],
		knowsAbout: [
			"Energy and natural resources law",
			"Banking and finance law",
			"Dispute resolution",
			"Intellectual property and technology law",
			"Corporate and commercial law",
			"Infrastructure and projects",
			"Regulatory compliance",
			"Employment and labour law",
			"Telecommunications law",
		],
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(schema).replace(/</g, "\\u003c"),
			}}
		/>
	);
}
