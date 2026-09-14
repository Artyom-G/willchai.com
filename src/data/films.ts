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

export type FilmLaurel = {
  category: string;
  festival: string;
  outcome: string;
  year: string;
  artwork?: string;
  source?: string;
  website?: string;
  evidence?: string;
  sourceCategory?: string;
  artworkKind?: "logo";
  artworkSource?: string;
  artworkStatus?: string;
  emphasis?: "feature" | "supporting" | "compact";
  order?: number;
  shortName?: string;
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
  transition?: FilmImage;
  sequence?: FilmImage[];
  facts: FilmCredit[];
  credits: FilmCredit[];
  laurels: FilmLaurel[];
  links: FilmLink[];
};

export const films: Film[] = [
  {
    "slug": "wattleseed",
    "title": "Wattleseed",
    "directorLine": "Directed by Will Chai",
    "year": "2026",
    "runtime": "12 minutes",
    "genre": "Thriller and mystery",
    "summary": "Two researchers plan a lethal incident to halt an artificial intelligence arms race.",
    "introduction": "Two researchers devise a plan to stage a lethal incident and halt an artificial intelligence arms race. Each has a different understanding of the risks involved.",
    "story": [
      "We filmed at McMaster University, including the Mueller History of Health and Medicine Room. The apparatus on screen brought together a control board, fishing equipment and raw aluminum prisms from the team’s hobbies.",
      "I directed Wattleseed and wrote it with Cain Chai. Our team came together from Health Sciences, Computer Science and iBioMed. We released the film in February 2026."
    ],
    "poster": "/assets/films/wattleseed/poster-800.avif",
    "posterAlt": "Wattleseed film poster",
    "posterWidth": 800,
    "posterHeight": 1104,
    "still": "/assets/films/wattleseed/cover-1920.avif",
    "stillSrcSet": "/assets/films/wattleseed/cover-640.avif 640w, /assets/films/wattleseed/cover-1280.avif 1280w, /assets/films/wattleseed/cover-1920.avif 1920w",
    "stillAlt": "A researcher in a plaid shirt leans across a table in a library",
    "stillWidth": 1920,
    "stillHeight": 1038,
    "gallery": [
      {
        "src": "/assets/films/wattleseed/apparatus-1280.avif",
        "srcSet": "/assets/films/wattleseed/apparatus-640.avif 640w, /assets/films/wattleseed/apparatus-1280.avif 1280w",
        "alt": "A curved microphone and wooden speaker apparatus on a table",
        "width": 1280,
        "height": 692
      },
      {
        "src": "/assets/films/wattleseed/profile-1280.avif",
        "srcSet": "/assets/films/wattleseed/profile-640.avif 640w, /assets/films/wattleseed/profile-1280.avif 1280w",
        "alt": "A researcher wearing glasses in profile against library shelves",
        "width": 1280,
        "height": 692
      }
    ],
    "facts": [
      {
        "label": "Year",
        "value": "2026"
      },
      {
        "label": "Runtime",
        "value": "12 minutes"
      },
      {
        "label": "Country",
        "value": "Canada"
      },
      {
        "label": "Genre",
        "value": "Thriller and mystery"
      }
    ],
    "credits": [
      {
        "label": "Director, cowriter, producer, cinematographer, editor",
        "value": "William Chai"
      },
      {
        "label": "Cowriter",
        "value": "Cain Chai"
      },
      {
        "label": "Assistant director, producer",
        "value": "Edward Gao"
      },
      {
        "label": "Producer, Leo",
        "value": "Titus Tan"
      },
      {
        "label": "Producer, Adrian",
        "value": "Daniel Guo"
      },
      {
        "label": "Voice of Dr. Jimson",
        "value": "Mitchell Hynes"
      }
    ],
    "laurels": [
      {
        "category": "Best Original Score",
        "artwork": "/assets/films/laurels/cine-paris-winner-2026.png",
        "artworkSource": "https://filmfreeway.com/laurels/64632/CineParisFilmFestival",
        "festival": "Cine Paris Film Festival",
        "outcome": "Winner",
        "year": "February 2026",
        "source": "https://www.cineparisfilmfestival.com/index.html",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-niwj.png",
        "emphasis": "supporting",
        "order": 5,
        "website": "https://www.cineparisfilmfestival.com/index.html#winners"
      },
      {
        "category": "Best Trailer",
        "festival": "Rome Prisma Independent Film Awards",
        "artwork": "/assets/films/laurels/prisma-nominee.png",
        "outcome": "Nominee",
        "year": "February 2026",
        "source": "https://www.romeprismafilmawards.com/february-2026-nominees/",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-niwj.png",
        "emphasis": "supporting",
        "order": 6,
        "website": "https://www.romeprismafilmawards.com/february-2026-nominees/"
      },
      {
        "category": "Monthly Pick",
        "festival": "Rome Prisma Independent Film Awards",
        "artwork": "/assets/films/laurels/prisma-nominee.png",
        "outcome": "Selected",
        "year": "February 2026",
        "source": "https://www.romeprismafilmawards.com/february-2026-monthly-picks/",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-niwj.png",
        "website": "https://www.romeprismafilmawards.com/february-2026-nominees/"
      },
      {
        "category": "Programme 5",
        "festival": "Toronto Shorts International Film Festival",
        "artwork": "/assets/films/laurels/toronto-shorts-2026.png",
        "outcome": "Official selection",
        "year": "2026",
        "source": "https://www.torontoshorts.com/program-5",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-niwj.png",
        "emphasis": "feature",
        "order": 2,
        "website": "https://www.torontoshorts.com/program-5"
      },
      {
        "category": "Student Film",
        "festival": "Toronto Arts & Entertainment Film Festival",
        "artwork": "/assets/films/laurels/taeff-winner-2026.jpg",
        "artworkSource": "https://torontoartfilmfestival.com/wp-content/uploads/2026/06/taeff-winners-2026.jpg",
        "outcome": "Winner",
        "year": "2026",
        "source": "https://torontoartfilmfestival.com/award-winners-taeff-2026/",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-niwj.png",
        "emphasis": "supporting",
        "order": 4,
        "website": "https://torontoartfilmfestival.com/award-winners-taeff-2026/"
      },
      {
        "festival": "Oakville Film Festival",
        "category": "Next Generation Spotlight: Local Student Short Films",
        "outcome": "Official selection",
        "year": "2026",
        "source": "https://offa.ca/wp-content/uploads/2026/06/OFFA-Festival2026-Guide-WEB.pdf#page=18",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-niwj.png",
        "artwork": "/assets/films/laurels/offa-selection-2026.png",
        "artworkSource": "https://filmfreeway.com/laurels/14178/OakvilleFestivalsofFilmandArt",
        "emphasis": "feature",
        "order": 1,
        "website": "https://offa.ca/wp-content/uploads/2026/06/OFFA-Festival2026-Guide-WEB.pdf#page=18"
      },
      {
        "festival": "Kitchener Waterloo International Film Festival",
        "category": "",
        "outcome": "Award winner",
        "year": "2026",
        "artworkStatus": "Winner artwork pending. Signed in downloads provide 2026 nominee artwork despite older page labels. The nominee record carries its original graphic.",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-niwj.png",
        "emphasis": "feature",
        "order": 3,
        "website": "https://www.kwiffestival.com/nominees"
      },
      {
        "festival": "Alternative Film Festival",
        "category": "Best Sci-Fi/Fantasy/Supernatural",
        "source": "https://www.altff.org/onewebmedia/WINNERS%20SC%20AltFF%20Spr%2026.pdf#page=3",
        "artworkKind": "logo",
        "artworkStatus": "Spring 2026 nominee artwork pending. The emailed Laurel Center password was rejected on 2026 09 14.",
        "outcome": "Nominee",
        "year": "2026",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-niwj.png",
        "artwork": "/assets/films/laurels/altff-original-logo.png",
        "emphasis": "supporting",
        "order": 7,
        "website": "https://www.altff.org/onewebmedia/WINNERS%20SC%20AltFF%20Spr%2026.pdf#page=3"
      },
      {
        "festival": "Kitchener Waterloo International Film Festival",
        "category": "Best Short Film",
        "sourceCategory": "BEST SHORT FILM",
        "artwork": "/assets/films/laurels/kwiff-nominee-2026.png",
        "artworkSource": "https://filmfreeway.com/laurels/82251/KWIFF",
        "outcome": "Nominee",
        "year": "2026",
        "source": "https://www.kwiffestival.com/nominees",
        "website": "https://www.kwiffestival.com/nominees"
      },
      {
        "festival": "Kitchener Waterloo International Film Festival",
        "category": "Best Canadian Short Film",
        "sourceCategory": "BEST CANADIAN SHORT FILM",
        "outcome": "Nominee",
        "year": "2026",
        "source": "https://www.kwiffestival.com/nominees",
        "website": "https://www.kwiffestival.com/nominees"
      },
      {
        "festival": "Kitchener Waterloo International Film Festival",
        "category": "Best Film (Thriller Horror)",
        "sourceCategory": "BEST FILM (THRILLER HORROR)",
        "outcome": "Nominee",
        "year": "2026",
        "source": "https://www.kwiffestival.com/nominees",
        "website": "https://www.kwiffestival.com/nominees"
      },
      {
        "festival": "Kitchener Waterloo International Film Festival",
        "category": "Best Student Film",
        "sourceCategory": "BEST STUDENT FILM",
        "outcome": "Nominee",
        "year": "2026",
        "source": "https://www.kwiffestival.com/nominees",
        "website": "https://www.kwiffestival.com/nominees"
      },
      {
        "festival": "Kitchener Waterloo International Film Festival",
        "category": "Best Trailers",
        "sourceCategory": "BEST TRAILERS",
        "outcome": "Nominee",
        "year": "2026",
        "source": "https://www.kwiffestival.com/nominees",
        "website": "https://www.kwiffestival.com/nominees"
      },
      {
        "festival": "Kitchener Waterloo International Film Festival",
        "category": "Best Editing",
        "sourceCategory": "BEST EDITING",
        "outcome": "Nominee",
        "year": "2026",
        "source": "https://www.kwiffestival.com/nominees",
        "website": "https://www.kwiffestival.com/nominees"
      },
      {
        "festival": "Kitchener Waterloo International Film Festival",
        "category": "Best Experimental Film",
        "sourceCategory": "BEST EXPERIEMENTAL FILM",
        "outcome": "Nominee",
        "year": "2026",
        "source": "https://www.kwiffestival.com/nominees",
        "website": "https://www.kwiffestival.com/nominees"
      },
      {
        "festival": "Kitchener Waterloo International Film Festival",
        "category": "Best Animated / Sci Fi Film",
        "sourceCategory": "BEST ANIMATED / SCI-FI FILM",
        "outcome": "Nominee",
        "year": "2026",
        "source": "https://www.kwiffestival.com/nominees",
        "website": "https://www.kwiffestival.com/nominees"
      },
      {
        "festival": "Kitchener Waterloo International Film Festival",
        "category": "Best Cinematography",
        "sourceCategory": "BEST CINEMATOGRAPHY",
        "outcome": "Nominee",
        "year": "2026",
        "source": "https://www.kwiffestival.com/nominees",
        "website": "https://www.kwiffestival.com/nominees"
      }
    ],
    "links": [
      {
        "label": "Trailer",
        "href": "https://www.youtube.com/watch?v=o-5DN5ygX80"
      },
      {
        "label": "Screener",
        "href": "mailto:me@willchai.com?subject=Wattleseed%20screener"
      },
      {
        "label": "Press kit",
        "href": "/assets/films/wattleseed/press-kit.pdf"
      }
    ],
    "sequence": [
      {
        "src": "/assets/films/wattleseed/control-1920.avif",
        "srcSet": "/assets/films/wattleseed/control-640.avif 640w, /assets/films/wattleseed/control-1280.avif 1280w, /assets/films/wattleseed/control-1920.avif 1920w",
        "width": 1920,
        "height": 1038,
        "alt": "The control panel and microphone in Wattleseed"
      },
      {
        "src": "/assets/films/wattleseed/conversation-1920.avif",
        "srcSet": "/assets/films/wattleseed/conversation-640.avif 640w, /assets/films/wattleseed/conversation-1280.avif 1280w, /assets/films/wattleseed/conversation-1920.avif 1920w",
        "width": 1920,
        "height": 1038,
        "alt": "A researcher sits beside the apparatus in Wattleseed"
      },
      {
        "src": "/assets/films/wattleseed/adrian-1920.avif",
        "srcSet": "/assets/films/wattleseed/adrian-640.avif 640w, /assets/films/wattleseed/adrian-1280.avif 1280w, /assets/films/wattleseed/adrian-1920.avif 1920w",
        "width": 1920,
        "height": 1038,
        "alt": "A researcher raises his hand beside his head in Wattleseed"
      }
    ],
    "transition": {
      "src": "/assets/films/wattleseed/night-1920.avif",
      "srcSet": "/assets/films/wattleseed/night-640.avif 640w, /assets/films/wattleseed/night-1280.avif 1280w, /assets/films/wattleseed/night-1920.avif 1920w",
      "width": 1920,
      "height": 1038,
      "alt": "Figures beside a light at night in Wattleseed"
    }
  },
  {
    "slug": "murder-of-minus",
    "title": "Murder of Minus",
    "directorLine": "Directed by Will Chai and Artyom Gabtraupov",
    "year": "2025",
    "runtime": "35 minutes",
    "genre": "Thriller, drama, science fiction",
    "summary": "Quinten builds Minus, an artificial intelligence. Its progress draws him into a violent confrontation.",
    "introduction": "Tech prodigy Quinten Spencer builds Minus, an artificial intelligence capable of remarkable feats. Its progress draws him toward recognition and a violent confrontation.",
    "story": [
      "I started Murder of Minus in high school in November 2021. Artyom Gabtraupov and I wrote and directed it together, filming mostly around Kitchener and Waterloo. We finished postproduction in January 2025.",
      "Friends joined the cast and crew, and I played both Quinten and Minus. At one point, we filmed a scene for three characters with two people on set, sharing the acting, directing and camera work."
    ],
    "poster": "/assets/films/murder-of-minus/poster-800.avif",
    "posterAlt": "Murder of Minus film poster",
    "posterWidth": 800,
    "posterHeight": 1067,
    "still": "/assets/films/murder-of-minus/cover-1920.avif",
    "stillSrcSet": "/assets/films/murder-of-minus/cover-640.avif 640w, /assets/films/murder-of-minus/cover-1280.avif 1280w, /assets/films/murder-of-minus/cover-1920.avif 1920w",
    "stillAlt": "Two people sit across a table in daylight, one holding a tablet",
    "stillWidth": 1920,
    "stillHeight": 1040,
    "gallery": [
      {
        "src": "/assets/films/murder-of-minus/closeup-1280.avif",
        "srcSet": "/assets/films/murder-of-minus/closeup-640.avif 640w, /assets/films/murder-of-minus/closeup-1280.avif 1280w",
        "alt": "Artyom Gabtraupov as Mark in Murder of Minus",
        "width": 1280,
        "height": 693
      },
      {
        "src": "/assets/films/murder-of-minus/aerial-1280.avif",
        "srcSet": "/assets/films/murder-of-minus/aerial-640.avif 640w, /assets/films/murder-of-minus/aerial-1280.avif 1280w",
        "alt": "Figures cast long shadows beside a building in a monochrome overhead shot",
        "width": 1280,
        "height": 693
      }
    ],
    "facts": [
      {
        "label": "Year",
        "value": "2025"
      },
      {
        "label": "Runtime",
        "value": "35 minutes"
      },
      {
        "label": "Country",
        "value": "Canada"
      },
      {
        "label": "Genre",
        "value": "Thriller, drama, science fiction"
      }
    ],
    "credits": [
      {
        "label": "Cowriter, codirector, executive producer, cinematographer, editor, lead actor",
        "value": "William Chai"
      },
      {
        "label": "Cowriter, codirector, executive producer, cinematographer, Mark",
        "value": "Artyom Gabtraupov"
      },
      {
        "label": "Owens",
        "value": "Ian Carswell"
      },
      {
        "label": "Julia",
        "value": "Eden Lucchetta"
      },
      {
        "label": "Producer, score cocomposer",
        "value": "Matthew Buchanan-MacDougall"
      },
      {
        "label": "Producer, production designer",
        "value": "Calum Heimbecker"
      },
      {
        "label": "Producers",
        "value": "Keon Park and Yengkong Lynhiavu"
      },
      {
        "label": "Associate producers",
        "value": "Jeremy Atafo, Andrea Ng, Walter Wang, Zarra Rahemtulla, Evan Ingle, Yitong (Cain) Chai"
      },
      {
        "label": "Award Presenter",
        "value": "Brian Hendry"
      },
      {
        "label": "Officer 2",
        "value": "Stanislau Hollingsworth-Pratasousky"
      },
      {
        "label": "Officer Kevin",
        "value": "Keon Park"
      },
      {
        "label": "Cinematography and videography",
        "value": "William Chai, Artyom Gabtraupov, Calum Heimbecker, Yengkong Lynhiavu"
      },
      {
        "label": "Original score",
        "value": "Matthew Buchanan-MacDougall and William Chai"
      },
      {
        "label": "Script supervision",
        "value": "Keon Park, Matthew Buchanan-MacDougall, Yitong (Cain) Chai, Maya Schiedel, Miret Morgan, Bogda David, Walter Wang, Kasvi Kaushik, Jory Breen, Alison Hunter Stewart, David Newman"
      },
      {
        "label": "Prop master",
        "value": "Evan Ingle"
      }
    ],
    "laurels": [
      {
        "category": "Best Student Film",
        "festival": "Cine Paris Film Festival",
        "artwork": "/assets/films/laurels/cine-paris-2025.png",
        "outcome": "Winner",
        "year": "2025",
        "source": "https://www.cineparisfilmfestival.com/winners-2025.html",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "emphasis": "supporting",
        "order": 4,
        "website": "https://www.cineparisfilmfestival.com/winners-2025.html"
      },
      {
        "category": "Best Student Short Film",
        "festival": "Toronto Independent Festival of CIFT",
        "artwork": "/assets/films/laurels/cift-2025.png",
        "outcome": "Winner",
        "year": "2025",
        "source": "https://cyrusmonthlyfestival.com/winners-april-2025/",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "emphasis": "supporting",
        "order": 5,
        "website": "https://cyrusmonthlyfestival.com/winners-april-2025/"
      },
      {
        "category": "Best Mystery, Suspense, or Thriller",
        "festival": "Couch Film Festival",
        "artwork": "/assets/films/laurels/couch-mystery.png",
        "outcome": "Winner",
        "year": "2025",
        "source": "https://couchff.weebly.com/uploads/1/2/0/3/120372188/spring_25_couch.pdf#page=9",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "emphasis": "feature",
        "order": 2,
        "website": "https://couchff.weebly.com/uploads/1/2/0/3/120372188/spring_25_couch.pdf#page=9"
      },
      {
        "category": "Best Actor · William Chai",
        "festival": "Alternative Film Festival",
        "artwork": "/assets/films/laurels/altff-actor.png",
        "outcome": "Winner",
        "year": "2025",
        "source": "https://altff.org/onewebmedia/MASTER%20AltFF%20Spr25.pdf#page=11",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "emphasis": "feature",
        "order": 3,
        "website": "https://altff.org/onewebmedia/MASTER%20AltFF%20Spr25.pdf#page=11"
      },
      {
        "category": "Best Student Film",
        "festival": "Alternative Film Festival",
        "artwork": "/assets/films/laurels/altff-actor.png",
        "outcome": "Nominee",
        "year": "Spring 2025",
        "source": "https://altff.org/onewebmedia/MASTER%20AltFF%20Spr25.pdf#page=11",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "website": "https://altff.org/onewebmedia/MASTER%20AltFF%20Spr25.pdf#page=11"
      },
      {
        "category": "",
        "festival": "Kitchener Waterloo International Film Festival",
        "artwork": "/assets/films/laurels/kwiff-finalist-2025.png",
        "outcome": "Finalist",
        "year": "2025",
        "source": "https://www.kwiffestival.com/kwiff2025nomination",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "emphasis": "feature",
        "order": 1,
        "website": "https://www.kwiffestival.com/kwiff2025nomination"
      },
      {
        "category": "Best Short Drama/Thriller Film",
        "festival": "Kitchener Waterloo International Film Festival",
        "artwork": "/assets/films/laurels/kwiff-finalist-2025.png",
        "outcome": "Nominee",
        "year": "2025",
        "source": "https://www.kwiffestival.com/kwiff2025nomination",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "website": "https://www.kwiffestival.com/kwiff2025nomination"
      },
      {
        "category": "Best Short Film Canada",
        "festival": "Kitchener Waterloo International Film Festival",
        "artwork": "/assets/films/laurels/kwiff-finalist-2025.png",
        "outcome": "Nominee",
        "year": "2025",
        "source": "https://www.kwiffestival.com/kwiff2025nomination",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "website": "https://www.kwiffestival.com/kwiff2025nomination"
      },
      {
        "category": "Best Movie Trailer",
        "festival": "Kitchener Waterloo International Film Festival",
        "artwork": "/assets/films/laurels/kwiff-finalist-2025.png",
        "outcome": "Nominee",
        "year": "2025",
        "source": "https://www.kwiffestival.com/kwiff2025nomination",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "website": "https://www.kwiffestival.com/kwiff2025nomination"
      },
      {
        "category": "",
        "festival": "Kitchener Waterloo International Film Festival",
        "artwork": "/assets/films/laurels/kwiff-finalist-2025.png",
        "outcome": "Official selection",
        "year": "2025",
        "source": "https://www.kwiffestival.com/kwiff2025nomination",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "website": "https://www.kwiffestival.com/kwiff2025nomination"
      },
      {
        "category": "Short Live Action Narrative",
        "festival": "Austin Lift Off Film Festival",
        "artwork": "/assets/films/laurels/Austin-Laurels-2025-300x300.avif",
        "outcome": "Official selection",
        "year": "2025",
        "source": "https://willchai.com/murder-of-minus-a-sci-fi-thriller/",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "emphasis": "compact",
        "order": 10,
        "shortName": "Austin",
        "website": "https://liftoff.network/austin-lift-off-film-festival/"
      },
      {
        "festival": "London Lift Off Film Festival",
        "category": "",
        "outcome": "Official selection",
        "year": "2025",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "emphasis": "compact",
        "order": 6,
        "shortName": "London",
        "website": "https://liftoff.network/london-lift-off-film-festival/"
      },
      {
        "festival": "Los Angeles Lift Off Film Festival",
        "category": "",
        "outcome": "Official selection",
        "year": "2025",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "emphasis": "compact",
        "order": 7,
        "shortName": "Los Angeles",
        "website": "https://liftoff.network/los-angeles-lift-off-film-festival/"
      },
      {
        "festival": "New York Lift Off Film Festival",
        "category": "",
        "outcome": "Official selection",
        "year": "2025",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "emphasis": "compact",
        "order": 8,
        "shortName": "New York",
        "website": "https://liftoff.network/new-york-lift-off-film-festival/"
      },
      {
        "festival": "Toronto Lift Off Film Festival",
        "category": "",
        "outcome": "Official selection",
        "year": "2025",
        "evidence": "Owner supplied FilmFreeway judging record: SCR-20260913-njdj.png",
        "emphasis": "compact",
        "order": 9,
        "shortName": "Toronto",
        "website": "https://liftoff.network/toronto-lift-off-film-festival/"
      }
    ],
    "links": [
      {
        "label": "Trailer",
        "href": "https://www.youtube.com/watch?v=g3s0Y_epU2I"
      },
      {
        "label": "Screening enquiry",
        "href": "mailto:me@willchai.com?subject=Murder%20of%20Minus"
      },
      {
        "label": "Press kit",
        "href": "/assets/films/murder-of-minus/press-kit.pdf"
      }
    ],
    "sequence": [
      {
        "src": "/assets/films/murder-of-minus/quinten-colour-1920.avif",
        "srcSet": "/assets/films/murder-of-minus/quinten-colour-640.avif 640w, /assets/films/murder-of-minus/quinten-colour-1280.avif 1280w, /assets/films/murder-of-minus/quinten-colour-1920.avif 1920w",
        "width": 1920,
        "height": 1040,
        "alt": "A young man in blue and red light in Murder of Minus"
      },
      {
        "src": "/assets/films/murder-of-minus/auditorium-1920.avif",
        "srcSet": "/assets/films/murder-of-minus/auditorium-640.avif 640w, /assets/films/murder-of-minus/auditorium-1280.avif 1280w, /assets/films/murder-of-minus/auditorium-1920.avif 1920w",
        "width": 1920,
        "height": 1040,
        "alt": "The auditorium in Murder of Minus"
      },
      {
        "src": "/assets/films/murder-of-minus/owens-1920.avif",
        "srcSet": "/assets/films/murder-of-minus/owens-640.avif 640w, /assets/films/murder-of-minus/owens-1280.avif 1280w, /assets/films/murder-of-minus/owens-1920.avif 1920w",
        "width": 1920,
        "height": 1040,
        "alt": "A man in a suit looks upward in Murder of Minus"
      },
      {
        "src": "/assets/films/murder-of-minus/aerial-1280.avif",
        "srcSet": "/assets/films/murder-of-minus/aerial-640.avif 640w, /assets/films/murder-of-minus/aerial-1280.avif 1280w",
        "alt": "Figures cast long shadows beside a building in a monochrome overhead shot",
        "width": 1280,
        "height": 693
      }
    ]
  }
];

export const getFilm = (slug: string) => films.find((film) => film.slug === slug);
