/**
 * opse.ts – Deterministic implementation of ALL One Page Solo Engine tables.
 * Pure TypeScript: zero React imports, zero side-effects, fully testable.
 *
 * Sources: "One Page Solo Engine v1.6 – CC-BY-SA 4.0" by Karl Hendricks.
 */

import { rollD6, rollD4, rollD12, drawCard, type Suit } from './rng';

// ============================================================
// TYPES
// ============================================================

export type ActionOutcome = 'StrongHit' | 'WeakHit' | 'Miss';
export type OracleLikelihood = 'Likely' | 'Even' | 'Unlikely';

export interface ActionResolutionResult {
  roll: number;
  outcome: ActionOutcome;
  /** Present only on WeakHit (complication) or Miss (hard move) */
  pacingMove?: string;
  failureMove?: string;
  /** Whether a Pacing Move was triggered (lull / complication situation) */
  pacingTriggered: boolean;
}

export interface OracleYesNoResult {
  roll: number;
  modifier: 'but...' | '' | 'and...';
  answer: boolean;
  fullAnswer: string;
}

export interface DungeonRoomRaw {
  location: string;
  encounter: string;
  object: string;
  exits: string;
}

export interface PlotHook {
  objective: string;
  adversary: string;
  reward: string;
}

export interface DungeonTheme {
  appearance: string; // DETAIL FOCUS
  usage: string;      // ACTION FOCUS
  suit: Suit;
}

// ============================================================
// PACING & FAILURE MOVES (GM Moves)
// ============================================================

const PACING_MOVES: readonly string[] = [
  'Foreshadow Trouble',
  'Reveal a New Detail',
  'An NPC Takes Action',
  'Advance a Threat',
  'Advance a Plot',
  'Random Event',
] as const;

const FAILURE_MOVES: readonly string[] = [
  'Cause Harm',
  'Put Someone in a Spot',
  'Offer a Choice',
  'Advance a Threat',
  'Reveal an Unwelcome Truth',
  'Foreshadow Trouble',
] as const;

export function rollPacingMove(): string {
  return PACING_MOVES[rollD6() - 1];
}

export function rollFailureMove(): string {
  return FAILURE_MOVES[rollD6() - 1];
}

// ============================================================
// SCENE COMPLICATION / ALTERED SCENE
// ============================================================

const SCENE_COMPLICATIONS: readonly string[] = [
  'Hostile forces oppose you',
  'An obstacle blocks your way',
  "Wouldn't it suck if…",
  'An NPC acts suddenly',
  'All is not as it seems',
  'Things actually go as planned',
] as const;

const ALTERED_SCENES: readonly string[] = [
  'A major detail of the scene is enhanced or somehow worse',
  'The environment is different',
  'Unexpected NPCs are present',
  'Add a Scene Complication',
  'Add a Pacing Move',
  'Add a Random Event',
] as const;

export function rollSceneComplication(): string {
  return SCENE_COMPLICATIONS[rollD6() - 1];
}

/** Returns altered scene result if roll is 5+, otherwise null */
export function rollAlteredScene(): string | null {
  const r = rollD6();
  if (r >= 5) return ALTERED_SCENES[r - 1];
  return null;
}

// ============================================================
// ORACLE – YES/NO
// ============================================================

const LIKELIHOOD_THRESHOLDS: Record<OracleLikelihood, number> = {
  Likely: 3,
  Even: 4,
  Unlikely: 5,
};

/**
 * Resolves a Yes/No Oracle question.
 * @param likelihood – How likely is a Yes answer
 * @param chaosFactor – Current CF (1-9). Baseline = 5. Higher CF lowers threshold (more Yes).
 */
export function rollOracleYesNo(
  likelihood: OracleLikelihood,
  chaosFactor: number = 5
): OracleYesNoResult {
  const roll = rollD6();
  const modRoll = rollD6();

  const cfModifier = 5 - Math.max(1, Math.min(9, chaosFactor)); // positive = harder, negative = easier
  const baseThreshold = LIKELIHOOD_THRESHOLDS[likelihood];
  // Adjusted threshold: CF 5 = no change; CF 7 = threshold -1 (easier); CF 3 = threshold +1 (harder)
  const adjustedThreshold = Math.max(1, Math.min(6, baseThreshold + cfModifier));

  const answer = roll >= adjustedThreshold;

  let modifier: OracleYesNoResult['modifier'] = '';
  if (modRoll === 1) modifier = 'but...';
  else if (modRoll === 6) modifier = 'and...';

  const answerWord = answer ? 'Yes' : 'No';
  const fullAnswer = modifier ? `${answerWord}, ${modifier}` : answerWord;

  return { roll, modifier, answer, fullAnswer };
}

