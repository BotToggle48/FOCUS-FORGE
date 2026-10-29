export interface PhilosophyQuote {
  id: number;
  quote: string;
  source?: string;
}

/**
 * 30 unique original philosophical reflections on discipline, integrity,
 * patience, purpose, courage, consistency, and wisdom.
 * No false attribution to historical figures.
 */
export const PHILOSOPHY_QUOTES: PhilosophyQuote[] = [
  {
    id: 1,
    quote: "True discipline is not self-denial; it is the quiet choice to protect what matters most from what merely glitters.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 2,
    quote: "Mastery does not arrive with a fanfare. It gathers softly in the unobserved hours of deliberate repetition.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 3,
    quote: "Begin before certainty arrives. Action clarifies the landscape far more swiftly than speculation ever will.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 4,
    quote: "When your purpose runs deep, fleeting discomfort loses its leverage over your resolve.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 5,
    quote: "Difficulty is not a signal to turn back; it is the friction where capability is actively forged.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 6,
    quote: "The present moment asks only for your complete attention. Meet it without carrying yesterday's regrets.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 7,
    quote: "Clarity comes from subtraction. Remove the non-essential until only what commands genuine reverence remains.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 8,
    quote: "Do not wait for inspiration to begin; momentum is an effect of motion, not a precondition.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 9,
    quote: "A steady pace held across ordinary days will outrun any burst of sporadic brilliance.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 10,
    quote: "In a world of perpetual noise, undisturbed stillness is an act of sovereign power.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 11,
    quote: "Integrity is the quiet harmony between who you claim to be and how you behave when nobody is watching.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 12,
    quote: "The obstacle in front of you is not preventing your progress; it is testing the weight of your commitment.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 13,
    quote: "Patience is not passive waiting. It is the active composure of trusting the harvest while tending the soil.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 14,
    quote: "Knowing the path is merely an intellectual curiosity; walking it one faithful step at a time is true wisdom.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 15,
    quote: "Small, relentless efforts compound in silence long before the world notices any transformation.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 16,
    quote: "Guard the gates of your mind. What you allow to occupy your attention shapes the architecture of your life.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 17,
    quote: "Where your unbroken attention lingers, depth and insight will unfailingly take root.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 18,
    quote: "Courage is rarely loud. Most often it is the gentle whisper at the end of the day saying, 'I will try again tomorrow.'",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 19,
    quote: "Calm within the mind creates an unshakeable fortress against external turmoil.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 20,
    quote: "Habit is a faithful companion. When motivation evaporates, clean structure carries you across the finish line.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 21,
    quote: "Conquering external challenges gives you momentary leverage; governing your own impulses gives you lasting freedom.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 22,
    quote: "Approach each endeavor with humility and curious eyes. Every encounter contains something worth learning.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 23,
    quote: "How we spend our days is, of course, how we spend our lives.",
    source: "Annie Dillard",
  },
  {
    id: 24,
    quote: "Commit entirely to the single task before you. Scattered light produces shadows, while focused light ignites fire.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 25,
    quote: "Notice the quiet beauty in small milestones. Even the grandest cathedral began with the patient laying of a single stone.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 26,
    quote: "True peace of mind begins the instant you release what was never within your jurisdiction to control.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 27,
    quote: "A monumental ambition is simply a sequence of ordinary tasks executed with extraordinary fidelity.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 28,
    quote: "Silence is not the absence of meaning, but the birthplace of clarity and deep discernment.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 29,
    quote: "Treat the work at hand with the reverence of a master craftsman, leaving no room for half-hearted attempts.",
    source: "Focus Sanctuary Reflection",
  },
  {
    id: 30,
    quote: "Your aspirations define your direction, but your daily rituals determine your destination.",
    source: "Focus Sanctuary Reflection",
  },
];

export function getTodayPhilosophyQuote(dayOffset: number = 0): PhilosophyQuote {
  const now = new Date();
  const dayOfMonth = now.getDate(); // 1 - 31
  // Modulo 30 to get 0 - 29 index
  const index = ((dayOfMonth - 1 + dayOffset) % 30 + 30) % 30;
  return PHILOSOPHY_QUOTES[index];
}
