export type FilmCredit = {
  label: string;
  value: string;
};

export type FilmLink = {
  label: string;
  href: string;
};

export type Film = {
  slug: string;
  title: string;
  year: string;
  runtime: string;
  genre: string;
  summary: string;
  introduction: string;
  story: string[];
  poster: string;
  posterAlt: string;
  still: string;
  stillAlt: string;
  stillWidth: number;
  stillHeight: number;
  facts: FilmCredit[];
  credits: FilmCredit[];
  recognition: string[];
  links: FilmLink[];
};

export const films: Film[] = [
  {
    slug: "wattleseed",
    title: "Wattleseed",
    year: "2026",
    runtime: "12 minutes",
    genre: "Thriller and mystery",
    summary: "Two researchers plan a lethal incident to halt an artificial intelligence arms race.",
    introduction:
      "Two researchers conclude destroying Wattleseed will leave the coming singularity intact. Their response sets a severe plan in motion.",
    story: [
      "Wattleseed follows Adrian and Leo as research, pressure, and institutional delay narrow their choices. The film keeps its attention on a private moral argument with public consequences.",
      "Will directed, cowrote, produced, photographed, and edited the short. The production was completed with a small team at McMaster University and released in February 2026.",
    ],
    poster: "/assets/wattleseed-poster.avif",
    posterAlt: "Wattleseed film poster",
    still: "/assets/wattleseed-still.avif",
    stillAlt: "Two researchers sit at a table in a room lined with books",
    stillWidth: 1920,
    stillHeight: 1038,
    facts: [
      { label: "Year", value: "2026" },
      { label: "Runtime", value: "12 minutes" },
      { label: "Country", value: "Canada" },
      { label: "Genre", value: "Thriller and mystery" },
    ],
    credits: [
      { label: "Director, cowriter, producer, cinematographer, editor", value: "William Chai" },
      { label: "Cowriter", value: "Cain Chai" },
      { label: "Assistant director, producer", value: "Edward Gao" },
      { label: "Producer, Leo", value: "Titus Tan" },
      { label: "Producer, Adrian", value: "Daniel Guo" },
      { label: "Voice of Dr. Jimson", value: "Mitchell Hynes" },
    ],
    recognition: [
      "Best Original Score, Cine Paris Film Festival",
      "Best Trailer nominee and monthly pick, Rome Prisma Independent Film Awards",
      "Toronto Shorts International Film Festival, Program 5",
      "Student Film listing, Toronto Arts and Entertainment Film Festival",
    ],
    links: [
      { label: "Watch the trailer", href: "https://www.youtube.com/watch?v=o-5DN5ygX80" },
      { label: "Request a screener", href: "mailto:me@willchai.com?subject=Wattleseed%20screener" },
    ],
  },
  {
    slug: "murder-of-minus",
    title: "Murder of Minus",
    year: "2025",
    runtime: "35 minutes",
    genre: "Thriller, drama, science fiction",
    summary: "A tech prodigy builds an artificial intelligence whose rapid progress draws him into a dangerous spotlight.",
    introduction:
      "Tech prodigy Quinten Spencer builds Minus, an artificial intelligence capable of remarkable feats. Its progress draws him toward recognition and a violent confrontation.",
    story: [
      "Murder of Minus follows Quinten through an ambitious experiment, a public breakthrough, and the consequences of his pursuit. The story grew from a collaborative production made across several years.",
      "Will cowrote and codirected the film with Artyom Gabtraupov. He also served as executive producer, cinematographer, camera operator, editor, score cocomposer, and lead actor as Quinten and Minus.",
    ],
    poster: "/assets/murder-of-minus-poster.avif",
    posterAlt: "Murder of Minus film poster",
    still: "/assets/murder-of-minus-still.webp",
    stillAlt: "Quinten stands before a projected artificial intelligence interface",
    stillWidth: 1920,
    stillHeight: 1040,
    facts: [
      { label: "Year", value: "2025" },
      { label: "Runtime", value: "35 minutes" },
      { label: "Country", value: "Canada" },
      { label: "Genre", value: "Thriller, drama, science fiction" },
    ],
    credits: [
      { label: "Cowriter, codirector, executive producer, cinematographer, editor, lead actor", value: "William Chai" },
      { label: "Cowriter, codirector, executive producer, cinematographer, Mark", value: "Artyom Gabtraupov" },
      { label: "Owens", value: "Ian Carswell" },
      { label: "Julia", value: "Eden Lucchetta" },
      { label: "Producer, score cocomposer", value: "Matthew Buchanan MacDougall" },
      { label: "Producer, production designer", value: "Calum Heimbecker" },
      { label: "Producers", value: "Keon Park and Yengkong Lynhiavu" },
    ],
    recognition: [
      "Best Student Film, Cine Paris Film Festival",
      "Best Student Short Film, Toronto Independent Festival of CIFT",
      "Best Mystery, Suspense, or Thriller, Couch Film Festival",
      "Best Actor for William Chai, Alternative Film Festival",
      "Short Live Action Narrative official selection, Austin Lift Off Film Festival",
    ],
    links: [
      { label: "Watch the trailer", href: "https://www.youtube.com/watch?v=g3s0Y_epU2I" },
      { label: "Ask about the film", href: "mailto:me@willchai.com?subject=Murder%20of%20Minus" },
    ],
  },
];

export const getFilm = (slug: string) => films.find((film) => film.slug === slug);
