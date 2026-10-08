import type { Metadata } from "next";
import { EB_Garamond, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import {
	SiteFooter,
	type FirmDetails,
	type Office,
} from "@/components/layout/site-footer";
import { StructuredData } from "@/components/seo/structured-data";
import { getSiteConfig } from "@/lib/seo"; // Importing our dynamic fetcher
import "../globals.css";
import QueryWrapper from "@/components/layout/query-wrapper";
import { contact as fallbackContact, offices as fallbackOffices } from "@/content/firm";
import "react-quill-new/dist/quill.snow.css";
import NextTopLoader from "nextjs-toploader";

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
		keywords: config.keywords || [
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

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	let offices: Office[] = fallbackOffices.map((office) => ({
		city: office.city,
		address: [...office.address],
	}));
	let firmDetails: FirmDetails = {
		generalEmail: fallbackContact.generalEmail,
		xUrl: fallbackContact.x,
	};

	try {
		const [officesRes, firmDetailRes] = await Promise.all([
			fetch(`${baseUrl}/api/offices`),
			fetch(`${baseUrl}/api/firm-detail`),
		]);

		if (officesRes.ok) {
			const json = await officesRes.json();
			offices = json.data || [];
		}

		if (firmDetailRes.ok) {
			const json = await firmDetailRes.json();
			firmDetails = { ...firmDetails, ...(json.data || {}) };
		}
	} catch (error) {
		console.error("Failed to fetch homepage data:", error);
	}

	return (
		<html lang="en" className={`${garamond.variable} ${manrope.variable}`}>
			<body>
				<NextTopLoader
					color="#1d2d4e"
					shadow="0 0 10px #1d2d4e,0 0 5px #1d2d4e"
				/>
				<QueryWrapper>
					<StructuredData />
					<SiteHeader contact={{ x: firmDetails.xUrl }} />
					<main>{children}</main>
					<SiteFooter offices={offices} firmDetails={firmDetails} />
				</QueryWrapper>
			</body>
		</html>
	);
}
