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

export default async function HomePage() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	// 1. Fetch the experiences data on the server
	let experiences: Experience[] = [];
	let practices: Practice[] = [];
	let people: Person[] = [];
	let offices: Office[] = [];

	try {
		// Fetch both endpoints concurrently
		const [expRes, pracRes, peopleRes, officesRes] = await Promise.all([
			fetch(`${baseUrl}/api/experiences`, { next: { revalidate: 3600 } }),
			fetch(`${baseUrl}/api/practices`, { next: { revalidate: 3600 } }),
			fetch(`${baseUrl}/api/people`, { next: { revalidate: 3600 } }),
			fetch(`${baseUrl}/api/offices`, { next: { revalidate: 3600 } }),
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
	} catch (error) {
		console.error("Failed to fetch homepage data:", error);
	}

	return (
		<>
			<HeroSection />
			<FirmIntroductionSection />
			<PracticeAreasSection practices={practices} />

			{/* 2. Pass the fetched data to the component */}
			<SelectedExperienceSection experiences={experiences} />

			<TeamSection people={people} />
			<EthosSection />
			<OfficesSection offices={offices} />
			<ContactCtaSection />
		</>
	);
}
