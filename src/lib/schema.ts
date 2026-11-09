import { site, absUrl } from "./site";
import { areas } from "./areas";
import type { Service } from "./services";

const orgId = absUrl("/#business");
const websiteId = absUrl("/#website");

const days = (d: string[]) => d.map((x) => `https://schema.org/${x}`);

export function businessSchema() {
  const reviews = site.reviews;
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": orgId,
    name: site.name,
    alternateName: site.brand,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    logo: absUrl("/icon.svg"),
    image: absUrl("/opengraph-image"),
    telephone: site.phoneE164,
    email: site.email,
    priceRange: site.priceRange,
    foundingDate: site.founded,
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
      { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
      { "@type": "AdministrativeArea", name: "Southern Ontario" },
    ],
    knowsAbout: [
      "Residential real estate appraisal",
      "Retrospective appraisal",
      "Estate and probate valuation",
      "Matrimonial home valuation",
      "MPAC property tax assessment appeals",
      "CRA capital gains valuation",
      "CUSPAP",
    ],
    memberOf: { "@type": "Organization", name: "Appraisal Institute of Canada", url: "https://www.aicanada.ca" },
    sameAs: site.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneE164,
      contactType: "customer service",
      areaServed: "CA-ON",
      availableLanguage: ["English"],
    },
    ...(reviews.length
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
            reviewCount: reviews.length,
          },
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
    areaServed: areaName ? { "@type": "City", name: `${areaName}, Ontario` } : { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
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

export function articleSchema(a: { title: string; description: string; path: string; updated: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    dateModified: a.updated,
    datePublished: a.updated,
    author: { "@id": orgId },
    publisher: { "@id": orgId },
    mainEntityOfPage: absUrl(a.path),
    image: absUrl("/opengraph-image"),
    inLanguage: "en-CA",
  };
}
