# 02 - DATA MODELS AND STATE SPECIFICATION

## 1. Party & Character Schema (TypeScript)

```typescript
export type CharacterRole = 'Warrior' | 'Rogue' | 'Mage' | 'Cleric';

export type CharacterCondition = 'Healthy' | 'Wounded' | 'Exhausted' | 'Disabled';

export interface Character {
  id: string;
  name: string;
  role: CharacterRole;
  description: string;
  condition: CharacterCondition; // Healthy -> Wounded -> Disabled (Dead/KO)
  inventory: string[]; // 3-4 key items (e.g., ["Longsword", "Shield", "Chainmail"])
}

export interface PartyState {
  members: Character[];
  inventory: string[]; // Shared loot / keys / potions
}
```

## 2. Dungeon & Session State

```typescript
export interface RoomState {
  roomNumber: number;        // 1 to 6 (Room 6 is always Boss/Climax)
  type: string;              // Generated from OPSE (e.g., "Flooded Crypt", "Armory")
  hazard: string;            // e.g., "Poison Darts", "Ambush", "Locked Vault"
  cleared: boolean;
  historyLog: string[];      // Summary of events in this room
}

export interface GameState {
  dungeonTheme: string;      // e.g., "Catacombs of the Iron Lich"
  currentRoomIndex: number;
  totalRooms: number;        // Default: 6
  party: PartyState;
  chaosFactor: number;       // Optional OPSE tracking (range 1-9 or standard pacing)
  activeRoom: RoomState;
  gameStatus: 'SETUP' | 'EXPLORING' | 'IN_COMBAT' | 'VICTORY' | 'DEFEAT';
}
```