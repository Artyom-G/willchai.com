export type FilmCredit = {
  label: string;
  value: string;
};

export type FilmLink = {
  label: string;
  href: string;
};

export type FilmImage = {
  src: string;
  alt: string;
  srcSet?: string;
  width: number;
  height: number;
};

export type Film = {
  slug: string;
  title: string;
  directorLine: string;
  year: string;
  runtime: string;
  genre: string;
  summary: string;
  introduction: string;
  story: string[];
  poster: string;
  posterAlt: string;
  posterWidth: number;
  posterHeight: number;
  still: string;
  stillAlt: string;
  stillSrcSet?: string;
  stillWidth: number;
  stillHeight: number;
  gallery?: FilmImage[];
  facts: FilmCredit[];
  credits: FilmCredit[];
  recognition: string[];
  links: FilmLink[];
};

export const films: Film[] = [
  {
    slug: "wattleseed",
    title: "Wattleseed",
    directorLine: "Directed by Will Chai",
    year: "2026",
    runtime: "12 minutes",
    genre: "Thriller and mystery",
    summary: "Two researchers plan a lethal incident to halt an artificial intelligence arms race.",
    introduction:
      "Two researchers devise a plan to stage a lethal incident and halt an artificial intelligence arms race. Each has a different understanding of the risks involved.",
    story: [
      "We filmed at McMaster University, including the Mueller History of Health and Medicine Room. The apparatus on screen brought together a control board, fishing equipment and raw aluminum prisms from the team’s hobbies.",
      "I directed Wattleseed and wrote it with Cain Chai. Our team came together from Health Sciences, Computer Science and iBioMed. We released the film in February 2026.",
    ],
    poster: "/assets/films/wattleseed/poster-800.avif",
    posterAlt: "Wattleseed film poster",
    posterWidth: 800,
    posterHeight: 1104,
    still: "/assets/films/wattleseed/cover-1920.avif",
    stillSrcSet: "/assets/films/wattleseed/cover-640.avif 640w, /assets/films/wattleseed/cover-1280.avif 1280w, /assets/films/wattleseed/cover-1920.avif 1920w",
    stillAlt: "A researcher in a plaid shirt leans across a table in a library",
    stillWidth: 1920,
    stillHeight: 1038,
    gallery: [
      { src: "/assets/films/wattleseed/apparatus-1280.avif", srcSet: "/assets/films/wattleseed/apparatus-640.avif 640w, /assets/films/wattleseed/apparatus-1280.avif 1280w", alt: "A curved microphone and wooden speaker apparatus on a table", width: 1280, height: 692 },
      { src: "/assets/films/wattleseed/profile-1280.avif", srcSet: "/assets/films/wattleseed/profile-640.avif 640w, /assets/films/wattleseed/profile-1280.avif 1280w", alt: "A researcher wearing glasses in profile against library shelves", width: 1280, height: 692 },
    ],
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
      { label: "Press kit (PDF)", href: "/assets/films/wattleseed/press-kit.pdf" },
    ],
  },
  {
    slug: "murder-of-minus",
    title: "Murder of Minus",
    directorLine: "Directed by Will Chai and Artyom Gabtraupov",
    year: "2025",
    runtime: "35 minutes",
    genre: "Thriller, drama, science fiction",
    summary: "A tech prodigy builds an artificial intelligence whose rapid progress draws him into a dangerous spotlight.",
    introduction:
      "Tech prodigy Quinten Spencer builds Minus, an artificial intelligence capable of remarkable feats. Its progress draws him toward recognition and a violent confrontation.",
    story: [
      "I started Murder of Minus in high school in November 2021. Artyom Gabtraupov and I wrote and directed it together, filming mostly around Kitchener and Waterloo. We finished postproduction in January 2025.",
      "Friends joined the cast and crew, and I played both Quinten and Minus. At one point, we filmed a scene for three characters with two people on set, sharing the acting, directing and camera work.",
    ],
    poster: "/assets/films/murder-of-minus/poster-800.avif",
    posterAlt: "Murder of Minus film poster",
    posterWidth: 800,
    posterHeight: 1067,
    still: "/assets/films/murder-of-minus/cover-1920.avif",
    stillSrcSet: "/assets/films/murder-of-minus/cover-640.avif 640w, /assets/films/murder-of-minus/cover-1280.avif 1280w, /assets/films/murder-of-minus/cover-1920.avif 1920w",
    stillAlt: "Two people sit across a table in daylight, one holding a tablet",
    stillWidth: 1920,
    stillHeight: 1040,
    gallery: [
      { src: "/assets/films/murder-of-minus/closeup-1280.avif", srcSet: "/assets/films/murder-of-minus/closeup-640.avif 640w, /assets/films/murder-of-minus/closeup-1280.avif 1280w", alt: "A young man faces a pistol in a monochrome closeup", width: 1280, height: 693 },
      { src: "/assets/films/murder-of-minus/aerial-1280.avif", srcSet: "/assets/films/murder-of-minus/aerial-640.avif 640w, /assets/films/murder-of-minus/aerial-1280.avif 1280w", alt: "Figures cast long shadows beside a building in a monochrome overhead shot", width: 1280, height: 693 },
    ],
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
      { label: "Press kit (PDF)", href: "/assets/films/murder-of-minus/press-kit.pdf" },
    ],
  },
];

export const getFilm = (slug: string) => films.find((film) => film.slug === slug);
