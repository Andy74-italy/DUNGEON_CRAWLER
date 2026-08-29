/**
 * hooks/useGameLoop.ts – Main gameplay loop hook.
 * Orchestrates: player action → OPSE roll → condition damage → chaos factor → LLM call.
 */

import { useCallback, useState } from 'react';
import { useDungeonStore } from '../store';
import { useLLM } from './useLLM';
import { resolveAction } from '../engine/opse';
import {
  applyConditionDamage,
  checkDefeat,
  checkVictory,
  getChaosFactorDelta,
  getSurvivors,
  getFallen,
} from '../engine/conditions';

export function useGameLoop() {
  const store = useDungeonStore();
  const { callRoomIntro, callActionResolution, callDungeonEnd } = useLLM();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handle a player action submission.
   * Full loop: roll → damage → CF update → store update → LLM call
   */
  const handlePlayerAction = useCallback(async (actionText: string) => {
    if (isProcessing || store.isLLMLoading) return;
    setIsProcessing(true);

    try {
      // 1. Roll the OPSE oracle with current Chaos Factor
      const result = resolveAction(store.chaosFactor);

      // 2. Show dice roll modal
      store.showDiceRollModal(result);

      // 3. Apply condition damage to party
      const damageResult = applyConditionDamage(store.party, result.outcome);

      // 4. Update party state in store (triggers flash animation)
      store.updatePartyAfterDamage(
        damageResult.updatedParty.members,
        damageResult.affectedMemberIds
      );

      // 5. Update Chaos Factor
      const cfDelta = getChaosFactorDelta(result.outcome, false);
      if (cfDelta !== 0) store.updateChaosFactor(cfDelta);

      // 6. Check for defeat (all members disabled)
      if (checkDefeat(damageResult.updatedParty)) {
        const survivors = getSurvivors(damageResult.updatedParty);
        const fallen = getFallen(damageResult.updatedParty);
        store.triggerDefeat();
        await callDungeonEnd('DEFEAT', survivors, fallen);
        return;
      }

      // 7. Build mechanical consequence description for LLM
      const mechanicalConsequence = buildMechanicalDescription(result, damageResult.description);

      // 8. Call LLM for action resolution narration
      await callActionResolution(actionText, result, mechanicalConsequence);

      // 9. On Strong Hit, automatically mark room as cleared (threat neutralized)
      //    (for WeakHit/Miss, the GM narrative handles progression)
      if (result.outcome === 'StrongHit') {
        store.markRoomCleared();
        // Update CF: StrongHit + room cleared → CF -1
        store.updateChaosFactor(-1);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [store, isProcessing, callActionResolution, callDungeonEnd]);

  /**
   * Handle advancing to the next room.
   * Called when the current room is cleared and the player chooses to move on.
   */
  const handleAdvanceRoom = useCallback(async () => {
    if (isProcessing || store.isLLMLoading) return;
    setIsProcessing(true);

    try {
      const { currentRoomIndex, totalRooms } = store;
      const isLastRoom = checkVictory(currentRoomIndex, totalRooms);

      if (isLastRoom) {
        const survivors = getSurvivors(store.party);
        const fallen = getFallen(store.party);
        store.triggerVictory();
        await callDungeonEnd('VICTORY', survivors, fallen);
      } else {
        store.advanceToNextRoom();
        // Room intro LLM call triggered by useEffect in GameScreen
        await callRoomIntro();
      }
    } finally {
      setIsProcessing(false);
    }
  }, [store, isProcessing, callRoomIntro, callDungeonEnd]);

  /**
   * Manually trigger a room intro (called on room entry).
   */
  const handleRoomEntry = useCallback(async () => {
    await callRoomIntro();
  }, [callRoomIntro]);

  /**
   * Start a new game session.
   */
  const handleNewGame = useCallback(() => {
    store.resetGame();
  }, [store]);

  return {
    handlePlayerAction,
    handleAdvanceRoom,
    handleRoomEntry,
    handleNewGame,
    isProcessing,
  };
}

// ============================================================
// HELPERS
// ============================================================

function buildMechanicalDescription(
  result: ReturnType<typeof resolveAction>,
  damageDesc: string
): string {
  const parts: string[] = [];

  switch (result.outcome) {
    case 'StrongHit':
      parts.push('Strong Hit: Goal achieved cleanly. ' + damageDesc);
      break;
    case 'WeakHit':
      parts.push('Weak Hit (Yes, but...): ' + damageDesc);
      if (result.pacingMove) parts.push(`Pacing Move: "${result.pacingMove}".`);
      break;
    case 'Miss':
      parts.push('Miss (No, and...): ' + damageDesc);
      if (result.failureMove) parts.push(`Failure Move: "${result.failureMove}".`);
      break;
  }

  return parts.join(' ');
}
