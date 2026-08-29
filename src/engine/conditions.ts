/**
 * conditions.ts – Character condition system and party health checks.
 * Pure TypeScript, zero React dependency.
 */

import type { CharacterCondition, PartyState } from '../store/types';
import type { ActionOutcome } from './opse';

// ============================================================
// CONDITION PROGRESSION
// ============================================================

const CONDITION_ORDER: CharacterCondition[] = [
  'Healthy',
  'Wounded',
  'Exhausted',
  'Disabled',
];

/**
 * Advance a character's condition by one step toward Disabled.
 * Returns the new condition.
 */
export function progressCondition(current: CharacterCondition): CharacterCondition {
  const idx = CONDITION_ORDER.indexOf(current);
  if (idx === -1 || idx >= CONDITION_ORDER.length - 1) return 'Disabled';
  return CONDITION_ORDER[idx + 1];
}

/**
 * Regress a character's condition by one step toward Healthy (healing).
 */
export function regressCondition(current: CharacterCondition): CharacterCondition {
  const idx = CONDITION_ORDER.indexOf(current);
  if (idx <= 0) return 'Healthy';
  return CONDITION_ORDER[idx - 1];
}

// ============================================================
// APPLY CONDITION DAMAGE (OPSE outcome → party consequence)
// ============================================================

export interface ConditionApplyResult {
  updatedParty: PartyState;
  /** IDs of members whose condition changed */
  affectedMemberIds: string[];
  /** Human-readable description of what happened */
  description: string;
}

/**
 * Apply mechanical consequences to the party based on OPSE action outcome.
 *
 * - StrongHit: no damage
 * - WeakHit: 1 non-Disabled member takes a condition step (least-damaged first)
 * - Miss: 1–2 non-Disabled members take condition steps
 */
export function applyConditionDamage(
  party: PartyState,
  outcome: ActionOutcome
): ConditionApplyResult {
  const affected: string[] = [];
  const members = party.members.map((m) => ({ ...m }));

  const nonDisabled = members.filter((m) => m.condition !== 'Disabled');

  if (outcome === 'StrongHit' || nonDisabled.length === 0) {
    return {
      updatedParty: { ...party, members },
      affectedMemberIds: [],
      description: 'No casualties.',
    };
  }

  // Sort: Healthy → Wounded → Exhausted (harm least-damaged first for narrative sense)
  const targets = [...nonDisabled].sort(
    (a, b) => CONDITION_ORDER.indexOf(a.condition) - CONDITION_ORDER.indexOf(b.condition)
  );

  const damageCount = outcome === 'WeakHit' ? 1 : Math.min(2, targets.length);

  for (let i = 0; i < damageCount; i++) {
    const target = targets[i];
    const memberIdx = members.findIndex((m) => m.id === target.id);
    if (memberIdx !== -1) {
      members[memberIdx] = {
        ...members[memberIdx],
        condition: progressCondition(members[memberIdx].condition),
      };
      affected.push(target.id);
    }
  }

  const affectedNames = affected.map(
    (id) => members.find((m) => m.id === id)?.name ?? id
  );

  const description =
    outcome === 'WeakHit'
      ? `${affectedNames[0]} takes a condition hit.`
      : `${affectedNames.join(' and ')} take condition hits.`;

  return {
    updatedParty: { ...party, members },
    affectedMemberIds: affected,
    description,
  };
}

// ============================================================
// PARTY STATE CHECKS
// ============================================================

/** Returns true if ALL party members are Disabled (party defeated). */
export function checkDefeat(party: PartyState): boolean {
  return party.members.every((m) => m.condition === 'Disabled');
}

/**
 * Returns true if the dungeon is complete (last room cleared = victory).
 * @param currentRoomIndex – 0-based index of the current room
 * @param totalRooms – total number of rooms in the dungeon
 */
export function checkVictory(currentRoomIndex: number, totalRooms: number): boolean {
  return currentRoomIndex >= totalRooms - 1;
}

/** Count how many members are still active (not Disabled). */
export function countActiveMEmbers(party: PartyState): number {
  return party.members.filter((m) => m.condition !== 'Disabled').length;
}

/** Get surviving (non-Disabled) member names. */
export function getSurvivors(party: PartyState): string[] {
  return party.members
    .filter((m) => m.condition !== 'Disabled')
    .map((m) => m.name);
}

/** Get fallen (Disabled) member names. */
export function getFallen(party: PartyState): string[] {
  return party.members
    .filter((m) => m.condition === 'Disabled')
    .map((m) => m.name);
}

// ============================================================
// CHAOS FACTOR UPDATE
// ============================================================

/**
 * Calculate the Chaos Factor delta based on the action outcome.
 * - StrongHit + room cleared: CF decreases by 1 (caller decides when to apply)
 * - WeakHit with Pacing Move: CF increases by 1
 * - Miss: CF increases by 1
 * - StrongHit (no room clear): no change
 */
export function getChaosFactorDelta(outcome: ActionOutcome, roomCleared: boolean): number {
  if (outcome === 'StrongHit') return roomCleared ? -1 : 0;
  return 1; // WeakHit or Miss → more chaos
}
