import type { FormField } from "@/db/constants";
import { services } from "./services";

const serviceOptions = [...services.map((s) => s.name), "Other / not sure"];

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
  title: "Get your appraisal quote",
  subtitle: "Free · No obligation",
  submitLabel: "Get My Free Quote",
  successTitle: "Request received!",
  successMessage: "We'll call you shortly with your quote.",
  style: "card",
  fields: [
    { id: "f-name", key: "name", type: "text", label: "Full name", placeholder: "Full name", required: true, width: "half" },
    { id: "f-phone", key: "phone", type: "tel", label: "Phone", placeholder: "Phone", required: true, width: "half" },
    { id: "f-email", key: "email", type: "email", label: "Email", placeholder: "Email (optional)", required: false, width: "half" },
    { id: "f-address", key: "address", type: "text", label: "Property address or city", placeholder: "Property address or city", required: true, width: "half" },
    { id: "f-service", key: "service", type: "select", label: "What is the appraisal for?", placeholder: "What is the appraisal for?", required: true, options: serviceOptions, width: "full" },
    { id: "f-message", key: "message", type: "textarea", label: "Details", placeholder: "Property type, deadline, anything else (optional)", required: false, width: "full" },
  ],
};

export const defaultBookingForm: FormConfig = {
  id: "default-book",
  slug: "book-appraisal",
  name: "Appraisal questionnaire (multi-step)",
  title: "Book your appraisal",
  subtitle: "Answer a few quick questions — takes 60 seconds",
  submitLabel: "Send My Request",
  successTitle: "You're all set!",
  successMessage: "An appraiser will contact you to confirm your fee and inspection time.",
  style: "steps",
  fields: [
    { id: "b-service", key: "service", type: "radio", label: "What do you need the appraisal for?", required: true, options: serviceOptions, width: "full" },
    { id: "b-type", key: "property_type", type: "radio", label: "What type of property is it?", required: true, options: ["Detached house", "Semi-detached", "Townhouse", "Condo apartment", "Multiplex / income property", "Other"], width: "full" },
    { id: "b-when", key: "timeline", type: "radio", label: "When do you need the report?", required: true, options: ["ASAP / rush", "Within a week", "Within a month", "Just planning ahead"], width: "full" },
    { id: "b-address", key: "address", type: "text", label: "Where is the property?", placeholder: "Street address or city", required: true, width: "full" },
    { id: "b-name", key: "name", type: "text", label: "Your name", placeholder: "Full name", required: true, width: "full" },
    { id: "b-phone", key: "phone", type: "tel", label: "Best phone number", placeholder: "(416) 555-0123", required: true, width: "half" },
    { id: "b-email", key: "email", type: "email", label: "Email", placeholder: "you@example.com", required: false, width: "half" },
  ],
};
