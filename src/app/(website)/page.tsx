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
import { people as fallbackPeople } from "@/content/people";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	let seo: any = {};

	try {
		const record = await prisma.pageSeo.findUnique({
			where: { pageSlug: "home" },
		});
		if (record) seo = record;
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
	let experiences: Experience[] = [];
	let practices: Practice[] = [];
	let people: Person[] = fallbackPeople;
	let offices: Office[] = [];
	let contents: PageSection[] = [];

	try {
		const [dbExperiences, dbPractices, dbPeople, dbOffices, dbContents] =
			await Promise.all([
				prisma.experience.findMany({ orderBy: { createdAt: "desc" } }),
				prisma.practice.findMany({ orderBy: { title: "asc" } }),
				prisma.person.findMany({ orderBy: { order: "asc" } }),
				prisma.office.findMany({ orderBy: { createdAt: "asc" } }),
				prisma.pageSection.findMany({ where: { pageSlug: "home" } }),
			]);

		experiences = dbExperiences;
		practices = dbPractices;
		if (dbPeople.length > 0) people = dbPeople;
		offices = dbOffices;
		contents = dbContents;
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
