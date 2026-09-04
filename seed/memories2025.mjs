/**
 * 2025 — the middle year, where the arcs get harder.
 *
 *   learning     plateau; the unglamorous stretch nobody posts about
 *   friendship   R drifts; nothing happens, which is the point
 *   missed opp   the October role resurfaces as regret
 *   confidence   a terrifying first talk, survived
 *   travel       Delhi, Mumbai, Bengaluru; Goa in the off-season
 */

export const MEMORIES_2025 = [
  /* ---------------------------------------------------------- JANUARY */
  {
    date: "2025-01-05T10:00:00+05:30", place: "pune_home",
    text: "New notebook, same handwriting, same three goals I wrote last year. Two of them are word for word.",
    description: "A typed note about repeating the previous year's intentions.",
    tags: ["intentions", "repetition"],
    sentiment: { valence: -0.05, energy: 0.45, label: "reflective", confidence: 0.84 },
    lifeThemes: ["personal-growth"], eventType: "reflection", significance: "notable",
    question: "What did it mean that two were identical?",
    answer: "Either they matter or I've stopped reading what I write.",
    narrative: "New notebook, same handwriting, and two of the three goals word for word from last year. Either they matter, or I've stopped reading what I write."
  },
  {
    date: "2025-01-19T20:30:00+05:30", place: "pune_kp",
    text: "R cancelled. Third time. Completely fair reasons each time.",
    description: "A typed note about a friend cancelling plans.",
    tags: ["friends", "distance"],
    sentiment: { valence: -0.3, energy: 0.3, label: "disappointed", confidence: 0.8 },
    lifeThemes: ["friends"], eventType: "ordinary-moment", significance: "routine",
    question: "Did you say anything?",
    answer: "No. What would I even have said — your reasons are too good?",
    narrative: "R cancelled for the third time, with completely fair reasons each time. I didn't say anything. What would I have said — that his reasons were too good?"
  },

  /* --------------------------------------------------------- FEBRUARY */
  {
    date: "2025-02-09T19:00:00+05:30", place: "pune_home",
    image: "n25-feb-plateau.png",
    description: "A handwritten note about being stuck at the same level of skill for months.",
    extracted: "Six months in. I'm not getting worse. I'm not getting better. Nobody warns you about this part. Everyone posts the breakthrough.",
    tags: ["learning", "plateau", "handwritten"],
    sentiment: { valence: -0.35, energy: 0.35, label: "frustrated", confidence: 0.89 },
    lifeThemes: ["learning", "personal-growth"], eventType: "challenge", significance: "important",
    question: "What kept you going through the flat stretch?",
    answer: "Nothing noble. I'd told too many people I was doing it.",
    narrative: "Six months in and neither improving nor declining. Nobody warns you about that stretch, because everyone posts the breakthrough. What kept me going wasn't noble — I'd simply told too many people I was doing it."
  },
  {
    date: "2025-02-23T12:30:00+05:30", place: "mumbai_fort",
    text: "Day trip to Mumbai for no reason. Walked from Fort to Colaba and back. Ate twice.",
    description: "A typed note about an unplanned day trip to Mumbai.",
    tags: ["travel", "mumbai", "walking"],
    sentiment: { valence: 0.58, energy: 0.55, label: "calm", confidence: 0.85 },
    lifeThemes: ["travel", "food"], eventType: "journey", significance: "notable",
    question: "Why that day in particular?",
    answer: "I'd have spent the whole Sunday not studying anyway. At least this way I moved.",
    narrative: "A day trip to Mumbai for no reason at all — Fort to Colaba and back, eating twice. I'd have spent the Sunday not studying anyway, and at least this way I moved."
  },

  /* ------------------------------------------------------------ MARCH */
  {
    date: "2025-03-11T21:00:00+05:30", place: "pune_home",
    text: "Saw that the role I didn't apply for in October got filled. Looked up who got it. Should not have done that.",
    description: "A typed note about looking up who was hired for a job not applied for.",
    tags: ["career", "regret"],
    sentiment: { valence: -0.6, energy: 0.5, label: "regretful", confidence: 0.91 },
    lifeThemes: ["career"], eventType: "regret", significance: "important",
    question: "What did you feel when you saw?",
    answer: "That they weren't obviously more qualified than me. Which was worse than if they had been.",
    narrative: "The role I didn't apply for in October got filled, and I looked up who took it, which I should not have done. They weren't obviously more qualified than me — which was worse than if they had been."
  },
  {
    date: "2025-03-30T08:00:00+05:30", place: "pune_tekdi",
    text: "Up the hill at six because I couldn't sleep. Three other people up there, all of us pretending we do this every day.",
    description: "A typed note about an early walk after a sleepless night.",
    tags: ["walking", "sleeplessness"],
    sentiment: { valence: 0.2, energy: 0.4, label: "reflective", confidence: 0.78 },
    lifeThemes: ["health"], eventType: "ordinary-moment", significance: "routine",
    question: "What kept you awake?",
    answer: "The usual loop. Nothing new in it.",
    narrative: "Up the hill at six because sleep hadn't happened. Three others were up there, all of us pretending we do this every day."
  },

  /* ------------------------------------------------------------ APRIL */
  {
    date: "2025-04-09T17:30:00+05:30", place: "pune_camp",
    image: "r25-apr-hardware.png",
    description: "A hardware shop receipt from National Hardware in Camp, Pune, for a desk lamp and cabling.",
    extracted: "NATIONAL HARDWARE, Camp, Pune 411001, Est. 1968. Desk lamp 890.00, Cable ties 60.00, Power strip 450.00. TOTAL 1,400.00. 09 APR 2025. CASH.",
    entities: [{ name: "National Hardware", type: "organization" }],
    tags: ["home", "setup", "pune"],
    sentiment: { valence: 0.42, energy: 0.55, label: "hopeful", confidence: 0.8 },
    lifeThemes: ["daily-life", "finance"], eventType: "ordinary-moment", significance: "routine",
    question: "What were you setting up?",
    answer: "A corner of the room that was only for the work. It helped more than it should have.",
    narrative: "A lamp, a power strip and a bag of cable ties from National Hardware. I was making one corner of the room only for the work, and it helped more than a lamp ought to."
  },
  {
    date: "2025-04-27T13:00:00+05:30", place: "pune_kothrud",
    text: "Amma asked if I still talk to R. I said of course. Then counted back and it's been eleven weeks.",
    description: "A typed note about realising how long it had been since speaking to a friend.",
    tags: ["friends", "family", "distance"],
    sentiment: { valence: -0.42, energy: 0.35, label: "lonely", confidence: 0.87 },
    lifeThemes: ["friends", "relationships"], eventType: "reflection", significance: "important",
    question: "Why didn't you message him then?",
    answer: "Because eleven weeks felt like it needed an occasion, and there wasn't one.",
    narrative: "Amma asked whether I still talk to R and I said of course, then counted back and found it had been eleven weeks. I didn't message him, because eleven weeks felt like it needed an occasion and there wasn't one."
  },

  /* -------------------------------------------------------------- MAY */
  {
    date: "2025-05-10T06:40:00+05:30", place: "delhi",
    image: "t25-may-flight.png",
    description: "A boarding pass for an early morning flight from Pune to Delhi, seat 18A.",
    extracted: "PUNE → DELHI. Terminal 1, Gate 4. SAT 10 MAY 2025 06:40. SEAT 18A. Boarding closes 06:10.",
    tags: ["travel", "delhi", "work"],
    sentiment: { valence: 0.3, energy: 0.6, label: "uncertain", confidence: 0.8 },
    lifeThemes: ["travel", "career"], eventType: "journey", significance: "notable",
    question: "What was the trip for?",
    answer: "A two-day workshop I'd been sent to instead of someone senior who dropped out.",
    narrative: "The 06:40 to Delhi, seat 18A, for a two-day workshop I'd been sent to only because someone senior dropped out. I spent the flight deciding whether that was an insult or an opening."
  },
  {
    date: "2025-05-11T19:00:00+05:30", place: "delhi",
    text: "Delhi in May is a different category of heat. Walked from the metro to the venue and had to sit down when I got there.",
    description: "A typed note about extreme heat in Delhi.",
    tags: ["travel", "delhi", "summer"],
    sentiment: { valence: -0.2, energy: 0.4, label: "frustrated", confidence: 0.79 },
    lifeThemes: ["travel", "health"], eventType: "ordinary-moment", significance: "routine",
    question: "How did the workshop go?",
    answer: "Better than the walk. Low bar.",
    narrative: "Delhi in May is a different category of heat entirely. I walked from the metro to the venue and had to sit down on arrival. The workshop went better than the walk, which is a low bar."
  },

  /* ------------------------------------------------------------- JUNE */
  {
    date: "2025-06-18T22:00:00+05:30", place: "pune_home",
    image: "n25-jun-friend.png",
    description: "A handwritten note about a friendship that has quietly faded.",
    extracted: "Realised I haven't spoken to R in four months. Nothing happened. That's the strange part. It just got quieter and neither of us noticed.",
    tags: ["friends", "distance", "handwritten"],
    sentiment: { valence: -0.5, energy: 0.3, label: "lonely", confidence: 0.9 },
    lifeThemes: ["friends", "relationships"], eventType: "loss", significance: "important",
    question: "Did you consider reaching out?",
    answer: "Every week. And every week I decided the next week would be less awkward.",
    narrative: "Four months without speaking to R, and nothing had happened — that was the strange part. It just got quieter and neither of us noticed. I considered reaching out every week, and every week decided the next one would be less awkward."
  },
  {
    date: "2025-06-29T18:00:00+05:30", place: "pune_home",
    text: "Monsoon arrived while I was on a call. Looked up halfway through a sentence and everything outside had gone white.",
    description: "A typed note about the monsoon arriving mid-call.",
    tags: ["monsoon", "pune", "work"],
    sentiment: { valence: 0.55, energy: 0.5, label: "joyful", confidence: 0.86 },
    lifeThemes: ["daily-life"], eventType: "ordinary-moment", significance: "routine",
    question: "Did you finish the call?",
    answer: "Yes, badly. I have no memory of the second half.",
    narrative: "The monsoon arrived while I was on a call. I looked up mid-sentence and everything outside had gone white. I finished the call badly and remember none of the second half."
  },

  /* ------------------------------------------------------------- JULY */
  {
    date: "2025-07-12T20:00:00+05:30", place: "pune_home",
    text: "Someone at work asked if I'd present at the Bengaluru summit. I said yes before I'd thought about it, which is the only reason I said yes.",
    description: "A typed note about agreeing to give a conference talk.",
    tags: ["career", "speaking"],
    sentiment: { valence: 0.25, energy: 0.72, label: "excited", confidence: 0.85 },
    lifeThemes: ["career", "personal-growth"], eventType: "decision", significance: "important",
    question: "Would you have said yes with time to think?",
    answer: "No. Absolutely not.",
    narrative: "Someone asked if I'd present at the Bengaluru summit and I said yes before I'd thought about it — which is the only reason I said yes. With time to think I'd have declined."
  },
  {
    date: "2025-07-26T11:00:00+05:30", place: "pune_kothrud",
    text: "Practised the talk to an empty room. Twelve minutes became nineteen. Cut it, practised again, nineteen again.",
    description: "A typed note about rehearsing a presentation.",
    tags: ["preparation", "career"],
    sentiment: { valence: -0.1, energy: 0.6, label: "uncertain", confidence: 0.82 },
    lifeThemes: ["career"], eventType: "challenge", significance: "routine",
    question: "What was making it run long?",
    answer: "Explaining things nobody had asked about, in case they did.",
    narrative: "Practised the talk to an empty room. Twelve minutes turned into nineteen, and cutting it changed nothing. I was explaining things nobody had asked about, in case they did."
  },

  /* ----------------------------------------------------------- AUGUST */
  {
    date: "2025-08-16T09:00:00+05:30", place: "goa_panaji",
    text: "Goa in August. Everything shut, everything green, four people on the whole beach. Best decision I've made all year.",
    description: "A typed note about visiting Goa during the off-season.",
    tags: ["travel", "goa", "monsoon", "solitude"],
    sentiment: { valence: 0.68, energy: 0.35, label: "calm", confidence: 0.9 },
    lifeThemes: ["travel", "personal-growth"], eventType: "journey", significance: "important",
    question: "What did the emptiness give you?",
    answer: "Room to be bored. I'd forgotten what that was like.",
    narrative: "Goa in August — everything shut, everything green, four people on the whole beach. It gave me room to be bored, and I'd forgotten what that felt like."
  },
  {
    date: "2025-08-30T21:10:00+05:30", place: "pune_camp",
    image: "r25-aug-dinner.png",
    description: "A restaurant bill from Kolkata Kitchen in Camp, Pune, for three guests.",
    extracted: "KOLKATA KITCHEN, Camp, Pune 411001. Kosha Mangsho 460.00, Luchi x4 160.00, Mishti Doi x2 180.00. TOTAL 918.00. Table 7, 3 guests. 30 AUG 2025 21:10.",
    entities: [{ name: "Kolkata Kitchen", type: "organization" }],
    tags: ["food", "friends", "pune"],
    sentiment: { valence: 0.6, energy: 0.55, label: "joyful", confidence: 0.87 },
    lifeThemes: ["friends", "food"], eventType: "ordinary-moment", significance: "notable",
    question: "Who were the other two?",
    answer: "New friends from the course. Easier than old friends, in a way I feel guilty about.",
    narrative: "Dinner for three at Kolkata Kitchen, table seven. Two people from the course — new friends, easier than old friends in a way I felt slightly guilty about."
  },

  /* -------------------------------------------------------- SEPTEMBER */
  {
    date: "2025-09-14T15:00:00+05:30", place: "pune_home",
    text: "Rewrote the talk from scratch. Threw away everything I was proud of and kept only what I'd say out loud to a friend.",
    description: "A typed note about rewriting a presentation.",
    tags: ["preparation", "career", "editing"],
    sentiment: { valence: 0.4, energy: 0.6, label: "hopeful", confidence: 0.85 },
    lifeThemes: ["career", "learning"], eventType: "decision", significance: "notable",
    question: "What made you throw it out?",
    answer: "I read it aloud and heard someone trying to sound clever.",
    narrative: "Rewrote the talk from scratch, discarding everything I'd been proud of and keeping only what I'd actually say to a friend. I'd read it aloud and heard someone trying to sound clever."
  },

  /* ---------------------------------------------------------- OCTOBER */
  {
    date: "2025-10-15T22:30:00+05:30", place: "bengaluru",
    image: "n25-oct-talk.png",
    description: "A handwritten note written the night before giving a conference talk.",
    extracted: "Notes before the talk. Twelve minutes. Forty people. I have said all of this out loud in my room nine times. It is still terrifying.",
    tags: ["career", "nerves", "handwritten"],
    sentiment: { valence: -0.05, energy: 0.8, label: "uncertain", confidence: 0.9 },
    lifeThemes: ["career", "personal-growth"], eventType: "challenge", significance: "important",
    question: "What were you most afraid of?",
    answer: "Not forgetting the words. Being found out.",
    narrative: "The night before the talk, in a hotel room in Bengaluru. Twelve minutes, forty people, nine rehearsals in my own room, and still terrifying. What frightened me wasn't forgetting the words. It was being found out."
  },
  {
    date: "2025-10-16T09:00:00+05:30", place: "bengaluru",
    image: "t25-oct-conf.png",
    description: "A speaker pass for the Bengaluru Tech Summit at BIEC.",
    extracted: "ADMIT ONE. BENGALURU TECH SUMMIT. BIEC, Bengaluru. THU 16 OCT 2025 9:00 AM. SPK-22. Speaker pass, Track 3.",
    entities: [{ name: "BIEC", type: "venue" }],
    tags: ["career", "conference", "bengaluru"],
    sentiment: { valence: 0.72, energy: 0.85, label: "proud", confidence: 0.92 },
    lifeThemes: ["career", "achievement"], eventType: "achievement", significance: "milestone",
    question: "How did it actually go?",
    answer: "Fine. Two people asked questions. One of them was a good question.",
    narrative: "Speaker pass, track three, twelve minutes in front of forty people. It went fine. Two people asked questions and one of them was a good question, which I've thought about more than the talk itself."
  },
  {
    date: "2025-10-16T20:00:00+05:30", place: "bengaluru",
    text: "Walked around Cubbon Park afterwards on my own for an hour. Adrenaline had nowhere to go.",
    description: "A typed note about walking off nerves after a talk.",
    tags: ["bengaluru", "walking", "aftermath"],
    sentiment: { valence: 0.5, energy: 0.45, label: "relieved", confidence: 0.88 },
    lifeThemes: ["travel", "personal-growth"], eventType: "reflection", significance: "notable",
    question: "What were you thinking about?",
    answer: "Mostly that I'd been dreading it for three months and it took twelve minutes.",
    narrative: "Walked Cubbon Park alone for an hour afterwards because the adrenaline had nowhere to go. Mostly I thought about having dreaded it for three months and it taking twelve minutes."
  },

  /* --------------------------------------------------------- NOVEMBER */
  {
    date: "2025-11-08T19:30:00+05:30", place: "pune_home",
    text: "Someone from the summit emailed asking if I'd write it up. Said yes. Then sat looking at an empty document for two days.",
    description: "A typed note about being asked to write up a talk.",
    tags: ["career", "writing"],
    sentiment: { valence: 0.3, energy: 0.5, label: "uncertain", confidence: 0.8 },
    lifeThemes: ["career", "learning"], eventType: "challenge", significance: "notable",
    question: "What made writing harder than speaking?",
    answer: "Speaking is over in twelve minutes. Writing stays there.",
    narrative: "Someone from the summit asked if I'd write the talk up, and I said yes, then looked at an empty document for two days. Speaking ends in twelve minutes. Writing stays where you left it."
  },
  {
    date: "2025-11-24T13:00:00+05:30", place: "pune_kp",
    text: "Sunday lunch. Told them about the talk. Appa asked what a summit is and I explained it three times and he still nodded politely.",
    description: "A typed note about explaining a conference talk to family.",
    tags: ["family", "food"],
    sentiment: { valence: 0.45, energy: 0.42, label: "nostalgic", confidence: 0.82 },
    lifeThemes: ["family"], eventType: "ordinary-moment", significance: "routine",
    question: "Did it matter that he didn't follow it?",
    answer: "Not at all. He told the neighbours anyway.",
    narrative: "Told the family about the talk at Sunday lunch. Appa asked what a summit is and I explained three times to polite nodding. It didn't matter — he told the neighbours anyway."
  },

  /* --------------------------------------------------------- DECEMBER */
  {
    date: "2025-12-06T21:00:00+05:30", place: "pune_home",
    text: "Started something of my own. No plan, no name, just an idea I couldn't stop turning over. First evening on it went past midnight without me noticing.",
    description: "A typed note about beginning a personal project.",
    tags: ["project", "beginning"],
    sentiment: { valence: 0.7, energy: 0.85, label: "excited", confidence: 0.9 },
    lifeThemes: ["hobbies", "learning", "personal-growth"], eventType: "decision", significance: "milestone",
    question: "What was the idea?",
    answer: "Something about keeping things. It wasn't clear yet.",
    narrative: "Started something of my own in December — no plan, no name, just an idea about keeping things that I couldn't stop turning over. The first evening went past midnight without me noticing."
  },
  {
    date: "2025-12-21T16:00:00+05:30", place: "pune_home",
    text: "Two weeks in and the whole thing is held together with string. But it does the one thing I wanted it to do.",
    description: "A typed note about early progress on a personal project.",
    tags: ["project", "progress"],
    sentiment: { valence: 0.6, energy: 0.7, label: "proud", confidence: 0.86 },
    lifeThemes: ["hobbies", "achievement"], eventType: "achievement", significance: "notable",
    question: "What was the one thing?",
    answer: "You put something in and it comes back meaning more than it did.",
    narrative: "Two weeks in and the whole thing is string and hope, but it does the one thing I wanted: you put something in, and it comes back meaning more than it did."
  },
  {
    date: "2025-12-31T22:00:00+05:30", place: "pune_home",
    text: "Quiet one this year. Read back through the notebook. February was worse than I remembered and October was better.",
    description: "A typed note reviewing the year on New Year's Eve.",
    tags: ["reflection", "year-end"],
    sentiment: { valence: 0.35, energy: 0.35, label: "reflective", confidence: 0.88 },
    lifeThemes: ["personal-growth"], eventType: "reflection", significance: "important",
    question: "What surprised you reading it back?",
    answer: "How much of the year I'd already misremembered, in both directions.",
    narrative: "A quiet New Year's Eve, spent reading back through the notebook. February was worse than I remembered and October was better. I'd already misremembered most of the year, in both directions."
  }
];
