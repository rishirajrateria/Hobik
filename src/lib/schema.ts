import { site, absUrl } from "./site";
import { areas } from "./areas";
import type { Service } from "./services";
import type { Testimonial } from "@/db/schema";

const orgId = absUrl("/#business");
const websiteId = absUrl("/#website");

const days = (d: string[]) => d.map((x) => `https://schema.org/${x}`);

export function businessSchema(testimonials: Testimonial[] = []) {
  const reviews = testimonials.map((t) => ({ author: t.name, rating: t.rating, text: t.body, date: t.createdAt.toISOString().slice(0, 10) }));
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": orgId,
    name: site.name,
    alternateName: site.brand,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    logo: absUrl("/brand/value-trust-logo.png"),
    image: absUrl("/opengraph-image"),
    telephone: site.phoneE164,
    email: site.email,
    priceRange: site.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days(h.days),
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: [
      ...areas.map((a) => ({ "@type": "City", name: `${a.name}, Ontario` })),
      { "@type": "AdministrativeArea", name: "Greater Toronto and Hamilton Area" },
      { "@type": "AdministrativeArea", name: "Southern Ontario" },
    ],
    knowsAbout: [
      "Residential real estate appraisal",
      "Multi-residential appraisal",
      "Commercial real estate appraisal",
      "Industrial property appraisal",
      "Agricultural and farm appraisal",
      "Institutional property appraisal",
      "Mortgage financing appraisal",
      "Retrospective appraisal",
      "Estate valuation",
      "Matrimonial property valuation",
      "Property assessment appeals",
      "Expropriation valuation",
      "Real estate advisory and consulting",
      "CUSPAP",
    ],
    memberOf: { "@type": "Organization", name: "Appraisal Institute of Canada", url: "https://www.aicanada.ca" },
    founder: { "@type": "Person", name: "Hobikh Baleswaran", honorificSuffix: "P. App., AACI", jobTitle: "Founder & CEO", url: absUrl("/team/hobikh-baleswaran") },
    slogan: site.slogan,
    sameAs: site.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneE164,
      contactType: "customer service",
      areaServed: "CA-ON",
      availableLanguage: ["English", "Tamil", "Persian", "Urdu"],
    },
    ...(reviews.length
      ? {
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.text,
            datePublished: r.date,
          })),
        }
      : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: site.url,
    name: site.brand,
    publisher: { "@id": orgId },
    inLanguage: "en-CA",
  };
}

export function serviceSchema(s: Service, areaName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: areaName ? `${s.name} in ${areaName}` : s.name,
    serviceType: s.name,
    description: s.answer,
    provider: { "@id": orgId },
    areaServed: areaName ? { "@type": "City", name: `${areaName}, Ontario` } : { "@type": "AdministrativeArea", name: "Southern Ontario" },
    url: absUrl(`/services/${s.slug}`),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

export function articleSchema(a: { title: string; description: string; path: string; updated: string; published?: string; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    dateModified: a.updated,
    datePublished: a.published ?? a.updated,
    author: { "@id": orgId },
    publisher: { "@id": orgId },
    mainEntityOfPage: absUrl(a.path),
    image: a.image ?? absUrl("/opengraph-image"),
    inLanguage: "en-CA",
  };
}
