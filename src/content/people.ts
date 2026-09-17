export type Person = {
  slug: string;
  name: string;
  expertise: string[];
  image: string;
  imagePosition?: string;
  bio: string[];
};

export const people: Person[] = [
  {
    slug: "sulaimon-a-badmus",
    name: "Sulaimon A. Badmus",
    expertise: ["Energy", "Banking & Finance", "Dispute Resolution"],
    image: "/images/team/sulaimon-badmus.jpg",
    bio: [
      "Sulaimon A. Badmus previously worked as an Associate at a leading firm in Ikoyi, Lagos, with experience in energy law, banking and finance, and dispute resolution. He holds a First-Class Degree from the Nigerian Law School, an LL.B. from Lagos State University and an LL.M. from the Geneva Academy in Geneva, Switzerland.",
      "He has received several academic and professional awards and has contributed to the Nigerian Bar Association through roles focused on international legal exchange and continuing legal education.",
    ],
  },
  {
    slug: "gideon-sado",
    name: "Gideon Sado",
    expertise: ["Energy", "Corporate Advisory", "Infrastructure"],
    image: "/images/team/gideon-sado.jpg",
    bio: [
      "Gideon Sado holds an Executive Master's in Business Administration from Nile University of Nigeria. He has advised oil and gas companies on Nigeria's upstream, midstream and downstream licensing regimes and led a team that guided an applicant through the Midstream and Downstream Gas Infrastructure Fund funding rounds.",
      "He acts as Company Secretary to a number of businesses and advises companies operating across gas infrastructure and gas-to-power projects.",
    ],
  },
  {
    slug: "gesiye-emi-emiemokumo",
    name: "Gesiye-emi Emiemokumo",
    expertise: ["Intellectual Property", "Technology", "Dispute Resolution"],
    image: "/images/team/gesiye-emi-emiemokumo.jpg",
    bio: [
      "Gesiye-emi Emiemokumo is a lawyer with experience across intellectual property, dispute resolution, corporate and commercial law, technology, media and regulatory compliance.",
      "He previously worked at G Elias on contentious and non-contentious matters for local and international clients. His practice includes trademarks, copyright, IP commercialisation, licensing, brand protection, commercial disputes, competition, consumer protection, technology and data-related issues.",
      "Gesiye-emi has been recognised as an IP Legal Rising Star in Nigeria by My Intellectual Property Law Guide and previously served as a WIPO Ambassador.",
    ],
  },
];

export const getPerson = (slug: string) =>
  people.find((person) => person.slug === slug);
