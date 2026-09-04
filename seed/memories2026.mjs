/**
 * 2026 — the arcs resolve, unevenly.
 *
 *   learning     the thing clicks in February, two years after starting
 *   friendship   R calls in May; neither apologises
 *   missed opp   a second chance in June; taken this time
 *   project      builds through spring, breaks in July, ships in August
 *   confidence   settled rather than triumphant
 *   travel       Delhi in January, Mumbai, Goa alone in the monsoon
 */

export const MEMORIES_2026 = [
  /* ---------------------------------------------------------- JANUARY */
  {
    date: "2026-01-11T11:00:00+05:30", place: "delhi",
    image: "t26-jan-museum.png",
    description: "A ticket for the National Rail Museum in Chanakyapuri, New Delhi.",
    extracted: "ADMIT ONE. NATIONAL RAIL MUSEUM. Chanakyapuri, New Delhi. SUN 11 JAN 2026 11:00 AM. D-402. Adult, toy train included.",
    entities: [{ name: "National Rail Museum", type: "venue" }],
    tags: ["travel", "delhi", "museum"],
    sentiment: { valence: 0.6, energy: 0.45, label: "joyful", confidence: 0.86 },
    lifeThemes: ["travel", "hobbies"], eventType: "discovery", significance: "notable",
    question: "What were you doing in Delhi in January?",
    answer: "Same workshop as last year. This time I asked to go.",
    narrative: "The Rail Museum on a cold Delhi Sunday, toy train included. I was there for the same workshop as last May, except this time I'd asked to go rather than being sent."
  },
  {
    date: "2026-01-25T20:00:00+05:30", place: "pune_home",
    text: "Project has a shape now. Still no name. Explained it to someone at work and heard myself say 'your life doesn't happen in text boxes' and then wrote it down.",
    description: "A typed note about articulating a project's idea for the first time.",
    tags: ["project", "clarity"],
    sentiment: { valence: 0.72, energy: 0.75, label: "excited", confidence: 0.9 },
    lifeThemes: ["hobbies", "personal-growth"], eventType: "discovery", significance: "important",
    question: "Why did that sentence stick?",
    answer: "Because I'd been trying to explain it for six weeks and that took four seconds.",
    narrative: "The project has a shape now, if not a name. Explaining it to someone at work I heard myself say that your life doesn't happen in text boxes, and wrote it down immediately — six weeks of trying to explain it, and that took four seconds."
  },

  /* --------------------------------------------------------- FEBRUARY */
  {
    date: "2026-02-14T09:30:00+05:30", place: "pune_home",
    image: "n26-feb-click.png",
    description: "A handwritten note recording the moment a long-difficult concept became clear.",
    extracted: "It clicked. Two years. Two whole years of not getting it. And then this morning I read the same paragraph and it was obvious.",
    tags: ["learning", "breakthrough", "handwritten"],
    sentiment: { valence: 0.85, energy: 0.7, label: "proud", confidence: 0.94 },
    lifeThemes: ["learning", "achievement", "personal-growth"], eventType: "milestone", significance: "milestone",
    question: "What do you think actually changed?",
    answer: "Nothing in the paragraph. Two years of failing at it, apparently, was the mechanism.",
    narrative: "It clicked. Two years of not getting it, and then one morning the same paragraph was simply obvious. Nothing in the paragraph had changed. Two years of failing at it was, apparently, the mechanism."
  },
  {
    date: "2026-02-22T14:00:00+05:30", place: "pune_kothrud",
    text: "Explained the thing that clicked to someone else. Watched them not get it. Understood for the first time how patient everyone has been with me.",
    description: "A typed note about trying to teach a newly understood concept.",
    tags: ["learning", "teaching", "empathy"],
    sentiment: { valence: 0.4, energy: 0.5, label: "reflective", confidence: 0.86 },
    lifeThemes: ["learning", "relationships"], eventType: "reflection", significance: "notable",
    question: "Did you manage to explain it in the end?",
    answer: "No. But I stopped trying to be impressive about it, which helped.",
    narrative: "Tried to explain the thing that clicked and watched someone not get it. I understood for the first time how patient people had been with me. I never did explain it, but I stopped trying to be impressive about it, which helped."
  },

  /* ------------------------------------------------------------ MARCH */
  {
    date: "2026-03-02T11:00:00+05:30", place: "pune_kothrud",
    image: "r26-mar-cert.png",
    description: "A payment receipt from Pune Institute of Technology for a certification fee.",
    extracted: "PUNE INSTITUTE OF TECHNOLOGY, Certification Office, Kothrud, Pune 411038. Certification fee 4,500.00, Exam re-sit credit -1,500.00. TOTAL 3,000.00. Receipt of payment. 02 MAR 2026. NEFT.",
    entities: [{ name: "Pune Institute of Technology", type: "organization" }],
    tags: ["learning", "certification", "pune"],
    sentiment: { valence: 0.55, energy: 0.55, label: "hopeful", confidence: 0.85 },
    lifeThemes: ["learning", "finance", "achievement"], eventType: "decision", significance: "important",
    question: "What does the re-sit credit refer to?",
    answer: "The exam I failed in 2025 and had stopped mentioning.",
    narrative: "Paid the certification fee, with a credit for a re-sit — the exam I failed in 2025 and had quietly stopped mentioning to anyone. Three thousand rupees to try again."
  },
  {
    date: "2026-03-19T21:30:00+05:30", place: "pune_home",
    text: "Project ate the whole weekend. Made something work at 1am and sat there grinning at a screen like an idiot.",
    description: "A typed note about late-night progress on a personal project.",
    tags: ["project", "late night"],
    sentiment: { valence: 0.8, energy: 0.82, label: "excited", confidence: 0.9 },
    lifeThemes: ["hobbies", "achievement"], eventType: "achievement", significance: "notable",
    question: "What was the thing that worked?",
    answer: "Dropping a photo in and getting something back that sounded like me.",
    narrative: "The project ate the whole weekend. At one in the morning I dropped a photo in and got back something that sounded like me, and sat grinning at a screen like an idiot."
  },

  /* ------------------------------------------------------------ APRIL */
  {
    date: "2026-04-05T13:00:00+05:30", place: "mumbai_colaba",
    text: "Mumbai with the course friends. Ate at four places in six hours and regretted none of it.",
    description: "A typed note about a day of eating in Mumbai with friends.",
    tags: ["travel", "mumbai", "food", "friends"],
    sentiment: { valence: 0.75, energy: 0.7, label: "joyful", confidence: 0.9 },
    lifeThemes: ["friends", "food", "travel"], eventType: "celebration", significance: "notable",
    question: "What was the best of the four?",
    answer: "A place with no sign that someone's cousin knew about.",
    narrative: "Mumbai with the course friends — four places in six hours, no regrets. The best had no sign at all and existed only because someone's cousin knew about it."
  },
  {
    date: "2026-04-18T22:00:00+05:30", place: "pune_home",
    text: "Certification exam in three weeks. Studying the same material that beat me last year. It looks different now, which is either progress or arrogance.",
    description: "A typed note about revising for a re-sit exam.",
    tags: ["learning", "exam"],
    sentiment: { valence: 0.35, energy: 0.62, label: "hopeful", confidence: 0.83 },
    lifeThemes: ["learning"], eventType: "challenge", significance: "notable",
    question: "Which do you think it is?",
    answer: "Ask me on the twelfth of May.",
    narrative: "Three weeks to the exam, revising the material that beat me last year. It looks different now, which is either progress or arrogance. I'll know on the twelfth of May."
  },

  /* -------------------------------------------------------------- MAY */
  {
    date: "2026-05-12T17:00:00+05:30", place: "pune_kothrud",
    text: "Passed. Comfortably. Walked out and had to check the result twice on my phone in the corridor.",
    description: "A typed note about passing a certification exam.",
    tags: ["learning", "achievement", "relief"],
    sentiment: { valence: 0.88, energy: 0.75, label: "proud", confidence: 0.94 },
    lifeThemes: ["learning", "achievement"], eventType: "milestone", significance: "milestone",
    question: "What was different from failing it?",
    answer: "Nothing about the room. Everything about walking out of it.",
    narrative: "Passed the certification, comfortably, and checked the result twice on my phone in the corridor before I believed it. Nothing about the room was different from last year. Everything about walking out of it was."
  },
  {
    date: "2026-05-20T20:45:00+05:30", place: "pune_home",
    image: "n26-may-r.png",
    description: "A handwritten note about an unexpected call from a long-absent friend.",
    extracted: "R called. Out of nowhere. Ninety minutes like no time had passed at all. I don't think either of us apologised. Didn't need to.",
    tags: ["friends", "reconnection", "handwritten"],
    sentiment: { valence: 0.78, energy: 0.55, label: "relieved", confidence: 0.92 },
    lifeThemes: ["friends", "relationships"], eventType: "transition", significance: "milestone",
    question: "What did you talk about for ninety minutes?",
    answer: "Nothing. Which is how I knew it was fine.",
    narrative: "R called out of nowhere and we talked for ninety minutes as though no time had passed. Neither of us apologised and neither needed to. We talked about nothing, which is how I knew it was fine."
  },
  {
    date: "2026-05-30T15:00:00+05:30", place: "pune_kp",
    text: "Coffee with R in person. Fourteen months. He's grown a beard and I've apparently started talking with my hands.",
    description: "A typed note about meeting a friend in person after a long gap.",
    tags: ["friends", "reunion", "pune"],
    sentiment: { valence: 0.8, energy: 0.6, label: "joyful", confidence: 0.91 },
    lifeThemes: ["friends"], eventType: "celebration", significance: "important",
    question: "Did it feel like fourteen months?",
    answer: "For about four minutes. Then not at all.",
    narrative: "Coffee with R in person after fourteen months. He's grown a beard and I've apparently started talking with my hands. It felt like fourteen months for about four minutes and then not at all."
  },

  /* ------------------------------------------------------------- JUNE */
  {
    date: "2026-06-09T10:00:00+05:30", place: "pune_home",
    text: "The same role came up again. Different company, same shape. Applied within the hour this time.",
    description: "A typed note about applying for a role similar to one previously passed over.",
    tags: ["career", "application"],
    sentiment: { valence: 0.65, energy: 0.78, label: "hopeful", confidence: 0.89 },
    lifeThemes: ["career", "personal-growth"], eventType: "decision", significance: "milestone",
    question: "What made this time different?",
    answer: "I'm no more qualified than I was in 2024. I just stopped waiting to feel qualified.",
    narrative: "The same role came up again — different company, same shape — and I applied within the hour. I'm no more qualified than I was in October 2024. I'd just stopped waiting to feel qualified."
  },
  {
    date: "2026-06-26T18:30:00+05:30", place: "pune_home",
    text: "Monsoon. Project broke completely for two days and I couldn't work out why. Turned out to be one line I'd written in March.",
    description: "A typed note about debugging a personal project.",
    tags: ["project", "debugging", "monsoon"],
    sentiment: { valence: -0.25, energy: 0.6, label: "frustrated", confidence: 0.87 },
    lifeThemes: ["hobbies", "learning"], eventType: "setback", significance: "notable",
    question: "How did you find it?",
    answer: "By explaining it out loud to nobody, which is embarrassing and works every time.",
    narrative: "The project broke completely for two days and the cause was one line I'd written in March. I found it by explaining the problem out loud to an empty room, which is embarrassing and works every time."
  },

  /* ------------------------------------------------------------- JULY */
  {
    date: "2026-07-11T09:00:00+05:30", place: "pune_home",
    text: "Interview went well enough that I've started imagining the commute, which is always a mistake.",
    description: "A typed note after a job interview.",
    tags: ["career", "interview"],
    sentiment: { valence: 0.45, energy: 0.65, label: "hopeful", confidence: 0.84 },
    lifeThemes: ["career"], eventType: "challenge", significance: "notable",
    question: "Why is imagining the commute a mistake?",
    answer: "Because you have to un-imagine it afterwards.",
    narrative: "The interview went well enough that I started imagining the commute, which is always a mistake — you only have to un-imagine it afterwards."
  },
  {
    date: "2026-07-23T15:50:00+05:30", place: "goa_palolem",
    image: "ticket-jul-train.png",
    description: "A train ticket from Pune to Madgao on the Goa Express, sleeper class, berth S4/32.",
    extracted: "PUNE → MADGAON. Indian Railways 12779 Goa Express. THU 23 JUL 2026 15:50. SEAT S4/32. Sleeper class, arrive 02:15.",
    entities: [{ name: "Goa Express", type: "transport" }],
    tags: ["travel", "goa", "train", "solitude"],
    sentiment: { valence: 0.55, energy: 0.5, label: "calm", confidence: 0.87 },
    lifeThemes: ["travel"], eventType: "journey", significance: "important",
    question: "Why alone this time?",
    answer: "Because I'd waited for company twice before and both trips never happened.",
    narrative: "The Goa Express out of Pune, berth S4/32, arriving at two in the morning. Alone this time, because I'd waited for company twice before and both trips never happened."
  },
  {
    date: "2026-07-26T07:30:00+05:30", place: "goa_palolem",
    text: "Woke before the rain and sat on the steps watching the sea come in grey. Not one other person out.",
    description: "A typed reflection written on a monsoon morning at Palolem beach in Goa.",
    tags: ["goa", "sea", "monsoon", "solitude"],
    sentiment: { valence: 0.7, energy: 0.3, label: "calm", confidence: 0.92 },
    lifeThemes: ["travel", "personal-growth"], eventType: "reflection", significance: "important",
    question: "What did that morning give you?",
    answer: "Permission to stop planning the rest of the trip.",
    narrative: "Woke before the rain at Palolem and sat on the steps watching a grey sea come in with nobody else out. It gave me permission to stop planning the rest of the trip, which I hadn't known I needed."
  },

  /* ----------------------------------------------------------- AUGUST */
  {
    date: "2026-08-04T19:00:00+05:30", place: "pune_home",
    text: "Offer. Same shape as the role I didn't apply for two years ago. Sat with it for an hour before replying, same as last time.",
    description: "A typed note about receiving a job offer.",
    tags: ["career", "offer"],
    sentiment: { valence: 0.82, energy: 0.7, label: "proud", confidence: 0.93 },
    lifeThemes: ["career", "achievement"], eventType: "milestone", significance: "milestone",
    question: "What did you think about for that hour?",
    answer: "October 2024, mostly. And how little of the difference is ability.",
    narrative: "The offer came in August, the same shape as the role I didn't apply for two years ago. I sat with it for an hour before replying, thinking mostly about October 2024 and how little of the difference between then and now is ability."
  },
  {
    date: "2026-08-09T09:30:00+05:30", place: "pune_gahunje",
    image: "ticket-aug-cricket.png",
    description: "A cricket ticket for a Ranji Trophy match at the MCA Stadium in Gahunje.",
    extracted: "ADMIT ONE. MAHARASHTRA vs KARNATAKA. MCA Stadium, Gahunje. SUN 09 AUG 2026 9:30 AM. SEAT N-47. North Stand, Ranji Trophy.",
    entities: [{ name: "MCA Stadium", type: "venue" }],
    tags: ["cricket", "pune", "solitude"],
    sentiment: { valence: 0.5, energy: 0.45, label: "calm", confidence: 0.84 },
    lifeThemes: ["hobbies"], eventType: "ordinary-moment", significance: "routine",
    question: "Who did you go with?",
    answer: "Nobody. Turned out about two hundred of us had the same idea.",
    narrative: "A Ranji match at Gahunje, north stand, seat N-47. I went alone and so had about two hundred other people. Domestic cricket on a Sunday has a particular kind of company to it."
  },
  {
    date: "2026-08-22T20:35:00+05:30", place: "pune_kp",
    image: "receipt-aug-restaurant.png",
    description: "A restaurant bill from Malaka Spice in Koregaon Park, Pune, for a table of four.",
    extracted: "MALAKA SPICE, Lane 6, Koregaon Park, Pune 411001. Nasi Goreng 480.00, Thai Green Curry 520.00, Fresh Lime Soda x2 240.00. TOTAL 1,456.00. Table 12, 4 guests. 22 AUG 2026 20:35.",
    entities: [{ name: "Malaka Spice", type: "organization" }],
    tags: ["food", "friends", "pune"],
    sentiment: { valence: 0.72, energy: 0.6, label: "joyful", confidence: 0.89 },
    lifeThemes: ["friends", "food"], eventType: "celebration", significance: "notable",
    question: "What was the occasion?",
    answer: "The new job, nominally. Mostly four of us being free on the same evening.",
    narrative: "Dinner at Malaka Spice, table twelve, four of us. Nominally for the new job. Mostly because four people were free on the same evening, which happens less than it used to."
  },
  {
    date: "2026-08-30T20:15:00+05:30", place: "pune_home",
    text: "Cleaned out the desk drawer and found a boarding pass from 2019 I have no memory of. Same name, same city, no recollection. Kept it.",
    description: "A typed note about finding an unremembered boarding pass.",
    tags: ["memory", "objects"],
    sentiment: { valence: 0.15, energy: 0.35, label: "nostalgic", confidence: 0.88 },
    lifeThemes: ["personal-growth", "daily-life"], eventType: "discovery", significance: "notable",
    question: "Why did you keep it?",
    answer: "Because forgetting something that completely felt like it deserved a witness.",
    narrative: "Found a boarding pass from 2019 in the desk drawer with my name on it and no memory attached at all. I kept it, because forgetting something that completely seemed to deserve a witness."
  }
];
