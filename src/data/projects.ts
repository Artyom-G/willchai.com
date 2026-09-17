export type ProjectCredit = {
  label: string;
  value: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  primaryHref: string;
  title: string;
  period: string;
  form: string;
  status: string;
  summary: string;
  introduction: string;
  story: string[];
  image: string;
  imageAlt: string;
  imageClass?: string;
  facts: ProjectCredit[];
  credits: ProjectCredit[];
  links: ProjectLink[];
  secondaryImage?: string;
  secondaryImageAlt?: string;
  secondaryImageWidth?: number;
  secondaryImageHeight?: number;
};

export const projects: Project[] = [
  {
    slug: "medterms",
    primaryHref: "https://medterms.willchai.com/",
    title: "Medical Terminology Games",
    period: "2025 to present",
    form: "Learning game collection",
    status: "Public release 1.0.3",
    summary: "Six free browser games for practising how medical words are built.",
    introduction:
      "MedTerms Games gives classrooms, study groups, and curious learners familiar ways to practise morphemes, combining forms, and medical word building.",
    story: [
      "The collection includes Splice, One, Meds Up, Cipher, Ideosis, and Those Who Know. Each game adapts a familiar social format for medical terminology practice, with online rooms and a pass the phone mode.",
      "The work grew through a nine unit project in McMaster University’s Honours Health Sciences Program. Will created and developed the collection with Dr. Stephen Russell as co creator and academic collaborator.",
    ],
    image: "/assets/medterms-creators.webp",
    imageAlt: "An illustrated portrait of William Chai and Dr. Stephen Russell for MedTerms Games",
    facts: [
      { label: "Games", value: "Six" },
      { label: "Modes", value: "Online rooms and pass the phone" },
      { label: "Build", value: "React, Vite, Tailwind CSS, WebSockets, Express, and Railway" },
    ],
    credits: [
      { label: "Creator and developer", value: "William Chai" },
      { label: "Co creator and academic collaborator", value: "Dr. Stephen Russell" },
    ],
    links: [
      { label: "Play MedTerms Games", href: "https://medterms.willchai.com/" },
      { label: "Read the game rules", href: "https://medterms.willchai.com/rules/splice" },
    ],
    secondaryImage: "/assets/medterms-ideosis.avif",
    secondaryImageAlt: "Ideosis title artwork from the MedTerms Games collection",
    secondaryImageWidth: 900,
    secondaryImageHeight: 900,
  },
  {
    slug: "tachyboard",
    primaryHref: "https://tachyboard.willchai.com/",
    title: "Tachyboard",
    period: "2026 to present",
    form: "Typing practice and analysis",
    status: "Public release 1.1",
    summary: "Typing practice informed by keystroke timing and recurring errors.",
    introduction:
      "Tachyboard analyses speed, accuracy and fluency across typing sessions, then helps each person choose focused practice.",
    story: [
      "Keystroke timing can reveal repeated pauses, difficult transitions and corrections. Tachyboard brings these patterns into a practice history with a skill map and personal recommendations.",
      "Coach assembles guided practice from the available evidence. Endless adapts as someone types, while custom drills, quotes and timed sessions provide other ways to practise.",
    ],
    image: "/assets/projects-v3/hands-poster.webp",
    imageAlt: "Tachyboard’s optional hand guide above its keyboard",
    facts: [
      { label: "Purpose", value: "Typing practice and keystroke analysis" },
      { label: "Practice", value: "Coach, Endless, custom drills and timed sessions" },
      { label: "Account", value: "Optional" },
    ],
    credits: [{ label: "Created by", value: "Will Chai" }],
    links: [{ label: "Open Tachyboard", href: "https://tachyboard.willchai.com/" }],
  },
  {
    slug: "searing-stories",
    primaryHref: "https://searingstories.com/",
    title: "Searing Stories",
    period: "2026 to present",
    form: "Magazine and web series",
    status: "Volume one",
    summary: "Candid stories served over a home cooked dinner.",
    introduction:
      "Searing Stories brings a guest to the table for a home cooked meal, a recorded conversation, and an editorial feature shaped through writing and photography.",
    story: [
      "Each issue starts in a domestic setting. The guest arrives for dinner, the conversation unfolds around the meal, and the final feature keeps the detail and ease of an evening shared in person.",
      "Volume one opened with Felipe Hoffa in Art Machine, a conversation about film, improv, technology and the judgments involved in making things.",
    ],
    image: "/assets/searing-stories.avif",
    imageAlt: "A candlelit meal being served for Searing Stories",
    facts: [
      { label: "Format", value: "Online magazine and web series" },
      { label: "Current volume", value: "Volume one" },
      { label: "First guest", value: "Felipe Hoffa" },
    ],
    credits: [
      { label: "Co host, photographer, editor", value: "Will Chai" },
      { label: "Co host, head chef", value: "Edward Gao" },
    ],
    links: [
      { label: "Visit Searing Stories", href: "https://searingstories.com/" },
      {
        label: "Read Art Machine",
        href: "https://searingstories.com/vol1/felipehoffa",
      },
    ],
    secondaryImage: "/assets/searing-hosts.avif",
    secondaryImageAlt: "Will Chai and Edward Gao, the hosts of Searing Stories",
    secondaryImageWidth: 800,
    secondaryImageHeight: 600,
  },
  {
    slug: "conspirasea",
    primaryHref: "https://www.conspirasea.top/",
    title: "ConspiraSea",
    period: "2023 to present",
    form: "Online social deduction game",
    status: "Release 1.0",
    summary: "A free online social deduction game set beneath the surface.",
    introduction:
      "ConspiraSea began as a tabletop game and became a real time online game with the complete base set and Hadal expansion.",
    story: [
      "Will conceived the tabletop game in 2023 and drew its characters and visual world in Procreate. A physical edition asked for hundreds of pieces, so the project moved online and gained a room based multiplayer system.",
      "Release 1.0 includes 32 custom roles, session recovery, and play for groups of friends. The game runs free of charge, with direct room entry and a compact set of rules for each role.",
    ],
    image: "/assets/conspirasea-frontpage.webp",
    imageAlt: "Illustrated sea creatures from the ConspiraSea game",
    facts: [
      { label: "Players", value: "5 to 16" },
      { label: "Release", value: "Base game and Hadal expansion" },
      { label: "Build", value: "React, TypeScript, Node.js, and Railway" },
    ],
    credits: [
      { label: "Concept, artwork, rules, development", value: "Will Chai" },
      { label: "Role mechanics", value: "Yengkong Lynhiavu" },
      { label: "Node.js support", value: "Artyom Gabtraupov" },
    ],
    links: [{ label: "Play ConspiraSea Online", href: "https://www.conspirasea.top/" }],
    secondaryImage: "/assets/conspirasea-logo.jpg",
    secondaryImageAlt: "ConspiraSea illustrated title artwork",
    secondaryImageWidth: 1555,
    secondaryImageHeight: 500,
  },
];

export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);
