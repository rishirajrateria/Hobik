import type { FormField } from "@/db/constants";
import { propertyTypes, serviceUses } from "./services";

/** "What is it for?" options, following the client's service lines. */
export const serviceOptions = ["Mortgage financing", ...serviceUses.map((s) => s.name), "Advisory & consulting (buying, selling, portfolio)", "Other / not sure"];
export const propertyOptions = [...propertyTypes.map((s) => s.name), "Not sure"];

export type FormConfig = {
  id: string;
  slug: string;
  name: string;
  title: string;
  subtitle: string | null;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  style: "card" | "steps";
  fields: FormField[];
};

export const defaultQuoteForm: FormConfig = {
  id: "default-quote",
  slug: "quote",
  name: "Quote request (site-wide)",
  title: "Request a quote",
  subtitle: "No obligation",
  submitLabel: "Request My Quote",
  successTitle: "Request received!",
  successMessage: "We'll call you shortly with your quote.",
  style: "card",
  fields: [
    { id: "f-name", key: "name", type: "text", label: "Full name", placeholder: "Full name", required: true, width: "half" },
    { id: "f-phone", key: "phone", type: "tel", label: "Phone", placeholder: "Phone", required: true, width: "half" },
    { id: "f-email", key: "email", type: "email", label: "Email", placeholder: "Email (optional)", required: false, width: "half" },
    { id: "f-address", key: "address", type: "text", label: "Property address or city", placeholder: "Property address or city", required: true, width: "half" },
    { id: "f-ptype", key: "property_type", type: "select", label: "Property type", placeholder: "Property type", required: true, options: propertyOptions, width: "half" },
    { id: "f-service", key: "service", type: "select", label: "What is the appraisal for?", placeholder: "What is the appraisal for?", required: true, options: serviceOptions, width: "half" },
    { id: "f-message", key: "message", type: "textarea", label: "Details", placeholder: "Property type, deadline, anything else (optional)", required: false, width: "full" },
  ],
};

export const defaultBookingForm: FormConfig = {
  id: "default-book",
  slug: "book-appraisal",
  name: "Appraisal questionnaire (multi-step)",
  title: "Book your appraisal",
  subtitle: "A few quick questions, about 60 seconds",
  submitLabel: "Send My Request",
  successTitle: "You're all set!",
  successMessage: "An appraiser will contact you to confirm your fee and inspection time.",
  style: "steps",
  fields: [
    { id: "b-service", key: "service", type: "radio", label: "What do you need the appraisal for?", required: true, options: serviceOptions, width: "full" },
    { id: "b-type", key: "property_type", type: "radio", label: "What type of property is it?", required: true, options: propertyOptions, width: "full" },
    { id: "b-when", key: "timeline", type: "radio", label: "When do you need the report?", required: true, options: ["As soon as possible", "Within a week", "Within a month", "Just planning ahead"], width: "full" },
    { id: "b-address", key: "address", type: "text", label: "Where is the property?", placeholder: "Street address or city", required: true, width: "full" },
    { id: "b-name", key: "name", type: "text", label: "Your name", placeholder: "Full name", required: true, width: "full" },
    { id: "b-phone", key: "phone", type: "tel", label: "Best phone number", placeholder: "(647) 555-0123", required: true, width: "half" },
    { id: "b-email", key: "email", type: "email", label: "Email", placeholder: "you@example.com", required: false, width: "half" },
  ],
};