// ============================================================
// ORACLE – HOW (magnitude)
// ============================================================

const ORACLE_HOW_RESULTS: readonly string[] = [
  'Surprisingly lacking',
  'Less than expected',
  'About average',
  'About average',
  'More than expected',
  'Extraordinary',
] as const;

export function rollOracleHow(): string {
  return ORACLE_HOW_RESULTS[rollD6() - 1];
}

// ============================================================
// ORACLE FOCUS TABLES (Card-based)
// ============================================================

const ACTION_FOCUS: Record<number, string> = {
  2:  'Seek',
  3:  'Oppose',
  4:  'Communicate',
  5:  'Move',
  6:  'Harm',
  7:  'Create',
  8:  'Reveal',
  9:  'Command',
  10: 'Take',
  11: 'Protect',
  12: 'Assist',
  13: 'Transform',
  14: 'Deceive',
};

const DETAIL_FOCUS: Record<number, string> = {
  2:  'Small',
  3:  'Large',
  4:  'Old',
  5:  'New',
  6:  'Mundane',
  7:  'Simple',
  8:  'Complex',
  9:  'Unsavory',
  10: 'Specialized',
  11: 'Unexpected',
  12: 'Exotic',
  13: 'Dignified',
  14: 'Unique',
};

const TOPIC_FOCUS: Record<number, string> = {
  2:  'Current Need',
  3:  'Allies',
  4:  'Community',
  5:  'History',
  6:  'Future Plans',
  7:  'Enemies',
  8:  'Knowledge',
  9:  'Rumors',
  10: 'A Plot Arc',
  11: 'Recent Events',
  12: 'Equipment',
  13: 'A Faction',
  14: 'The PCs',
};

export function drawActionFocus(): { value: string; suit: Suit } {
  const card = drawCard();
  if (card.isJoker) return { value: 'Random Event', suit: 'clubs' };
  return { value: ACTION_FOCUS[card.rank] ?? 'Seek', suit: card.suit };
}

export function drawDetailFocus(): { value: string; suit: Suit } {
  const card = drawCard();
  if (card.isJoker) return { value: 'Unique', suit: 'spades' };
  return { value: DETAIL_FOCUS[card.rank] ?? 'Simple', suit: card.suit };
}

export function drawTopicFocus(): { value: string; suit: Suit } {
  const card = drawCard();
  if (card.isJoker) return { value: 'The PCs', suit: 'hearts' };
  return { value: TOPIC_FOCUS[card.rank] ?? 'Current Need', suit: card.suit };
}

// ============================================================
// ACTION RESOLUTION (Core gameplay oracle)
// ============================================================

/**
 * Resolve a player action using OPSE d6 oracle + Chaos Factor modifier.
 *
 * Roll thresholds (baseline, CF=5):
 *   Strong Hit: 6
 *   Weak Hit:   4–5
 *   Miss:       1–3
 *
 * CF modifier: each point above 5 lowers Strong Hit threshold by 0.5 (rounded),
 * making hits more likely at high chaos. Each point below 5 raises it.
 *
 * CF 1-2: Strong=6, Weak=5-6 would be shifted up → Miss on 1-4
 * CF 8-9: Strong=5-6, Weak=3-4, Miss=1-2 (more swing, more chaos)
 */
