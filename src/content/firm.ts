export const offices = [
  {
    city: "Abuja",
    address: ["Plot 319 Attahiru Jega Crescent", "Katampe Extension, Abuja, FCT"],
    image: "/images/offices/abuja.webp",
    imageAlt: "Abuja city gateway beneath a dramatic sky",
  },
  {
    city: "Lagos",
    address: ["5 Chief Ben Iwule Road", "Peace Estate, Lagos State"],
    image: "/images/offices/lagos.webp",
    imageAlt: "A landmark cable-stayed bridge in Lagos",
  },
] as const;

export const contact = {
  generalEmail: "info@rockandpaperlp.com",
  partnerEmail: "partners@rockandpaperlp.com",
  phones: ["+234 816 797 5442", "+234 813 272 0347", "+234 814 762 4946"],
  hours: "Monday–Friday, 8:00am–6:00pm",
  x: "https://x.com/rockandpaperlp",
} as const;
