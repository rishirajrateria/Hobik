/**
 * General FAQs, taken from the client's current site (valuetrustappraisalsinc.ca/faqs-4).
 * Lines starting with "- " render as a bullet list.
 */
export const faqs: { q: string; a: string }[] = [
  {
    q: "What is the difference between a home appraisal and a home evaluation?",
    a: `You may be wondering why you have to pay for a home appraisal when many realtors or companies offer free home evaluations, also known as a Comparative Market Analysis (CMA). The key difference lies in who conducts it and how the value is determined:
- Home Evaluation (CMA): Completed by a real estate agent, usually as part of a marketing effort to gain your business. A CMA provides a broad market estimate, for example $750,000 to $950,000.
- Home Appraisal: Conducted by a certified, independent appraiser with no vested interest. An appraisal gives you a specific, unbiased value, for example $900,000. The report is highly detailed, clearly stating the purpose, method, and conclusion of value.
Appraisals are required in scenarios where a formal valuation is necessary, such as securing a mortgage, dealing with the CRA, or resolving legal disputes. Financial institutions, courts, and government bodies do not accept a realtor's CMA as a substitute for a certified appraisal.`,
  },
  {
    q: "What are the main purposes of a home appraisal?",
    a: `A certified appraisal can be used for many different purposes, including but not limited to:
- (Re)financing a property
- Buying or selling (including both private and public transactions)
- Due diligence for renovations or rebuilds, helping you estimate future market value
- Capital gains calculations for the Canada Revenue Agency (CRA)
- Insurance claims related to fire, flooding, or natural disasters
- Appeals against property assessments (e.g., MPAC) to reduce property taxes
- Family matters, such as inheritance divisions or divorce settlements
- Expropriation cases, ensuring fair compensation if the government takes or affects your property`,
  },
  {
    q: "Do I need to clean up before an appraisal?",
    a: `While personal property and cleanliness do not impact market value, it is important that:
- The appraiser has full access to all areas of the home
- The home is not overly cluttered, so the condition of floors, walls, and fixtures can be properly photographed and assessed for the lender
Remember, appraisers are not judging your housekeeping. They just need to clearly observe the property's condition.`,
  },
  {
    q: "What's the difference between the AACI and CRA designations?",
    a: `Appraisers designated by the Appraisal Institute of Canada (AIC) hold either:
- AACI (Accredited Appraiser Canadian Institute): Qualified to appraise both commercial and residential properties.
- CRA (Canadian Residential Appraiser): Specializes exclusively in residential property appraisals.
Both are highly qualified, but the AACI designation covers a broader scope of property types.`,
  },
  {
    q: "Where are you located and what areas do you serve?",
    a: `We're proudly based in Toronto, serving the Greater Toronto Area (GTA) and surrounding regions. That said, we often assist clients across Southern Ontario.
If you're unsure whether we cover your area, feel free to reach out. We're just a phone call or email away, and we'd be happy to provide a quote.`,
  },
  {
    q: "What payment methods do you take?",
    a: "We accept cash, e-transfer, debit, and all major credit cards for appraisal services. A 2.9% processing fee applies to debit and credit card payments.",
  },
];

/** Plain-text version of an answer, for schema and llms.txt. */
export const faqText = (a: string) => a.replace(/\n- /g, "\n• ");
