# 03 - GAMEPLAY LOOP AND DETERMINISTIC OPSE ENGINE

## 1. Resolution Engine (Player Action Oracle)
When the player submits an action for the party, the code executes a roll based on OPSE logic:

| Die / Card Value | Resolution Result | Mechanical Impact |
|---|---|---|
| **Strong Hit** (e.g., 6 on d6 / High card) | **Yes / Critical Success** | Goal achieved cleanly. Enemy defeated or obstacle removed. |
| **Weak Hit** (e.g., 4-5 on d6) | **Yes, but... (Complication)** | Goal achieved, but 1 party member takes a condition (Healthy -> Wounded) OR a resource is spent. |
| **Miss** (e.g., 1-3 on d6) | **No, and... (Hard Move)** | Action fails. 1-2 members take conditions, new threat emerges or party is cornered. |

## 2. Pacing Moves Trigger
When a complication or double roll occurs, the engine triggers an OPSE Pacing Move from the deterministic table:
- *Foreshadow a Danger*
- *Introduce an Unexpected Obstacle*
- *Close a Door / Reduce Resources*
- *Escalate Hostility*

## 3. Loop Execution Steps
1. **Room Entry:** Engine determines Room Features using OPSE Generator Tables -> LLM describes the room and presents situation.
2. **Player Action:** Player writes free text or selects a proposed tactical choice (e.g., "Rogue sneaks behind the archer while Warrior holds the line").
3. **Engine Roll:** Client rolls 1d6 (or draws card) + checks modifiers -> produces OPSE Result (`Strong Hit`, `Weak Hit`, `Miss` + optional Pacing/Focus tags).
4. **LLM Narration:** Code bundles Game State + OPSE Result into payload -> LLM generates narrative response + updates scene.
5. **State Progression:** If threat is neutralized, unlock transition to `Room + 1`. If all 4 members reach `Disabled`, trigger `DEFEAT`. If Room 6 is cleared, trigger `VICTORY`.