import type { FilmImage } from './films';
import images from './film-detail-images.json';

export type FilmEssay = {
  opening: FilmImage;
  premise: string;
  story: string[];
  perspectiveTitle: string;
  perspectives: { name: string; text: string }[];
  productionTitle: string;
  production: string[];
  milestones: { value: string; label: string }[];
  craftTitle: string;
  craft: { title: string; text: string }[];
  cast: { character: string; performer: string }[];
  specifications: { label: string; value: string }[];
  sources: { file: string; pages: number[]; topics: string }[];
};

// Editorial paraphrases of the original press kits. Preserve source page references.
export const filmEssays: Record<string, FilmEssay> = {
  'murder-of-minus': {
    opening: images.portrait,
    premise: 'A young inventor wants the world to know his name. His creation begins to draw attention of its own.',
    story: [
      'Quinten Spencer builds Minus, an artificial intelligence capable of extraordinary work. He hopes its success will earn him recognition. As the technology develops, his pursuit of fame draws him into a dangerous public spotlight and a violent confrontation.',
      'William Chai plays both Quinten and Minus. Artyom Gabtraupov plays Mark, with Ian Carswell as Owens and Eden Lucchetta as Julia. The story follows the people surrounding the invention and the consequences of Quinten’s decisions.'
    ],
    perspectiveTitle: 'Ambition and responsibility',
    perspectives: [
      { name: 'Will Chai', text: 'I was interested in the desire to be recognised for helping people. My perspective came partly from medicine, where prestige can become a reason to pursue the profession. Quinten wants to be remembered as a genius. His ambition gives us a way to examine the ethical cost of seeking recognition and the responsibilities which accompany it.' },
      { name: 'Artyom Gabtraupov', text: 'Artyom approached the film through questions about code, accountability, and the people affected by technology. His director’s statement connects startup culture with the presentation of status and investor appeal. Working together brought his perspective from Computer Science into conversation with mine from Health Sciences.' }
    ],
    productionTitle: 'Three years making Minus',
    production: [
      'I began Murder of Minus in November 2021, while I was in high school. It started as a CAS project for the International Baccalaureate. My friend Artyom joined me, and we developed the screenplay and directed the film together. We finished postproduction in January 2025.',
      'We filmed almost entirely around Kitchener and Waterloo, with a total budget of approximately $7,000. Friends joined the cast and crew, and our responsibilities often overlapped. Artyom and I worked as actors, writers, directors, producers, and cinematographers.',
      'One scene required three characters while only two of us were on set. We shared the acting and camera work as we filmed it. The wider production involved producers, script supervisors, and friends who helped organise the shoot over its several years.'
    ],
    milestones: [{value:'November 2021',label:'Project begins'},{value:'Kitchener / Waterloo',label:'Principal locations'},{value:'January 2025',label:'Postproduction completed'}],
    craftTitle: 'Camera, edit, and sound',
    craft: [
      {title:'The influences',text:'The Social Network was one of my references. The public stories of Elizabeth Holmes and Martin Shkreli also informed the film’s interest in ambition, fame, and the moral decisions surrounding success.'},
      {title:'The image',text:'We began shooting with a Sony a6500 and later used a Sony a7 III. Cinematography was shared by Artyom, Calum Heimbecker, Yengkong Lynhiavu, and me. I edited the film on my MacBook Pro using Final Cut Pro 11.'},
      {title:'The score',text:'Matthew Buchanan-MacDougall composed original music for the film. I later supplemented the soundtrack with music generated using AI. The original press kit describes both contributions, and the score credits name Matthew and me.'}
    ],
    cast:[{character:'Quinten / Minus',performer:'William Chai'},{character:'Mark',performer:'Artyom Gabtraupov'},{character:'Owens',performer:'Ian Carswell'},{character:'Julia',performer:'Eden Lucchetta'}],
    specifications:[{label:'Runtime',value:'35 minutes'},{label:'Year',value:'2025'},{label:'Language',value:'English'},{label:'Production',value:'Ontario, Canada'},{label:'Cameras',value:'Sony a6500 / Sony a7 III'},{label:'Edit',value:'Final Cut Pro 11'}],
    sources:[{file:'/assets/films/murder-of-minus/press-kit.pdf',pages:[2,3,4,8,10],topics:'Synopsis, director perspectives, production history, budget, influences, technical process and cast.'}]
  },
  wattleseed: {
    opening: {src:'/assets/films/wattleseed/apparatus-1280.avif',srcSet:'/assets/films/wattleseed/apparatus-640.avif 640w, /assets/films/wattleseed/apparatus-1280.avif 1280w',width:1280,height:692,alt:'The Wattleseed apparatus, assembled from the production team’s equipment.'},
    premise:'Two researchers decide a lethal incident could stop an artificial intelligence arms race.',
    story:[
      'Adrian and Leo believe destroying Wattleseed will leave the wider race toward artificial intelligence intact. They devise a plan to stage a lethal incident in the hope of bringing it to a halt. The film follows their reasoning and the risks they are prepared to take.',
      'Daniel Guo plays Adrian and Titus Tan plays Leo. Mitchell Hynes provides the voice of Dr. Jimson. Over twelve minutes, the researchers’ conversation brings their fears about the technology into contact with their own decisions.'
    ],
    perspectiveTitle:'The decision at the centre',
    perspectives:[{name:'Will Chai',text:'I wanted Wattleseed itself to remain ambiguous. The characters project their anxieties onto it, while the audience is left to consider whether the AI ever acts. Their concerns about regulation are serious. The film follows a man whose conviction gives him permission to engineer a tragedy in the belief he is preventing one.'}],
    productionTitle:'A room at McMaster',
    production:[
      'We filmed with the assistance of McMaster University in the Mueller History of Health and Medicine Room, within the Health Sciences Library. The production also used other locations around Hamilton, Ontario.',
      'I wrote Wattleseed with Cain Chai and directed it with Edward Gao as assistant director. Edward, Titus Tan, Daniel Guo, and I produced the film. The team brought together people from Health Sciences, Computer Science, and iBioMed.',
      'The apparatus came from the team’s own hobbies. Raw aluminum prisms, fishing equipment, and a control board became parts of the technology on screen. Those physical objects gave the performers an apparatus to work with in the library.'
    ],
    milestones:[{value:'Hamilton',label:'Filming locations'},{value:'12 minutes',label:'Completed film'},{value:'21 February 2026',label:'Release'}],
    craftTitle:'Building Wattleseed',
    craft:[
      {title:'The apparatus',text:'The control board, fishing equipment, and aluminum prisms were gathered from the production team. The original press kit records these materials as the source of the analog technology in the film.'},
      {title:'The image and sound',text:'Wattleseed was shot on a Sony a7 IV and finished in 4K. I edited the film and mixed the sound in Final Cut Pro 11. The library interiors and the exterior locations were filmed around McMaster University and Hamilton.'},
      {title:'The second film',text:'Wattleseed is my second directorial work, following Murder of Minus. Both films use artificial intelligence to examine human choices. Here, the focus rests on the researchers’ conviction and the justification for their plan.'}
    ],
    cast:[{character:'Adrian',performer:'Daniel Guo'},{character:'Leo',performer:'Titus Tan'},{character:'Dr. Jimson',performer:'Voice of Mitchell Hynes'}],
    specifications:[{label:'Runtime',value:'12 minutes'},{label:'Released',value:'21 February 2026'},{label:'Format',value:'4K'},{label:'Production',value:'Hamilton, Ontario'},{label:'Camera',value:'Sony a7 IV'},{label:'Edit and sound mix',value:'Final Cut Pro 11'}],
    sources:[{file:'/assets/films/wattleseed/press-kit.pdf',pages:[2,3,4,5],topics:'Premise, director statement, production materials, location, team, release and technical specifications.'}]
  }
};
