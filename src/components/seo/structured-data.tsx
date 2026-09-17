import { contact, offices } from "@/content/firm";
import { siteConfig } from "@/lib/seo";

export function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/brand/rock-and-paper-logo.png`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    description: siteConfig.description,
    email: contact.generalEmail,
    telephone: contact.phones[1],
    openingHours: "Mo-Fr 08:00-18:00",
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    address: offices.map((office) => ({
      "@type": "PostalAddress",
      addressLocality: office.city,
      streetAddress: office.address.join(", "),
      addressCountry: "NG",
    })),
    sameAs: [contact.x],
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
