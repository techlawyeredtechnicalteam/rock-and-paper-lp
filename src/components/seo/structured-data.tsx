import { cookies } from "next/headers";
import { getSiteConfig } from "@/lib/seo";

export async function StructuredData() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	// Extract cookies to forward to the API (in case any endpoints are protected)
	const cookieStore = await cookies();
	const cookieHeader = cookieStore
		.getAll()
		.map((c) => `${c.name}=${c.value}`)
		.join("; ");

	const fetchOptions = {
		cache: "no-store" as RequestCache, // Optional: change to next: { revalidate: 3600 } in production
		headers: { Cookie: cookieHeader },
	};

	// Fetch all required data in parallel for maximum performance
	const [siteConfig, firmRes, officesRes] = await Promise.all([
		getSiteConfig(),
		fetch(`${baseUrl}/api/firm-detail`, fetchOptions).catch(() => null),
		fetch(`${baseUrl}/api/offices`, fetchOptions).catch(() => null),
	]);

	// Parse the responses
	const firmJson = firmRes?.ok ? await firmRes.json() : null;
	const firmData = firmJson?.data || {};

	const officesJson = officesRes?.ok ? await officesRes.json() : null;
	const officesData = officesJson?.data || [];

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
