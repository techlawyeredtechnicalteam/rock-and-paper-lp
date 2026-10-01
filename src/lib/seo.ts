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

export type PageMetadataInput = {
	title: string;
	description?: string;
	path: string;
	ogImage?: string | null;
};

export async function getSiteConfig() {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

		const cookieStore = await cookies();
		const cookieHeader = cookieStore
			.getAll()
			.map((c) => `${c.name}=${c.value}`)
			.join("; ");

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

	return defaultSiteConfig;
}

export async function createPageMetadata({
	title,
	description,
	path,
	ogImage,
}: PageMetadataInput): Promise<Metadata> {
	const config = await getSiteConfig();

	const finalDescription = description || config.description;
	const finalOgImage = ogImage || config.ogImage;
	const finalTwitterImage = ogImage || config.twitterImage;

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
					url: finalOgImage,
					width: 1200,
					height: 630,
					alt: title || config.name,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: finalDescription,
			images: [finalTwitterImage],
		},
	};
}
