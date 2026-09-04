/**
 * 2024 — the year the arcs begin.
 *
 *   learning     signs up for evening classes; struggles all year
 *   confidence   low; a first small win in September
 *   friendship   R is a constant presence
 *   missed opp   sees a role in October, doesn't apply
 *   travel       first Goa trip, Hyderabad at year end
 *
 * All synthetic. Coordinates are public city/area level.
 */

export const MEMORIES_2024 = [
  /* ---------------------------------------------------------- JANUARY */
  {
    date: "2024-01-06T10:15:00+05:30", place: "pune_kothrud",
    image: "n24-jan-start.png",
    description: "A handwritten note about enrolling in a six-month evening course.",
    extracted: "January, and I've signed up. Six months of evening classes. I have no idea if I can do this. Everyone in the intro call sounded like they already knew.",
    tags: ["learning", "handwritten", "beginning"],
    sentiment: { valence: 0.1, energy: 0.62, label: "uncertain", confidence: 0.86 },
    lifeThemes: ["learning", "personal-growth"], eventType: "decision", significance: "milestone",
    question: "What made you sign up despite not being sure?",
    answer: "I'd been saying I would for two years. At some point saying it stops counting.",
    narrative: "I signed up for six months of evening classes in the first week of January. I had been saying I would for two years, and at some point saying it stops counting. Everyone on the intro call sounded like they already knew."
  },
  {
    date: "2024-01-14T19:30:00+05:30", place: "pune_home",
    text: "First class. Understood maybe a third of it. Wrote down every word I didn't know and there were nineteen.",
    description: "A typed note after a first evening class.",
    tags: ["learning", "notes"],
    sentiment: { valence: -0.05, energy: 0.55, label: "uncertain", confidence: 0.82 },
    lifeThemes: ["learning"], eventType: "challenge", significance: "notable",
    question: "How did it feel to write down nineteen unknown words?",
    answer: "Honestly, a bit better than pretending I knew them.",
    narrative: "First class of the course, and I understood maybe a third. I wrote down every word I didn't know — nineteen of them — which felt better than pretending."
  },
  {
    date: "2024-01-21T08:40:00+05:30", place: "pune_tekdi",
    text: "Walked up the hill before class prep. Cold enough to see my breath, which happens about four days a year here.",
    description: "A typed note about an early morning walk in cold weather.",
    tags: ["walking", "morning", "winter"],
    sentiment: { valence: 0.48, energy: 0.4, label: "calm", confidence: 0.88 },
    lifeThemes: ["health", "daily-life"], eventType: "ordinary-moment", significance: "routine",
    question: "What do you remember about the cold?",
    answer: "That it made everything feel briefly like somewhere else.",
    narrative: "Walked up the hill before settling into class prep. Cold enough to see my breath, which happens about four days a year here, and it made the whole city feel briefly like somewhere else."
  },
  {
    date: "2024-01-28T21:00:00+05:30", place: "pune_home",
    text: "R came over and we spent three hours arguing about a film neither of us liked. Best evening in weeks.",
    description: "A typed note about an evening spent with a friend.",
    tags: ["friends", "evening", "film"],
    sentiment: { valence: 0.62, energy: 0.6, label: "joyful", confidence: 0.9 },
    lifeThemes: ["friends"], eventType: "ordinary-moment", significance: "notable",
    question: "What made arguing about it enjoyable?",
    answer: "Neither of us was trying to win. We were just enjoying being annoyed together.",
    narrative: "R came over and we spent three hours arguing about a film neither of us liked. Neither of us was trying to win — we were just enjoying being annoyed together, which turned out to be the best evening in weeks."
  },

  /* --------------------------------------------------------- FEBRUARY */
  {
    date: "2024-02-04T16:00:00+05:30", place: "pune_home",
    text: "Second assignment back. Passed, barely. The feedback was kind in a way that made it worse.",
    description: "A typed note about receiving marginal feedback on coursework.",
    tags: ["learning", "feedback"],
    sentiment: { valence: -0.32, energy: 0.45, label: "disappointed", confidence: 0.87 },
    lifeThemes: ["learning"], eventType: "setback", significance: "notable",
    question: "What was it about the kindness that stung?",
    answer: "It read like someone being gentle with a person they'd already written off.",
    narrative: "The second assignment came back a bare pass, with feedback so kind it read like someone being gentle with a person they'd already written off."
  },
  {
    date: "2024-02-17T13:20:00+05:30", place: "pune_kp",
    text: "Sunday lunch with the family. Everyone asked about the course. I said 'going well' four times.",
    description: "A typed note about a family lunch and repeated questions.",
    tags: ["family", "food", "sunday"],
    sentiment: { valence: 0.05, energy: 0.42, label: "uncertain", confidence: 0.78 },
    lifeThemes: ["family", "food"], eventType: "ordinary-moment", significance: "routine",
    question: "Why not tell them the truth?",
    answer: "Because the honest answer takes twenty minutes and they wanted twenty seconds.",
    narrative: "Sunday lunch, and everyone asked about the course. I said it was going well four times, mostly because the honest answer takes twenty minutes and they wanted twenty seconds."
  },
  {
    date: "2024-02-25T20:10:00+05:30", place: "pune_home",
    text: "Reworked the same problem for four hours and got nowhere. Closed the laptop and made dal.",
    description: "A typed note about an unproductive study session.",
    tags: ["learning", "frustration"],
    sentiment: { valence: -0.4, energy: 0.5, label: "frustrated", confidence: 0.89 },
    lifeThemes: ["learning"], eventType: "challenge", significance: "routine",
    question: "What made you stop when you did?",
    answer: "I noticed I'd been reading the same line for ten minutes.",
    narrative: "Four hours on the same problem and nowhere at the end of it. I stopped when I noticed I'd been reading the same line for ten minutes, closed the laptop, and made dal."
  },

  /* ------------------------------------------------------------ MARCH */
  {
    date: "2024-03-16T18:20:00+05:30", place: "pune_fcroad",
    image: "r24-mar-cafe.png",
    description: "A café receipt from Cafe Peshwa on FC Road, Pune, for a filter coffee and a sandwich.",
    extracted: "CAFE PESHWA, FC Road, Pune 411004. Filter Coffee 120.00, Veg Sandwich 180.00. TOTAL 354.00. 16 MAR 2024 18:20.",
    entities: [{ name: "Cafe Peshwa", type: "organization" }],
    tags: ["food", "study", "pune"],
    sentiment: { valence: 0.25, energy: 0.35, label: "calm", confidence: 0.8 },
    lifeThemes: ["daily-life", "learning"], eventType: "ordinary-moment", significance: "routine",
    question: "What were you doing there?",
    answer: "Studying badly, mostly watching the road.",
    narrative: "A coffee and a sandwich at Cafe Peshwa on a March evening. I was supposed to be studying and mostly watched the road."
  },
  {
    date: "2024-03-23T11:00:00+05:30", place: "pune_home",
    text: "Cleaned the desk properly for the first time since December. Found four pens I thought I'd lost and one I'd already replaced twice.",
    description: "A typed note about tidying a desk.",
    tags: ["home", "tidying"],
    sentiment: { valence: 0.35, energy: 0.38, label: "calm", confidence: 0.75 },
    lifeThemes: ["daily-life"], eventType: "ordinary-moment", significance: "routine",
    question: "Did the clean desk help?",
    answer: "For about two days.",
    narrative: "Cleaned the desk for the first time since December and found four pens I'd given up on. It helped for about two days."
  },

  /* ------------------------------------------------------------ APRIL */
  {
    date: "2024-04-09T22:15:00+05:30", place: "pune_home",
    text: "Thirty-nine degrees by four in the afternoon. Studied lying on the floor because it was the coolest surface in the flat.",
    description: "A typed note about studying during a heatwave.",
    tags: ["summer", "learning", "home"],
    sentiment: { valence: -0.1, energy: 0.3, label: "uncertain", confidence: 0.72 },
    lifeThemes: ["daily-life", "learning"], eventType: "ordinary-moment", significance: "routine",
    question: "Did lying on the floor help you concentrate?",
    answer: "No, but it stopped me being angry about the heat.",
    narrative: "Thirty-nine degrees by four, so I studied lying on the tiles because they were the coolest surface in the flat. It didn't help me concentrate but it stopped me being angry about the heat."
  },
  {
    date: "2024-04-20T19:45:00+05:30", place: "pune_kp",
    text: "R's birthday. Eleven of us at a place that could comfortably seat six. Nobody left early.",
    description: "A typed note about a friend's crowded birthday dinner.",
    tags: ["friends", "celebration", "food"],
    sentiment: { valence: 0.75, energy: 0.78, label: "joyful", confidence: 0.92 },
    lifeThemes: ["friends", "food"], eventType: "celebration", significance: "notable",
    question: "What do you remember most?",
    answer: "That we kept pulling chairs from other tables and the staff stopped objecting after the third one.",
    narrative: "R's birthday, eleven of us crammed into a place built for six. We kept dragging chairs over from other tables and the staff stopped objecting after the third one. Nobody left early."
  },

  /* -------------------------------------------------------------- MAY */
  {
    date: "2024-05-12T20:00:00+05:30", place: "pune_home",
    image: "n24-may-stuck.png",
    description: "A handwritten note expressing doubt about the ability to learn a difficult subject.",
    extracted: "Third week on the same chapter. I read it, I understand it, I close the book and it's gone. Maybe some people just can't do this.",
    tags: ["learning", "self-doubt", "handwritten"],
    sentiment: { valence: -0.55, energy: 0.42, label: "disappointed", confidence: 0.9 },
    lifeThemes: ["learning", "personal-growth"], eventType: "setback", significance: "important",
    question: "Did you believe that at the time?",
    answer: "Completely. For about a week.",
    narrative: "Third week on the same chapter. I could read it and understand it and then close the book and lose it entirely. I wrote down that maybe some people just can't do this, and I believed it completely for about a week."
  },
  {
    date: "2024-05-26T09:30:00+05:30", place: "pune_tekdi",
    text: "Ran the hill twice. Not because I wanted to, because I couldn't face the book.",
    description: "A typed note about exercising to avoid studying.",
    tags: ["health", "avoidance"],
    sentiment: { valence: 0.15, energy: 0.68, label: "uncertain", confidence: 0.76 },
    lifeThemes: ["health"], eventType: "ordinary-moment", significance: "routine",
    question: "Was it avoidance or rest?",
    answer: "Avoidance. But it worked out as rest.",
    narrative: "Ran the hill twice, not out of enthusiasm but because I couldn't face the book. It was avoidance, and it worked out as rest."
  },

  /* ------------------------------------------------------------- JUNE */
  {
    date: "2024-06-08T17:00:00+05:30", place: "pune_home",
    text: "Missed a deadline for the first time. Emailed to ask for an extension and spent an hour writing four sentences.",
    description: "A typed note about missing a coursework deadline.",
    tags: ["learning", "deadline"],
    sentiment: { valence: -0.45, energy: 0.5, label: "disappointed", confidence: 0.88 },
    lifeThemes: ["learning"], eventType: "setback", significance: "notable",
    question: "What made the email so hard to write?",
    answer: "Admitting it in writing made it real in a way that missing it hadn't.",
    narrative: "Missed a deadline for the first time and spent an hour writing four sentences asking for an extension. Admitting it in writing made it real in a way that missing it hadn't."
  },
  {
    date: "2024-06-21T18:30:00+05:30", place: "pune_home",
    text: "First rain. Stood outside the building with three neighbours I've never spoken to. All of us just standing there getting wet.",
    description: "A typed note about the arrival of the monsoon.",
    tags: ["monsoon", "neighbours", "pune"],
    sentiment: { valence: 0.7, energy: 0.55, label: "joyful", confidence: 0.9 },
    lifeThemes: ["daily-life"], eventType: "ordinary-moment", significance: "notable",
    question: "Did you speak to them?",
    answer: "One of them said 'finally' and that was the whole conversation.",
    narrative: "First rain of the year, and I stood outside with three neighbours I'd never spoken to, all of us getting soaked. One of them said finally, and that was the entire conversation."
  },

  /* ------------------------------------------------------------- JULY */
  {
    date: "2024-07-14T10:30:00+05:30", place: "pune_shukrawar",
    image: "t24-jul-museum.png",
    description: "A museum ticket for the Raja Dinkar Kelkar Museum in Pune.",
    extracted: "ADMIT ONE. RAJA DINKAR KELKAR MUSEUM. Shukrawar Peth, Pune. SUN 14 JUL 2024 10:30 AM. B-118. Adult, camera permitted.",
    entities: [{ name: "Raja Dinkar Kelkar Museum", type: "venue" }],
    tags: ["museum", "pune", "objects"],
    sentiment: { valence: 0.55, energy: 0.35, label: "reflective", confidence: 0.85 },
    lifeThemes: ["hobbies", "daily-life"], eventType: "discovery", significance: "notable",
    question: "What held your attention longest?",
    answer: "A case of door handles. Hundreds of them, all slightly different.",
    narrative: "A Sunday morning at the Kelkar Museum. What held me was a case of door handles — hundreds of them, each slightly different, kept by one man over a lifetime."
  },
  {
    date: "2024-07-27T21:40:00+05:30", place: "pune_home",
    text: "Gave the chapter one more try with the lights off and just the desk lamp. Got further than I have in a month.",
    description: "A typed note about a small study breakthrough.",
    tags: ["learning", "progress"],
    sentiment: { valence: 0.45, energy: 0.5, label: "hopeful", confidence: 0.83 },
    lifeThemes: ["learning"], eventType: "discovery", significance: "notable",
    question: "What was different this time?",
    answer: "Nothing, except I'd stopped expecting it to work.",
    narrative: "Tried the chapter again with only the desk lamp on and got further than I had in a month. Nothing was different except that I'd stopped expecting it to work."
  },

  /* ----------------------------------------------------------- AUGUST */
  {
    date: "2024-08-11T15:00:00+05:30", place: "goa_palolem",
    text: "First time in Goa. Four of us in a house with a broken fan and a view we hadn't paid for.",
    description: "A typed note about a first trip to Goa with friends.",
    tags: ["travel", "goa", "friends"],
    sentiment: { valence: 0.72, energy: 0.65, label: "joyful", confidence: 0.9 },
    lifeThemes: ["travel", "friends"], eventType: "journey", significance: "important",
    question: "What made it memorable?",
    answer: "The broken fan, honestly. We were all too hot to be anything but honest with each other.",
    narrative: "First trip to Goa, four of us in a house with a broken fan and a view we hadn't paid for. The heat made everyone too tired to perform, and we ended up more honest with each other than usual."
  },
  {
    date: "2024-08-13T07:15:00+05:30", place: "goa_palolem",
    text: "Walked the length of the beach before anyone was up. A dog followed me the whole way and turned back at exactly the same spot on the return.",
    description: "A typed note about an early morning walk on a beach in Goa.",
    tags: ["goa", "morning", "solitude"],
    sentiment: { valence: 0.68, energy: 0.35, label: "calm", confidence: 0.88 },
    lifeThemes: ["travel"], eventType: "ordinary-moment", significance: "notable",
    question: "Did you find out whose dog it was?",
    answer: "No. I think it had a territory and I was just passing through it.",
    narrative: "Walked the length of the beach before anyone was up. A dog came with me the whole way and turned back at exactly the same spot on the return, as though it had a boundary I'd not been told about."
  },
  {
    date: "2024-08-30T19:00:00+05:30", place: "pune_home",
    text: "Back to the books. Goa feels like it happened to someone else already.",
    description: "A typed note about returning to routine after a trip.",
    tags: ["routine", "learning"],
    sentiment: { valence: -0.15, energy: 0.35, label: "nostalgic", confidence: 0.78 },
    lifeThemes: ["daily-life", "learning"], eventType: "transition", significance: "routine",
    question: "How long did it take to feel normal again?",
    answer: "Three days. It's always three days.",
    narrative: "Back to the books, and Goa already felt like it had happened to someone else. It takes three days to feel normal again — it always takes three days."
  },

  /* -------------------------------------------------------- SEPTEMBER */
  {
    date: "2024-09-15T11:20:00+05:30", place: "pune_home",
    image: "n24-sep-small.png",
    description: "A handwritten note recording the first time the writer solved something without help.",
    extracted: "Small thing, but. Fixed something today without looking anything up. First time that's ever happened.",
    tags: ["learning", "milestone", "handwritten"],
    sentiment: { valence: 0.6, energy: 0.55, label: "proud", confidence: 0.88 },
    lifeThemes: ["learning", "personal-growth"], eventType: "achievement", significance: "important",
    question: "Why write it down when it was such a small thing?",
    answer: "Because I knew I'd forget it had ever been hard.",
    narrative: "Fixed something without looking anything up — the first time that had ever happened. I wrote it down because I knew that in a year I'd have forgotten it was ever hard."
  },
  {
    date: "2024-09-29T20:30:00+05:30", place: "pune_kp",
    text: "Dinner with R. Told him about the course honestly for the first time. He said he'd assumed I was fine because I never said otherwise.",
    description: "A typed note about a candid conversation with a friend.",
    tags: ["friends", "honesty"],
    sentiment: { valence: 0.4, energy: 0.5, label: "relieved", confidence: 0.86 },
    lifeThemes: ["friends", "personal-growth"], eventType: "reflection", significance: "important",
    question: "What changed after telling him?",
    answer: "Nothing about the course. Everything about how heavy it felt.",
    narrative: "Told R honestly about the course for the first time. He said he'd assumed I was fine because I never said otherwise. Nothing about the course changed. Everything about how heavy it felt did."
  },

  /* ---------------------------------------------------------- OCTOBER */
  {
    date: "2024-10-08T23:10:00+05:30", place: "pune_home",
    text: "A role came up that I'd have been perfect for in about eight months. Read the posting four times. Didn't apply.",
    description: "A typed note about deciding not to apply for a job opening.",
    tags: ["career", "hesitation"],
    sentiment: { valence: -0.3, energy: 0.48, label: "uncertain", confidence: 0.85 },
    lifeThemes: ["career"], eventType: "decision", significance: "important",
    question: "What stopped you?",
    answer: "I told myself I wasn't ready. I'm not sure that was the real reason.",
    narrative: "A role came up in October that I'd have been right for in about eight months' time. I read the posting four times and didn't apply, telling myself I wasn't ready. I'm still not sure that was the real reason."
  },
  {
    date: "2024-10-22T18:00:00+05:30", place: "pune_home",
    text: "Diwali cleaning. Found the note from January where I said I had no idea if I could do this. Still don't, but differently.",
    description: "A typed note about rediscovering an earlier journal entry.",
    tags: ["reflection", "home", "festival"],
    sentiment: { valence: 0.3, energy: 0.4, label: "reflective", confidence: 0.84 },
    lifeThemes: ["personal-growth"], eventType: "reflection", significance: "notable",
    question: "What's different about the not-knowing now?",
    answer: "In January it was a fear. Now it's just the shape of the work.",
    narrative: "Diwali cleaning turned up the note from January where I'd written that I had no idea if I could do this. I still don't, but differently — in January it was a fear, and now it's just the shape of the work."
  },

  /* --------------------------------------------------------- NOVEMBER */
  {
    date: "2024-11-23T16:45:00+05:30", place: "pune_aundh",
    image: "r24-nov-books.png",
    description: "A bookshop receipt from Crossword in Aundh, Pune, for a technical book and a notebook.",
    extracted: "CROSSWORD, Aundh, Pune 411007. Deep Learning 1,299.00, Notebook A5 180.00. TOTAL 1,479.00. Member discount applied. 23 NOV 2024.",
    entities: [{ name: "Crossword", type: "organization" }],
    tags: ["books", "learning", "pune"],
    sentiment: { valence: 0.4, energy: 0.5, label: "hopeful", confidence: 0.82 },
    lifeThemes: ["learning", "finance"], eventType: "ordinary-moment", significance: "routine",
    question: "Did you read it?",
    answer: "Forty pages. Which is more than I expected of myself in November.",
    narrative: "Bought a textbook and a notebook at Crossword in November. I got forty pages in, which is more than I'd have predicted of myself that month."
  },

  /* --------------------------------------------------------- DECEMBER */
  {
    date: "2024-12-14T14:00:00+05:30", place: "pune_home",
    text: "Course over. Passed. Not well, but passed. Sat with it for an hour before telling anyone.",
    description: "A typed note about completing a course.",
    tags: ["learning", "completion"],
    sentiment: { valence: 0.5, energy: 0.45, label: "relieved", confidence: 0.9 },
    lifeThemes: ["learning", "achievement"], eventType: "milestone", significance: "milestone",
    question: "Why the hour before telling anyone?",
    answer: "I wanted to know how I felt before anyone told me how to feel.",
    narrative: "The course ended and I passed — not well, but passed. I sat with it for an hour before telling anyone, because I wanted to know how I felt before anyone told me how to feel."
  },
  {
    date: "2024-12-27T21:15:00+05:30", place: "hyderabad",
    image: "t24-dec-train.png",
    description: "A train ticket from Pune to Hyderabad, 3AC, berth B2/45.",
    extracted: "PUNE → HYDERABAD. Indian Railways 17031 Mumbai-Hyd Exp. FRI 27 DEC 2024 21:15. SEAT B2/45. 3AC, arrive 09:40.",
    entities: [{ name: "Indian Railways", type: "transport" }],
    tags: ["travel", "train", "family"],
    sentiment: { valence: 0.45, energy: 0.4, label: "calm", confidence: 0.83 },
    lifeThemes: ["travel", "family"], eventType: "journey", significance: "notable",
    question: "What were you travelling for?",
    answer: "Cousin's wedding. Four days of being asked what I do now.",
    narrative: "The overnight train to Hyderabad for a cousin's wedding, arriving just before ten. Four days of being asked what I do now, and having, for the first time, something to say."
  },
  {
    date: "2024-12-31T23:00:00+05:30", place: "hyderabad",
    text: "Rooftop, someone's uncle's building, forty people I half know. Realised I'd done one thing this year I'd have said was impossible in January.",
    description: "A typed note written on New Year's Eve.",
    tags: ["reflection", "year-end", "family"],
    sentiment: { valence: 0.65, energy: 0.6, label: "proud", confidence: 0.87 },
    lifeThemes: ["personal-growth", "family"], eventType: "reflection", significance: "important",
    question: "Did that change how you thought about the next year?",
    answer: "It made me suspicious of the word impossible.",
    narrative: "New Year's Eve on someone's uncle's rooftop with forty people I half knew. I realised I'd done one thing that year I'd have called impossible in January, and it made me permanently suspicious of the word."
  }
];
