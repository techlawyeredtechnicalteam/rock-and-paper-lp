import type { Metadata } from "next";
import { EB_Garamond, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StructuredData } from "@/components/seo/structured-data";
import { getSiteConfig } from "@/lib/seo"; // Importing our dynamic fetcher
import "../globals.css";
import QueryWrapper from "@/components/layout/query-wrapper";

const garamond = EB_Garamond({
	subsets: ["latin"],
	variable: "--font-garamond",
	display: "swap",
});

const manrope = Manrope({
	subsets: ["latin"],
	variable: "--font-manrope",
	display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
	// Fetch dynamic config from your API
	const config = await getSiteConfig();

	return {
		metadataBase: new URL(config.url),
		title: {
			default: `${config.name} | Commercial Legal Counsel`,
			template: `%s | ${config.shortName}`,
		},
		description: config.description,
		applicationName: config.name,
		authors: [{ name: config.name, url: config.url }],
		creator: config.name,
		publisher: config.name,
		category: "Legal services",
		keywords: [
			"Nigerian law firm",
			"commercial lawyers Nigeria",
			"energy law Nigeria",
			"banking and finance law",
			"dispute resolution Nigeria",
			"intellectual property lawyers Nigeria",
			"corporate law Nigeria",
			"regulatory compliance Nigeria",
			"telecommunications law Nigeria",
		],
		alternates: {
			canonical: "/",
		},
		formatDetection: {
			email: false,
			address: false,
			telephone: false,
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-image-preview": "large",
				"max-snippet": -1,
				"max-video-preview": -1,
			},
		},
		openGraph: {
			title: `${config.name} | Commercial Legal Counsel`,
			description: config.socialDescription,
			type: "website",
			url: "/",
			siteName: config.name,
			locale: config.locale,
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
			title: `${config.name} | Commercial Legal Counsel`,
			description: config.socialDescription,
			images: [config.twitterImage],
		},
	};
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${garamond.variable} ${manrope.variable}`}>
			<body>
				<QueryWrapper>
					<StructuredData />
					<SiteHeader />
					<main>{children}</main>
					<SiteFooter />
				</QueryWrapper>
			</body>
		</html>
	);
}
