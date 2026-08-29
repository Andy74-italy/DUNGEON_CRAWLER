/**
 * engine tests – Vitest unit tests for the OPSE deterministic engine.
 */

import { describe, it, expect, vi } from 'vitest';
import { resolveAction } from '../src/engine/opse';
import {
  applyConditionDamage,
  checkDefeat,
  checkVictory,
  progressCondition,
  getChaosFactorDelta,
} from '../src/engine/conditions';
import { initParty } from '../src/engine/dungeon';
import { parseJsonSafe } from '../src/llm/sanitizer';
import type { PartyState } from '../src/store/types';

// ============================================================
// resolveAction
// ============================================================

describe('resolveAction', () => {
  it('returns StrongHit on roll = 6', () => {
    vi.spyOn(Math, 'random').mockReturnValue(5 / 6); // d6 = 6
    const result = resolveAction(5);
    expect(result.outcome).toBe('StrongHit');
    vi.restoreAllMocks();
  });

  it('returns WeakHit on roll = 4', () => {
    vi.spyOn(Math, 'random').mockReturnValue(3 / 6); // d6 = 4
    const result = resolveAction(5);
    expect(result.outcome).toBe('WeakHit');
    expect(result.pacingTriggered).toBe(true);
    vi.restoreAllMocks();
  });

  it('returns Miss on roll = 2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1 / 6); // d6 = 2
    const result = resolveAction(5);
    expect(result.outcome).toBe('Miss');
    expect(result.failureMove).toBeDefined();
    vi.restoreAllMocks();
  });

  it('StrongHit threshold lowers at high chaos factor', () => {
    // CF=9: strongThreshold = max(4, 6 - round((9-5)/2)) = max(4, 6-2) = 4
    vi.spyOn(Math, 'random').mockReturnValue(3 / 6); // d6 = 4
    const result = resolveAction(9);
    expect(result.outcome).toBe('StrongHit');
    vi.restoreAllMocks();
  });
});

// ============================================================
// progressCondition
// ============================================================

describe('progressCondition', () => {
  it('Healthy → Wounded', () => expect(progressCondition('Healthy')).toBe('Wounded'));
  it('Wounded → Exhausted', () => expect(progressCondition('Wounded')).toBe('Exhausted'));
  it('Exhausted → Disabled', () => expect(progressCondition('Exhausted')).toBe('Disabled'));
  it('Disabled stays Disabled', () => expect(progressCondition('Disabled')).toBe('Disabled'));
});

// ============================================================
// applyConditionDamage
// ============================================================

function makeParty(): PartyState {
  return initParty();
}

describe('applyConditionDamage', () => {
  it('StrongHit: no damage', () => {
    const party = makeParty();
    const result = applyConditionDamage(party, 'StrongHit');
    expect(result.affectedMemberIds).toHaveLength(0);
    expect(result.updatedParty.members.every((m) => m.condition === 'Healthy')).toBe(true);
  });

  it('WeakHit: exactly 1 member takes damage', () => {
    const party = makeParty();
    const result = applyConditionDamage(party, 'WeakHit');
    expect(result.affectedMemberIds).toHaveLength(1);
    const hit = result.updatedParty.members.find((m) => m.id === result.affectedMemberIds[0]);
    expect(hit?.condition).toBe('Wounded');
  });

  it('Miss: 1-2 members take damage', () => {
    const party = makeParty();
    const result = applyConditionDamage(party, 'Miss');
    expect(result.affectedMemberIds.length).toBeGreaterThanOrEqual(1);
    expect(result.affectedMemberIds.length).toBeLessThanOrEqual(2);
  });
});

// ============================================================
// checkDefeat / checkVictory
// ============================================================

describe('checkDefeat', () => {
  it('false when any member is alive', () => {
    const party = makeParty();
    expect(checkDefeat(party)).toBe(false);
  });

  it('true when all members are Disabled', () => {
    const party = makeParty();
    const allDisabled: PartyState = {
      ...party,
      members: party.members.map((m) => ({ ...m, condition: 'Disabled' as const })),
    };
    expect(checkDefeat(allDisabled)).toBe(true);
  });
});

describe('checkVictory', () => {
  it('true on last room (0-indexed)', () => {
    expect(checkVictory(5, 6)).toBe(true);
  });

  it('false on penultimate room', () => {
    expect(checkVictory(4, 6)).toBe(false);
  });
});

// ============================================================
// getChaosFactorDelta
// ============================================================

describe('getChaosFactorDelta', () => {
  it('StrongHit + cleared: -1', () => expect(getChaosFactorDelta('StrongHit', true)).toBe(-1));
  it('StrongHit + not cleared: 0', () => expect(getChaosFactorDelta('StrongHit', false)).toBe(0));
  it('WeakHit: +1', () => expect(getChaosFactorDelta('WeakHit', false)).toBe(1));
  it('Miss: +1', () => expect(getChaosFactorDelta('Miss', false)).toBe(1));
});

// ============================================================
// parseJsonSafe (sanitizer)
// ============================================================

describe('parseJsonSafe', () => {
  it('parses valid JSON', () => {
    const raw = JSON.stringify({
      narrative: 'The room is dark.',
      roomSummary: 'Empty hall.',
      suggestedActions: ['Advance.', 'Wait.', 'Retreat.'],
    });
    const result = parseJsonSafe(raw);
    expect(result.narrative).toBe('The room is dark.');
    expect(result.suggestedActions).toHaveLength(3);
  });

  it('strips markdown fences', () => {
    const raw = '```json\n{"narrative":"Test","roomSummary":"Summ","suggestedActions":["A"]}\n```';
    const result = parseJsonSafe(raw);
    expect(result.narrative).toBe('Test');
  });

  it('extracts JSON from surrounding text', () => {
    const raw = 'Here is the result: {"narrative":"N","roomSummary":"S","suggestedActions":["X"]} end.';
    const result = parseJsonSafe(raw);
    expect(result.narrative).toBe('N');
  });

  it('returns fallback for completely invalid input', () => {
    const result = parseJsonSafe('this is not json at all !!!');
    expect(result.narrative).toBeTruthy();
    expect(result.suggestedActions.length).toBeGreaterThan(0);
  });
});
