/**
 * rng.ts – Pure deterministic RNG functions.
 * Zero React dependency. Fully testable in isolation.
 */

export type Suit = 'clubs' | 'diamonds' | 'spades' | 'hearts';

export interface DrawnCard {
  /** Rank 2–14 (11=J, 12=Q, 13=K, 14=A) */
  rank: number;
  suit: Suit;
  /** True if this is a Joker (triggers Random Event per OPSE rules) */
  isJoker: boolean;
}

const SUITS: Suit[] = ['clubs', 'diamonds', 'spades', 'hearts'];

/** Roll a fair d6. Returns 1–6. */
export function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/** Roll a fair d12. Returns 1–12. */
export function rollD12(): number {
  return Math.floor(Math.random() * 12) + 1;
}

/** Roll a fair d4. Returns 1–4. */
export function rollD4(): number {
  return Math.floor(Math.random() * 4) + 1;
}

/**
 * Draw a single playing card.
 * Joker probability ≈ 2/54 ≈ 3.7% (matching a standard 54-card deck).
 * Per OPSE rules, drawing a Joker triggers a Random Event.
 */
export function drawCard(): DrawnCard {
  const jokerRoll = Math.random();
  if (jokerRoll < 2 / 54) {
    return { rank: 0, suit: 'clubs', isJoker: true };
  }
  const rank = Math.floor(Math.random() * 13) + 2; // 2–14
  const suit = SUITS[Math.floor(Math.random() * 4)];
  return { rank, suit, isJoker: false };
}

/**
 * Convert a card rank to a d6-equivalent value per OPSE optional rule:
 * "draw a card and use rank divided by 2 (round down). Discard Aces."
 * Returns null for Aces (rank 14) — caller should redraw.
 */
export function cardToD6(rank: number): number | null {
  if (rank === 14) return null; // Ace discarded
  return Math.min(6, Math.max(1, Math.floor(rank / 2)));
}
