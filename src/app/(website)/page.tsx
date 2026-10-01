import { HeroSection } from "@/components/home/hero-section";
import { FirmIntroductionSection } from "@/components/home/firm-introduction-section";
import {
	Practice,
	PracticeAreasSection,
} from "@/components/home/practice-areas-section";
import {
	Experience,
	SelectedExperienceSection,
} from "@/components/home/selected-experience-section";
import { Person, TeamSection } from "@/components/home/team-section";
import { EthosSection } from "@/components/home/ethos-section";
import { Office, OfficesSection } from "@/components/home/offices-section";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { PageSection } from "@/generated/prisma/client";
import { createPageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
	let seo: any = {};

	try {
		const res = await fetch(`${baseUrl}/api/page-seo?page=home`, {
			next: { revalidate: 3600 },
		});
		if (res.ok) {
			const json = await res.json();
			seo = json.data || {};
		}
	} catch (error) {
		console.error("Failed to fetch home page SEO:", error);
	}

	return await createPageMetadata({
		title: seo.title || undefined,
		description: seo.description || undefined,
		ogImage: seo.ogImage || undefined,
		path: "/",
	});
}

export default async function HomePage() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	let experiences: Experience[] = [];
	let practices: Practice[] = [];
	let people: Person[] = [];
	let offices: Office[] = [];
	let contents: PageSection[] = [];

	try {
		const [expRes, pracRes, peopleRes, officesRes, contentRes] =
			await Promise.all([
				fetch(`${baseUrl}/api/experiences`),
				fetch(`${baseUrl}/api/practices`),
				fetch(`${baseUrl}/api/people`),
				fetch(`${baseUrl}/api/offices`),
				fetch(`${baseUrl}/api/page-content?page=home`),
			]);

		if (expRes.ok) {
			const json = await expRes.json();
			experiences = json.data || [];
		}
		if (pracRes.ok) {
			const json = await pracRes.json();
			practices = json.data || [];
		}
		if (peopleRes.ok) {
			const json = await peopleRes.json();
			people = json.data || [];
		}
		if (officesRes.ok) {
			const json = await officesRes.json();
			offices = json.data || [];
		}
		if (contentRes.ok) {
			const json = await contentRes.json();
			contents = json.data || [];
		}
	} catch (error) {
		console.error("Failed to fetch homepage data:", error);
	}

	const content = contents.reduce((acc: any, section: any) => {
		acc[section.sectionKey] = section;
		return acc;
	}, {});

	return (
		<>
			<HeroSection content={content["hero"]} />
			<FirmIntroductionSection content={content["firm-intro"]} />
			<PracticeAreasSection
				practices={practices}
				content={content["expertise"]}
			/>

			<SelectedExperienceSection
				content={content["selected-experience"]}
				experiences={experiences}
			/>

			<TeamSection content={content["team"]} people={people} />
			<EthosSection content={content["ethos"]} />
			<OfficesSection content={content["offices"]} offices={offices} />
			<ContactCtaSection />
		</>
	);
}
