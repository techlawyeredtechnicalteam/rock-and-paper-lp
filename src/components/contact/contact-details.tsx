import Image from "next/image";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";

export type Office = {
	id?: string;
	city: string;
	address: string[] | string;
	image?: string | null;
};

export type ContactInfo = {
	generalEmail: string;
	partnerEmail?: string;
	phones: string[];
	hours: string;
};

interface ContactDetailsProps {
	contact: ContactInfo;
	offices: Office[];
	// Add the CMS content prop
	content?: {
		eyebrow?: string | null;
		title?: string | null;
		description?: string | null;
	};
}

export function ContactDetails({
	contact,
	offices,
	content,
}: ContactDetailsProps) {
	return (
		<section className="py-20 sm:py-28">
			<Container>
				<div className="grid gap-12 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<p className="eyebrow text-taupe">
							{content?.eyebrow || "General enquiries"}
						</p>
						<h2 className="display-title mt-8 text-5xl text-ink sm:text-6xl">
							{content?.title || "Talk to the right person."}
						</h2>
						<p className="mt-7 max-w-sm text-sm leading-7 text-muted">
							{content?.description ||
								"For a new matter, send a short description and your preferred contact details. We will direct your enquiry appropriately."}
						</p>
					</div>
					<div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
						<div className="bg-paper p-8">
							<Mail className="size-5 text-taupe" strokeWidth={1.5} />
							<p className="eyebrow mt-10 text-ink/45">Email</p>
							<a
								href={`mailto:${contact?.generalEmail}`}
								className="mt-3 block font-serif text-2xl text-ink hover:text-taupe">
								{contact?.generalEmail || "hello@rockandpaperlp.com"}
							</a>
							{contact?.partnerEmail && (
								<a
									href={`mailto:${contact.partnerEmail}`}
									className="mt-2 block text-sm text-muted hover:text-taupe">
									{contact.partnerEmail}
								</a>
							)}
						</div>
						<div className="bg-paper p-8">
							<Phone className="size-5 text-taupe" strokeWidth={1.5} />
							<p className="eyebrow mt-10 text-ink/45">Telephone</p>
							<div className="mt-3 space-y-2">
								{(contact?.phones || []).map((phone) => (
									<a
										key={phone}
										href={`tel:${phone.replace(/\s/g, "")}`}
										className="block text-sm text-ink hover:text-taupe">
										{phone}
									</a>
								))}
							</div>
						</div>
						<div className="bg-paper p-8 sm:col-span-2">
							<Clock3 className="size-5 text-taupe" strokeWidth={1.5} />
							<p className="eyebrow mt-10 text-ink/45">Office hours</p>
							<p className="mt-3 font-serif text-2xl text-ink">
								{contact?.hours || "Mon - Fri, 9am - 5pm"}
							</p>
						</div>
					</div>
				</div>

				<div className="mt-20 grid gap-px bg-ink/10 sm:grid-cols-2">
					{(offices || []).map((office) => (
						<article
							key={office.city}
							className="group overflow-hidden bg-stone/40">
							<div className="relative aspect-[8/5] w-full overflow-hidden bg-navy">
								{office.image && (
									<Image
										src={office.image}
										alt={`${office.city} office`}
										fill
										sizes="(max-width: 640px) 100vw, 50vw"
										className="object-cover saturate-[0.75] transition duration-500 group-hover:scale-[1.035] group-hover:saturate-100"
									/>
								)}
							</div>
							<div className="p-8 sm:p-12">
								<MapPin className="size-5 text-taupe" strokeWidth={1.5} />
								<h2 className="mt-10 font-serif text-4xl text-ink">
									{office.city} office
								</h2>
								<address className="mt-5 text-base not-italic leading-8 text-muted">
									{Array.isArray(office.address)
										? office.address.map((line) => (
												<span key={line} className="block">
													{line}
												</span>
										  ))
										: String(office.address)
												.split("\n")
												.map((line) => (
													<span key={line} className="block">
														{line}
													</span>
												))}
								</address>
							</div>
						</article>
					))}
				</div>
			</Container>
		</section>
	);
}
