/**
 * dungeon.ts – Dungeon session and party initialization.
 * Pure TypeScript, zero React dependency.
 */

import type { RoomState, PartyState, Character, CharacterRole } from '../store/types';
import { generateDungeonRoom } from './opse';
import { rollD6 } from './rng';

// ============================================================
// DEFAULT PARTY CONFIGURATION
// ============================================================

interface RoleConfig {
  role: CharacterRole;
  description: string;
  inventory: string[];
}

const ROLE_CONFIGS: RoleConfig[] = [
  {
    role: 'Warrior',
    description: 'Stalwart frontliner, shield and blade.',
    inventory: ['Longsword', 'Tower Shield', 'Chainmail', 'Healing Draught'],
  },
  {
    role: 'Rogue',
    description: 'Shadow-walker, blades and cunning.',
    inventory: ['Twin Daggers', 'Lockpick Set', 'Smoke Bomb', 'Thieves\' Tools'],
  },
  {
    role: 'Mage',
    description: 'Arcane scholar, power at a price.',
    inventory: ['Spellbook', 'Arcane Focus', 'Scroll of Fireball', 'Mana Potion'],
  },
  {
    role: 'Cleric',
    description: 'Divine conduit, healer and smiter.',
    inventory: ['Holy Mace', 'Sacred Shield', 'Bandages', 'Divine Lantern'],
  },
];

const DEFAULT_NAMES: Record<CharacterRole, string> = {
  Warrior: 'Valen',
  Rogue:   'Lyra',
  Mage:    'Thorne',
  Cleric:  'Kael',
};

/**
 * Initialize the party of 4 characters.
 * @param names – Map of role → custom name. Falls back to defaults.
 */
export function initParty(names?: Partial<Record<CharacterRole, string>>): PartyState {
  const members: Character[] = ROLE_CONFIGS.map((config, idx) => ({
    id: `char-${config.role.toLowerCase()}-${idx}`,
    name: names?.[config.role] ?? DEFAULT_NAMES[config.role],
    role: config.role,
    description: config.description,
    condition: 'Healthy',
    inventory: [...config.inventory],
  }));

  return {
    members,
    inventory: [],
  };
}

// ============================================================
// DUNGEON SESSION GENERATION
// ============================================================

/**
 * Hazard descriptors applied based on encounter type.
 * Gives the pre-generated rooms atmospheric flavor before LLM narration.
 */
const HAZARD_TYPES: readonly string[] = [
  'Ambush',
  'Poison Darts',
  'Trapped Chest',
  'Collapsing Floor',
  'Magical Wards',
  'Lurking Undead',
  'Mechanical Guardian',
  'Toxic Fumes',
  'Hidden Pit',
  'Cursed Altar',
] as const;

/** Pick a random item from a readonly array */
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a complete dungeon session as an array of pre-rolled RoomState objects.
 * The last room is always forced to be the Boss/Climax room.
 *
 * @param dungeonTheme – The narrative theme (e.g. "Sunken Monastery of the Red Abbot")
 * @param totalRooms – Number of rooms: 5, 6, or 7
 */
export function generateDungeonSession(
  dungeonTheme: string,
  totalRooms: 5 | 6 | 7 = 6
): RoomState[] {
  const rooms: RoomState[] = [];

  for (let i = 0; i < totalRooms; i++) {
    const isLastRoom = i === totalRooms - 1;
    const raw = generateDungeonRoom();

    // Force last room to be a boss encounter
    const encounter = isLastRoom ? 'Final Boss / Climax Encounter' : raw.encounter;
    const locationLabel = isLastRoom ? 'Location for a specialized purpose' : raw.location;

    const hazard = isLastRoom
      ? 'Boss Encounter'
      : raw.encounter !== 'None'
        ? pick(HAZARD_TYPES)
        : 'None';

    rooms.push({
      roomNumber: i + 1,
      type: locationLabel,
      encounter,
      hazard,
      object: raw.object,
      exits: raw.exits,
      cleared: false,
      historyLog: [],
      dungeonTheme,
    });
  }

  return rooms;
}

/**
 * Generate a random dungeon name suggestion from OPSE tables.
 * Uses simple adjective + noun combinations for atmospheric names.
 */
const DUNGEON_ADJECTIVES = [
  'Sunken', 'Cursed', 'Forsaken', 'Iron', 'Ancient',
  'Shattered', 'Forgotten', 'Haunted', 'Blighted', 'Drowned',
  'Crimson', 'Ashen', 'Hollow', 'Rotting', 'Obsidian',
];

const DUNGEON_NOUNS = [
  'Monastery', 'Crypt', 'Citadel', 'Vault', 'Tomb',
  'Fortress', 'Temple', 'Sanctum', 'Dungeon', 'Keep',
  'Warrens', 'Spire', 'Undercroft', 'Ossuary', 'Mausoleum',
];

const DUNGEON_SUFFIXES = [
  'of the Iron Lich', 'of the Red Abbot', 'of the Hollow King',
  'of the Forsaken God', 'of the Blood Moon', 'of the Eternal Night',
  'of the Worm God', 'of the Shattered Crown', 'of the Lost Order',
  'of the Undying', 'of the Black Flame', 'of the Ancient Serpent',
];

export function generateDungeonNameSuggestion(): string {
  const adj = pick(DUNGEON_ADJECTIVES);
  const noun = pick(DUNGEON_NOUNS);
  const suffix = rollD6() >= 4 ? ` ${pick(DUNGEON_SUFFIXES)}` : '';
  return `${adj} ${noun}${suffix}`;
}
