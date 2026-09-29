import type { Metadata } from "next";
import { cookies } from "next/headers";

export const defaultSiteConfig = {
	name: "Rock & Paper LP",
	shortName: "Rock & Paper LP",
	url: "https://rockandpaperlp.com",
	locale: "en_NG",
	description:
		"A Nigerian full-service law firm advising businesses, investors, institutions and individuals across transactions, disputes and regulation.",
	socialDescription: "Clear legal thinking for complex business decisions.",
	ogImage: "/opengraph-image",
	twitterImage: "/twitter-image",
} as const;

type PageMetadataInput = {
	title: string;
	description?: string;
	path: string;
};

// Fetch via API route instead of Prisma
export async function getSiteConfig() {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

		// Await and extract the cookies from the incoming request
		const cookieStore = await cookies();
		const cookieHeader = cookieStore
			.getAll()
			.map((c) => `${c.name}=${c.value}`)
			.join("; ");

		// Manually attach them to the headers
		const res = await fetch(`${baseUrl}/api/site-config`, {
			cache: "no-store",
			headers: {
				Cookie: cookieHeader,
			},
		});

		if (res.ok) {
			const json = await res.json();
			if (json.data) return json.data;
		}
	} catch (error) {
		console.error("Failed to fetch site config for metadata:", error);
	}

	// Fallback to default if API fails
	return defaultSiteConfig;
}

export async function createPageMetadata({
	title,
	description,
	path,
}: PageMetadataInput): Promise<Metadata> {
	// 1. Fetch live config from your API endpoint
	const config = await getSiteConfig();

	// 2. Use page-specific description or fall back to the global SEO description
	const finalDescription = description || config.description;

	return {
		title,
		description: finalDescription,
		alternates: {
			canonical: path,
		},
		openGraph: {
			title,
			description: finalDescription,
			url: path,
			siteName: config.name,
			locale: config.locale,
			type: "website",
			images: [
				{
					url: config.ogImage,
					width: 1200,
					height: 630,
					alt: `${config.name} — ${config.socialDescription}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: finalDescription,
			images: [config.twitterImage],
		},
	};
}
