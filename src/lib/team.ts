/** The team, as listed on the client's current About page. */
export type Member = {
  slug: string;
  name: string;
  credentials?: string;
  title: string;
  photo: string;
  languages: string[];
  bio: string[];
};

export const team: Member[] = [
  {
    slug: "hobikh-baleswaran",
    name: "Hobikh Baleswaran",
    credentials: "P. App., AACI",
    title: "Founder & CEO",
    photo: "/team/hobikh.jpg",
    languages: ["English", "Tamil"],
    bio: [
      "With over 10 years of experience in real estate valuation, property taxation, and assessment, Hobikh is an AACI-designated appraiser committed to delivering precise, data-driven insights.",
      "His expertise spans a diverse range of property types, including residential, commercial, and industrial real estate, ensuring accurate valuations that support sound decision-making.",
    ],
  },
  {
    slug: "ramin-noushinfar",
    name: "Ramin Noushinfar",
    title: "Candidate Member, AIC",
    photo: "/team/ramin.jpg",
    languages: ["English", "Persian"],
    bio: [
      "With almost a decade of experience as a Sales Representative with the Toronto Regional Real Estate Board, Ramin brings a strong real estate foundation to his valuation work, offering practical, on-the-ground insight into market activity and property value drivers.",
      "His academic background, a Bachelor of Environmental Studies in Urban Planning from York University alongside Civil Engineering Technology from Seneca Polytechnic, rounds out a well-grounded, analytical approach to appraisals.",
    ],
  },
  {
    slug: "mahir-chaudhry",
    name: "Mahir Chaudhry",
    title: "Candidate Member, AIC",
    photo: "/team/mahir.jpg",
    languages: ["English", "Urdu"],
    bio: [
      "With an academic background in Real Property Administration (Assessment & Appraisal) from Seneca Polytechnic and ongoing studies at York University, Mahir brings a strong foundation in real estate valuation, property assessment, and taxation.",
      "His understanding of real estate markets, combined with an analytical and entrepreneurial mindset, supports a practical, data-driven approach to property valuation. Mahir is passionate about leveraging technology and innovative solutions to enhance the efficiency, accessibility, and reliability of appraisal services.",
    ],
  },
];

export const getMember = (slug: string) => team.find((m) => m.slug === slug);