export function resolveAction(chaosFactor: number = 5): ActionResolutionResult {
  const roll = rollD6();
  const cf = Math.max(1, Math.min(9, chaosFactor));

  // CF modifier: -(cf-5)/2 rounded to nearest integer applied to threshold
  const cfShift = Math.round((cf - 5) / 2);
  // At baseline CF=5, strongThreshold=6, weakLow=4
  const strongThreshold = Math.max(4, 6 - cfShift);
  const weakLowThreshold = Math.max(2, 4 - cfShift);

  let outcome: ActionOutcome;
  if (roll >= strongThreshold) {
    outcome = 'StrongHit';
  } else if (roll >= weakLowThreshold) {
    outcome = 'WeakHit';
  } else {
    outcome = 'Miss';
  }

  let pacingMove: string | undefined;
  let failureMove: string | undefined;
  let pacingTriggered = false;

  if (outcome === 'WeakHit') {
    // Complication / partial success: trigger a Pacing Move
    pacingMove = rollPacingMove();
    pacingTriggered = true;
  } else if (outcome === 'Miss') {
    // Hard move: trigger a Failure Move
    failureMove = rollFailureMove();
    pacingTriggered = true;
  }

  return { roll, outcome, pacingMove, failureMove, pacingTriggered };
}

// ============================================================
// DUNGEON CRAWLER TABLES
// ============================================================

const DUNGEON_LOCATIONS: readonly string[] = [
  'Typical area',
  'Transitional area',
  'Living area or meeting place',
  'Working or utility area',
  'Area with a special feature',
  'Location for a specialized purpose',
] as const;

const DUNGEON_ENCOUNTERS: readonly string[] = [
  'None',
  'None',
  'Hostile enemies',
  'Hostile enemies',
  'An obstacle blocks the way',
  'Unique NPC or adversary',
] as const;

const DUNGEON_OBJECTS: readonly string[] = [
  'Nothing, or mundane objects',
  'Nothing, or mundane objects',
  'An interesting item or clue',
  'A useful tool, key, or device',
  'Something valuable',
  'Rare or special item',
] as const;

const DUNGEON_EXITS: readonly string[] = [
  'Dead end',
  'Dead end',
  '1 additional exit',
  '1 additional exit',
  '2 additional exits',
  '2 additional exits',
] as const;

export function generateDungeonRoom(): DungeonRoomRaw {
  return {
    location: DUNGEON_LOCATIONS[rollD6() - 1],
    encounter: DUNGEON_ENCOUNTERS[rollD6() - 1],
    object: DUNGEON_OBJECTS[rollD6() - 1],
    exits: DUNGEON_EXITS[rollD6() - 1],
  };
}

// ============================================================
// DUNGEON THEME GENERATOR
// ============================================================

export function generateDungeonTheme(): DungeonTheme {
  const appearance = drawDetailFocus();
  const usage = drawActionFocus();
  return {
    appearance: appearance.value,
    usage: usage.value,
    suit: appearance.suit,
  };
}

// ============================================================
// PLOT HOOK GENERATOR
// ============================================================

const PLOT_OBJECTIVES: readonly string[] = [
  'Eliminate a threat',
  'Learn the truth',
  'Recover something valuable',
  'Escort or deliver to safety',
  'Restore something broken',
  'Save an ally in peril',
] as const;

const PLOT_ADVERSARIES: readonly string[] = [
  'A powerful organization',
  'Outlaws',
  'Guardians',
  'Local inhabitants',
  'Enemy horde or force',
  'A new or recurring villain',
] as const;

const PLOT_REWARDS: readonly string[] = [
  'Money or valuables',
  'Money or valuables',
  'Knowledge and secrets',
  'Support of an ally',
  'Advance a plot arc',
  'A unique item of power',
] as const;

export function generatePlotHook(): PlotHook {
  return {
    objective: PLOT_OBJECTIVES[rollD6() - 1],
    adversary: PLOT_ADVERSARIES[rollD6() - 1],
    reward: PLOT_REWARDS[rollD6() - 1],
  };
}

// ============================================================
// OPTIONAL: USE ONLY DICE (no cards)
// ============================================================

/**
 * Draw a card using dice only (OPSE optional rule):
 * d12 for rank, d4 for suit. On 12, flip a coin for Q or K.
 */
export function drawCardWithDice(): { rank: number; suit: Suit } {
  let rank = rollD12();
  if (rank === 12) {
    // Coin flip: Q=12, K=13
    rank = Math.random() < 0.5 ? 12 : 13;
  }
  const suitIndex = rollD4() - 1;
  const suits: Suit[] = ['clubs', 'diamonds', 'spades', 'hearts'];
  return { rank: rank + 1, suit: suits[suitIndex] }; // +1 to align with card ranks (2-14)
}
