/**
 * i18n/translations.ts – UI string translations.
 * All hardcoded UI text lives here, keyed by ISO 639-1 language code.
 */

export type UILang = 'en' | 'it' | 'de' | 'fr' | 'es';

export interface Translations {
  // Top bar
  topbarTitle: string;
  abandonDungeon: string;
  aiSettings: string;
  howToPlay: string;
  credits: string;

  // Setup screen
  setupSubtitle: string;
  dungeonConfig: string;
  dungeonNameLabel: string;
  dungeonNamePlaceholder: string;
  rollTheme: string;
  dungeonLength: string;
  rooms5: string;
  rooms6: string;
  rooms7: string;
  time15: string;
  time20: string;
  time30: string;
  yourParty: string;
  enterDungeon: string;
  configureAiHint: string;
  objectiveLabel: string;
  adversaryLabel: string;
  rewardLabel: string;

  // Game screen
  partySectionTitle: string;
  roomLabel: string;
  hazardLabel: string;
  partyLootLabel: string;
  roomObjectLabel: string;
  chaosFactor: string;

  // Narrative panel
  settingScene: string;
  narrating: string;
  awaitingDM: string;
  awaitingHint: string;
  aiUnavailable: string;
  aiUnavailableHint: string;
  roomHistory: string;

  // Action panel
  suggestedTactics: string;
  customAction: string;
  customActionPlaceholder: string;
  actButton: string;
  enterHint: string;
  waitingScene: string;
  advanceRoom: string;

  // Dice modal
  youRolled: string;
  strongHitFlavor: string;
  weakHitFlavor: string;
  missFlavor: string;

  // End screen
  victoryTitle: string;
  defeatTitle: string;
  survivors: string;
  fallen: string;
  lootRecovered: string;
  newExpedition: string;

  // Conditions & roles
  Healthy: string;
  Wounded: string;
  Exhausted: string;
  Disabled: string;
  Warrior: string;
  Rogue: string;
  Mage: string;
  Cleric: string;

  // Settings modal
  settingsTitle: string;
  narrativeLanguage: string;
  aiProvider: string;
  apiKeyLabel: string;
  modelLabel: string;
  baseUrlLabel: string;
  saveClose: string;
  webllmNote: string;
  keyPrivacyNote: string;

  // How To Play modal
  howToPlayTitle: string;
  howToPlayBody: string;

  // Credits modal
  creditsTitle: string;
  creditsBody: string;
}

const en: Translations = {
  topbarTitle: '⚔ DUNGEON CRAWLER',
  abandonDungeon: 'Abandon Dungeon',
  aiSettings: 'AI Settings',
  howToPlay: 'How to Play',
  credits: 'Credits',

  setupSubtitle: 'Powered by One Page Solo Engine',
  dungeonConfig: '⚔ Dungeon Configuration',
  dungeonNameLabel: 'Dungeon Name / Theme',
  dungeonNamePlaceholder: 'e.g. Sunken Monastery of the Red Abbot',
  rollTheme: 'Roll',
  dungeonLength: 'Dungeon Length',
  rooms5: '5 Rooms',
  rooms6: '6 Rooms',
  rooms7: '7 Rooms',
  time15: '~15 min',
  time20: '~20 min',
  time30: '~30 min',
  yourParty: '🗡 Your Party',
  enterDungeon: 'Enter the Dungeon',
  configureAiHint: 'Configure your AI Dungeon Master via ⚙ Settings before starting.',
  objectiveLabel: 'Objective',
  adversaryLabel: 'Adversary',
  rewardLabel: 'Reward',

  partySectionTitle: 'Party',
  roomLabel: 'Room',
  hazardLabel: 'Hazard',
  partyLootLabel: 'Party Loot',
  roomObjectLabel: 'Room Object',
  chaosFactor: 'CF',

  settingScene: '◈ The Dungeon Master is setting the scene...',
  narrating: '◈ The Dungeon Master is narrating...',
  awaitingDM: 'Awaiting the Dungeon Master...',
  awaitingHint: 'Configure your AI provider in settings, then enter the dungeon.',
  aiUnavailable: 'AI Dungeon Master Unavailable',
  aiUnavailableHint: 'Check your API key and provider settings, then try again.',
  roomHistory: 'ROOM HISTORY',

  suggestedTactics: 'Suggested Tactics',
  customAction: 'Custom Action',
  customActionPlaceholder: 'Describe what the party does...',
  actButton: 'Act',
  enterHint: 'Press Enter to submit · Shift+Enter for new line',
  waitingScene: 'Waiting for the scene to unfold...',
  advanceRoom: 'Advance to Next Room',

  youRolled: 'You rolled',
  strongHitFlavor: 'Victory favors the bold.',
  weakHitFlavor: 'Success at a cost.',
  missFlavor: 'Fate turns against you.',

  victoryTitle: 'Victory!',
  defeatTitle: 'Defeat',
  survivors: '✓ Survivors',
  fallen: '✝ Fallen',
  lootRecovered: '◈ Loot Recovered',
  newExpedition: 'Begin a New Expedition',

  Healthy: 'Healthy',
  Wounded: 'Wounded',
  Exhausted: 'Exhausted',
  Disabled: 'Disabled',
  Warrior: 'Warrior',
  Rogue: 'Rogue',
  Mage: 'Mage',
  Cleric: 'Cleric',

  settingsTitle: '⚙ AI Dungeon Master Settings',
  narrativeLanguage: 'Narrative Language',
  aiProvider: 'AI Provider',
  apiKeyLabel: 'API Key',
  modelLabel: 'Model',
  baseUrlLabel: 'Base URL',
  saveClose: 'Save & Close',
  webllmNote: 'The model will be downloaded to your browser on first use (~1-2 GB). Subsequent sessions use the cached version. No API key required.',
  keyPrivacyNote: 'Stored locally in your browser. Never transmitted to any server other than the selected provider.',

  howToPlayTitle: '📖 How to Play',
  howToPlayBody: `**Solo Dungeon Crawler** is a narrative dungeon-crawling game for one player, powered by the **One Page Solo Engine (OPSE)** and an AI Game Master.

**The Party**
You control 4 adventurers: a Warrior, a Rogue, a Mage, and a Cleric. Each has a Condition Track: Healthy → Wounded → Exhausted → Disabled. If all 4 are Disabled, the run ends in Defeat.

**The Dungeon**
Each run consists of 5, 6, or 7 rooms generated procedurally. The last room is always the boss encounter.

**Chaos Factor (CF)**
The CF (1–9, starting at 5) is a difficulty modifier. A high CF makes Strong Hits harder and Miss outcomes more punishing. It rises with Weak Hits and Misses, and falls with Strong Hits on cleared rooms.

**Taking Actions**
Each turn, describe what your party does — either by selecting a suggested tactic or writing your own. The engine rolls a d6 and compares it to the current CF:
- **Strong Hit (6+):** Full success. No party damage. Room cleared.
- **Weak Hit (4-5):** Success with a complication. One party member takes a Condition step of damage.
- **Miss (1-3):** Failure with consequences. One or two members take damage, and a Failure Move triggers.

**The AI Game Master**
The AI narrates the outcome of each action, describes rooms, and suggests tactics. It is strictly narrative — it never rolls dice or alters mechanical results.

**Winning**
Clear all rooms (or survive the boss encounter) to claim Victory.`,

  creditsTitle: '📜 Inspirations & Credits',
  creditsBody: `**One Page Solo Engine (OPSE)**
Game mechanics and oracle tables by **Inflatable Studios**.
Licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
→ [inflatablestudios.itch.io/one-page-solo-engine](https://inflatablestudios.itch.io/one-page-solo-engine)

**Dungeons & Dragons (D&D)**
The class archetypes (Warrior, Rogue, Mage, Cleric), the concept of condition tracks, and the general dungeon-crawling genre draw inspiration from D&D, originally created by Gary Gygax and Dave Arneson (1974). D&D is currently published by Wizards of the Coast.

**Other Inspirations**
- *Ironsworn* (Shawn Tomkin) — for narrative-first solo play design
- *Scarlet Heroes* (Kevin Crawford) — for solo D&D-style play
- *Mythic Game Master Emulator* (Tom Pierson) — for chaos factor mechanics

**Application Code**
Built with React, Vite, TypeScript, Tailwind CSS, and Zustand.
Licensed under the MIT License.
AI integration uses your own API key and is processed directly by your chosen provider.`,
};

const it: Translations = {
  topbarTitle: '⚔ DUNGEON CRAWLER',
  abandonDungeon: 'Abbandona il Dungeon',
  aiSettings: 'Impostazioni AI',
  howToPlay: 'Come si Gioca',
  credits: 'Crediti',

  setupSubtitle: 'Alimentato da One Page Solo Engine',
  dungeonConfig: '⚔ Configurazione Dungeon',
  dungeonNameLabel: 'Nome / Tema del Dungeon',
  dungeonNamePlaceholder: 'es. Monastero Sommerso dell\'Abate Rosso',
  rollTheme: 'Tira',
  dungeonLength: 'Lunghezza del Dungeon',
  rooms5: '5 Stanze',
  rooms6: '6 Stanze',
  rooms7: '7 Stanze',
  time15: '~15 min',
  time20: '~20 min',
  time30: '~30 min',
  yourParty: '🗡 Il Tuo Gruppo',
  enterDungeon: 'Entra nel Dungeon',
  configureAiHint: 'Configura il tuo Dungeon Master AI nelle ⚙ Impostazioni prima di iniziare.',
  objectiveLabel: 'Obiettivo',
  adversaryLabel: 'Avversario',
  rewardLabel: 'Ricompensa',

  partySectionTitle: 'Gruppo',
  roomLabel: 'Stanza',
  hazardLabel: 'Pericolo',
  partyLootLabel: 'Bottino del Gruppo',
  roomObjectLabel: 'Oggetto della Stanza',
  chaosFactor: 'FC',

  settingScene: '◈ Il Dungeon Master sta preparando la scena...',
  narrating: '◈ Il Dungeon Master sta narrando...',
  awaitingDM: 'In attesa del Dungeon Master...',
  awaitingHint: 'Configura il fornitore AI nelle impostazioni, poi entra nel dungeon.',
  aiUnavailable: 'Dungeon Master AI non disponibile',
  aiUnavailableHint: 'Controlla la tua chiave API e le impostazioni del fornitore, poi riprova.',
  roomHistory: 'STORIA DELLA STANZA',

  suggestedTactics: 'Tattiche Suggerite',
  customAction: 'Azione Personalizzata',
  customActionPlaceholder: 'Descrivi cosa fa il gruppo...',
  actButton: 'Agisci',
  enterHint: 'Premi Invio per confermare · Shift+Invio per nuova riga',
  waitingScene: 'In attesa che la scena si dipani...',
  advanceRoom: 'Avanza alla Stanza Successiva',

  youRolled: 'Hai tirato',
  strongHitFlavor: 'La vittoria sorride agli audaci.',
  weakHitFlavor: 'Successo, a caro prezzo.',
  missFlavor: 'Il destino si volge contro di te.',

  victoryTitle: 'Vittoria!',
  defeatTitle: 'Sconfitta',
  survivors: '✓ Sopravvissuti',
  fallen: '✝ Caduti',
  lootRecovered: '◈ Bottino Recuperato',
  newExpedition: 'Inizia una Nuova Spedizione',

  Healthy: 'Sano',
  Wounded: 'Ferito',
  Exhausted: 'Esausto',
  Disabled: 'Fuori Combattimento',
  Warrior: 'Guerriero',
  Rogue: 'Ladro',
  Mage: 'Mago',
  Cleric: 'Chierico',

  settingsTitle: '⚙ Impostazioni Dungeon Master AI',
  narrativeLanguage: 'Lingua della Narrazione',
  aiProvider: 'Fornitore AI',
  apiKeyLabel: 'Chiave API',
  modelLabel: 'Modello',
  baseUrlLabel: 'URL Base',
  saveClose: 'Salva e Chiudi',
  webllmNote: 'Il modello verrà scaricato nel browser al primo utilizzo (~1-2 GB). Le sessioni successive utilizzano la versione in cache. Nessuna chiave API richiesta.',
  keyPrivacyNote: 'Memorizzato localmente nel browser. Non viene mai trasmesso ad alcun server diverso dal fornitore selezionato.',

  howToPlayTitle: '📖 Come si Gioca',
  howToPlayBody: `**Solo Dungeon Crawler** è un gioco narrativo per un solo giocatore, alimentato dall'**One Page Solo Engine (OPSE)** e da un Dungeon Master AI.

**Il Gruppo**
Controlli 4 avventurieri: un Guerriero, un Ladro, un Mago e un Chierico. Ognuno ha una Traccia delle Condizioni: Sano → Ferito → Esausto → Fuori Combattimento. Se tutti e 4 sono Fuori Combattimento, la sessione termina con una Sconfitta.

**Il Dungeon**
Ogni sessione consiste in 5, 6 o 7 stanze generate proceduralmente. L'ultima è sempre lo scontro con il boss.

**Fattore Caos (FC)**
Il FC (1-9, parte da 5) è un modificatore di difficoltà. Un FC alto rende i Colpi Forti più difficili e le conseguenze dei Mancati più severe. Aumenta con Colpi Deboli e Mancati, diminuisce con Colpi Forti su stanze liberate.

**Eseguire Azioni**
Ogni turno, descrivi cosa fa il tuo gruppo — scegliendo una tattica suggerita o scrivendone una personalizzata. Il motore tira un d6 e lo confronta con il FC corrente:
- **Colpo Forte (6+):** Successo pieno. Nessun danno al gruppo. Stanza liberata.
- **Colpo Debole (4-5):** Successo con complicazione. Un membro del gruppo peggiora di una Condizione.
- **Mancato (1-3):** Fallimento con conseguenze. Uno o due membri subiscono danno e si attiva una Mossa di Fallimento.

**Il Dungeon Master AI**
L'AI narra il risultato di ogni azione, descrive le stanze e suggerisce tattiche. È strettamente narrativa — non tira mai i dadi né altera i risultati meccanici.

**Vittoria**
Libera tutte le stanze (o sopravvivi allo scontro finale) per reclamare la Vittoria.`,

  creditsTitle: '📜 Ispirazioni e Crediti',
  creditsBody: `**One Page Solo Engine (OPSE)**
Meccaniche di gioco e tabelle oracolo di **Inflatable Studios**.
Licenza [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
→ [inflatablestudios.itch.io/one-page-solo-engine](https://inflatablestudios.itch.io/one-page-solo-engine)

**Dungeons & Dragons (D&D)**
Gli archetipi di classe (Guerriero, Ladro, Mago, Chierico), il concetto di traccia delle condizioni e il genere dungeon-crawling in generale traggono ispirazione da D&D, originalmente creato da Gary Gygax e Dave Arneson (1974). D&D è attualmente pubblicato da Wizards of the Coast.

**Altre Ispirazioni**
- *Ironsworn* (Shawn Tomkin) — per il design del gioco in solitaria narrativo
- *Scarlet Heroes* (Kevin Crawford) — per il gioco in solitaria in stile D&D
- *Mythic Game Master Emulator* (Tom Pierson) — per le meccaniche del Fattore Caos

**Codice dell'Applicazione**
Sviluppato con React, Vite, TypeScript, Tailwind CSS e Zustand.
Licenza MIT.
L'integrazione AI utilizza la tua chiave API personale ed è elaborata direttamente dal fornitore scelto.`,
};

const de: Translations = {
  topbarTitle: '⚔ DUNGEON CRAWLER',
  abandonDungeon: 'Dungeon verlassen',
  aiSettings: 'KI-Einstellungen',
  howToPlay: 'Spielanleitung',
  credits: 'Danksagungen',
  setupSubtitle: 'Basiert auf der One Page Solo Engine',
  dungeonConfig: '⚔ Dungeon-Konfiguration',
  dungeonNameLabel: 'Dungeon-Name / Thema',
  dungeonNamePlaceholder: 'z.B. Versunkenes Kloster des Roten Abts',
  rollTheme: 'Würfeln',
  dungeonLength: 'Dungeon-Länge',
  rooms5: '5 Räume',
  rooms6: '6 Räume',
  rooms7: '7 Räume',
  time15: '~15 Min.',
  time20: '~20 Min.',
  time30: '~30 Min.',
  yourParty: '🗡 Deine Gruppe',
  enterDungeon: 'Dungeon betreten',
  configureAiHint: 'Konfiguriere deinen KI-Dungeon-Master in den ⚙ Einstellungen.',
  objectiveLabel: 'Ziel',
  adversaryLabel: 'Gegner',
  rewardLabel: 'Belohnung',
  partySectionTitle: 'Gruppe',
  roomLabel: 'Raum',
  hazardLabel: 'Gefahr',
  partyLootLabel: 'Gruppenbeute',
  roomObjectLabel: 'Raumobjekt',
  chaosFactor: 'CF',
  settingScene: '◈ Der Dungeon Master bereitet die Szene vor...',
  narrating: '◈ Der Dungeon Master erzählt...',
  awaitingDM: 'Warte auf den Dungeon Master...',
  awaitingHint: 'Konfiguriere den KI-Anbieter in den Einstellungen.',
  aiUnavailable: 'KI-Dungeon-Master nicht verfügbar',
  aiUnavailableHint: 'Prüfe deinen API-Schlüssel und die Anbieter-Einstellungen.',
  roomHistory: 'RAUMGESCHICHTE',
  suggestedTactics: 'Vorgeschlagene Taktiken',
  customAction: 'Eigene Aktion',
  customActionPlaceholder: 'Beschreibe, was die Gruppe tut...',
  actButton: 'Handeln',
  enterHint: 'Enter zum Bestätigen · Shift+Enter für neue Zeile',
  waitingScene: 'Warte auf die Szene...',
  advanceRoom: 'Nächsten Raum betreten',
  youRolled: 'Du hast gewürfelt',
  strongHitFlavor: 'Der Sieg lächelt den Mutigen.',
  weakHitFlavor: 'Erfolg, aber zu einem Preis.',
  missFlavor: 'Das Schicksal wendet sich gegen dich.',
  victoryTitle: 'Sieg!',
  defeatTitle: 'Niederlage',
  survivors: '✓ Überlebende',
  fallen: '✝ Gefallene',
  lootRecovered: '◈ Erbeutete Gegenstände',
  newExpedition: 'Neue Expedition beginnen',
  Healthy: 'Gesund', Wounded: 'Verwundet', Exhausted: 'Erschöpft', Disabled: 'Kampfunfähig',
  Warrior: 'Krieger', Rogue: 'Schurke', Mage: 'Magier', Cleric: 'Kleriker',
  settingsTitle: '⚙ KI-Dungeon-Master-Einstellungen',
  narrativeLanguage: 'Erzählsprache',
  aiProvider: 'KI-Anbieter',
  apiKeyLabel: 'API-Schlüssel',
  modelLabel: 'Modell',
  baseUrlLabel: 'Basis-URL',
  saveClose: 'Speichern & Schließen',
  webllmNote: 'Das Modell wird beim ersten Einsatz heruntergeladen (~1-2 GB). Kein API-Schlüssel erforderlich.',
  keyPrivacyNote: 'Lokal gespeichert. Wird niemals an andere Server als den gewählten Anbieter übertragen.',
  howToPlayTitle: '📖 Spielanleitung',
  howToPlayBody: `**Solo Dungeon Crawler** ist ein narratives Dungeon-Crawling-Spiel für einen Spieler, angetrieben durch die **One Page Solo Engine (OPSE)** und einen KI-Spielleiter.

**Die Gruppe**
Du steuerst 4 Abenteurer: einen Krieger, einen Schurken, einen Magier und einen Kleriker. Jeder hat eine Zustandsleiste: Gesund → Verwundet → Erschöpft → Kampfunfähig. Sind alle 4 kampfunfähig, endet die Runde mit einer Niederlage.

**Das Dungeon**
Jede Runde besteht aus 5, 6 oder 7 prozedural generierten Räumen. Der letzte ist immer der Bossbegegnung.

**Chaosfaktor (CF)**
Der CF (1–9, startet bei 5) ist ein Schwierigkeitsmodifikator. Ein hoher CF macht Volltreffer seltener und Fehlschläge folgenreicher. Er steigt bei Schwachen Treffern und Fehlschlägen, fällt bei Volltreffern in befreiten Räumen.

**Aktionen ausführen**
Beschreibe jeden Zug, was deine Gruppe tut — wähle eine vorgeschlagene Taktik oder schreib deine eigene. Das System würfelt einen W6 und vergleicht ihn mit dem aktuellen CF:
- **Volltreffer (6+):** Voller Erfolg. Kein Schaden. Raum befreit.
- **Schwacher Treffer (4–5):** Erfolg mit Komplikation. Ein Mitglied verschlechtert seinen Zustand.
- **Fehlschlag (1–3):** Misserfolg mit Konsequenzen. Ein oder zwei Mitglieder erleiden Schaden und eine Fehlschlagbewegung wird ausgelöst.

**Der KI-Spielleiter**
Die KI beschreibt das Ergebnis jeder Aktion, schildert die Räume und schlägt Taktiken vor. Sie ist rein narrativ — sie würfelt nie selbst und verändert nie die mechanischen Ergebnisse.

**Sieg**
Befreie alle Räume (oder überblebe den letzten Kampf), um den Sieg zu erringen.`,
  creditsTitle: '📜 Inspirationen & Danksagungen',
  creditsBody: `**One Page Solo Engine (OPSE)**
Regeln und Orakel-Tabellen von **Inflatable Studios**.
Lizenz [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
→ [inflatablestudios.itch.io/one-page-solo-engine](https://inflatablestudios.itch.io/one-page-solo-engine)

**Dungeons & Dragons (D&D)**
Die Klassen-Archetypen (Krieger, Schurke, Magier, Kleriker), das Konzept der Zustandsleiste und das Dungeon-Crawling-Genre stammen aus D&D, ursprünglich erschaffen von Gary Gygax und Dave Arneson (1974). D&D wird aktuell von Wizards of the Coast verlegt.

**Weitere Inspirationen**
- *Ironsworn* (Shawn Tomkin) — für narratives Solo-Rollenspieldesign
- *Scarlet Heroes* (Kevin Crawford) — für Solo-D&D-Abenteuer
- *Mythic Game Master Emulator* (Tom Pierson) — für die Chaosfaktor-Mechanik

**Anwendungscode**
Entwickelt mit React, Vite, TypeScript, Tailwind CSS und Zustand.
MIT-Lizenz. Die KI-Integration nutzt deinen persönlichen API-Schlüssel und wird direkt vom gewählten Anbieter verarbeitet.`,
};

const fr: Translations = {
  topbarTitle: '⚔ DUNGEON CRAWLER',
  abandonDungeon: 'Abandonner le donjon',
  aiSettings: 'Paramètres IA',
  howToPlay: 'Comment jouer',
  credits: 'Crédits',
  setupSubtitle: 'Propulsé par One Page Solo Engine',
  dungeonConfig: '⚔ Configuration du Donjon',
  dungeonNameLabel: 'Nom / Thème du Donjon',
  dungeonNamePlaceholder: 'ex. Monastère Englouti de l\'Abbé Rouge',
  rollTheme: 'Lancer',
  dungeonLength: 'Longueur du Donjon',
  rooms5: '5 Salles',
  rooms6: '6 Salles',
  rooms7: '7 Salles',
  time15: '~15 min',
  time20: '~20 min',
  time30: '~30 min',
  yourParty: '🗡 Votre Groupe',
  enterDungeon: 'Entrer dans le Donjon',
  configureAiHint: 'Configurez votre Maître du Donjon IA dans les ⚙ Paramètres.',
  objectiveLabel: 'Objectif',
  adversaryLabel: 'Adversaire',
  rewardLabel: 'Récompense',
  partySectionTitle: 'Groupe',
  roomLabel: 'Salle',
  hazardLabel: 'Danger',
  partyLootLabel: 'Butin du groupe',
  roomObjectLabel: 'Objet de la salle',
  chaosFactor: 'FC',
  settingScene: '◈ Le Maître du Donjon prépare la scène...',
  narrating: '◈ Le Maître du Donjon narre...',
  awaitingDM: 'En attente du Maître du Donjon...',
  awaitingHint: 'Configurez votre fournisseur IA dans les paramètres.',
  aiUnavailable: 'Maître du Donjon IA indisponible',
  aiUnavailableHint: 'Vérifiez votre clé API et les paramètres du fournisseur.',
  roomHistory: 'HISTORIQUE DE LA SALLE',
  suggestedTactics: 'Tactiques suggérées',
  customAction: 'Action personnalisée',
  customActionPlaceholder: 'Décrivez ce que fait le groupe...',
  actButton: 'Agir',
  enterHint: 'Entrée pour valider · Shift+Entrée pour nouvelle ligne',
  waitingScene: 'En attente du déroulement de la scène...',
  advanceRoom: 'Avancer à la salle suivante',
  youRolled: 'Vous avez lancé',
  strongHitFlavor: 'La victoire sourit aux audacieux.',
  weakHitFlavor: 'Succès, à quel prix.',
  missFlavor: 'Le destin se retourne contre vous.',
  victoryTitle: 'Victoire !',
  defeatTitle: 'Défaite',
  survivors: '✓ Survivants',
  fallen: '✝ Tombés',
  lootRecovered: '◈ Butin récupéré',
  newExpedition: 'Commencer une nouvelle expédition',
  Healthy: 'En forme', Wounded: 'Blessé', Exhausted: 'Épuisé', Disabled: 'Hors de combat',
  Warrior: 'Guerrier', Rogue: 'Roublard', Mage: 'Mage', Cleric: 'Clerc',
  settingsTitle: '⚙ Paramètres du Maître du Donjon IA',
  narrativeLanguage: 'Langue de narration',
  aiProvider: 'Fournisseur IA',
  apiKeyLabel: 'Clé API',
  modelLabel: 'Modèle',
  baseUrlLabel: 'URL de base',
  saveClose: 'Sauvegarder et fermer',
  webllmNote: 'Le modèle sera téléchargé lors du premier usage (~1-2 Go). Pas de clé API requise.',
  keyPrivacyNote: 'Stocké localement. Jamais transmis à d\'autres serveurs que le fournisseur choisi.',
  howToPlayTitle: '📖 Comment jouer',
  howToPlayBody: `**Solo Dungeon Crawler** est un jeu de narration pour un seul joueur, propulsé par le **One Page Solo Engine (OPSE)** et un Maître du Donjon IA.

**Le Groupe**
Vous contrôlez 4 aventuriers : un Guerrier, un Roublard, un Mage et un Clerc. Chacun possède une Jauge de Condition : En forme → Blessé → Épuisé → Hors de combat. Si les 4 sont hors de combat, la partie se termine en Défaite.

**Le Donjon**
Chaque partie consiste en 5, 6 ou 7 salles générées de façon procédurale. La dernière salle est toujours la rencontre avec le boss.

**Facteur de Chaos (FC)**
Le FC (1–9, commence à 5) est un modificateur de difficulté. Un FC élevé rend les Succès Complets plus rares et les Échecs plus pénalisants. Il monte avec les Succès Partiels et les Échecs, et descend avec les Succès Complets dans des salles libérées.

**Effectuer des Actions**
À chaque tour, décrivez ce que fait votre groupe — en choisissant une tactique suggérée ou en écrivant la vôtre. Le moteur lance un d6 et le compare au FC actuel :
- **Succès Complet (6+) :** Plein succès. Aucun dégât. Salle libérée.
- **Succès Partiel (4–5) :** Succès avec complication. Un membre voit sa Condition se détériorer.
- **Échec (1–3) :** Echec avec conséquences. Un ou deux membres subissent des dégâts et un Mouvement d'Échec est déclenché.

**Le Maître du Donjon IA**
L'IA narre le résultat de chaque action, décrit les salles et suggère des tactiques. Elle est purement narrative — elle ne lance jamais les dés elle-même et n'altère jamais les résultats mécaniques.

**Victoire**
Libérez toutes les salles (ou survivez à la rencontre finale) pour remporter la Victoire.`,
  creditsTitle: '📜 Inspirations & Crédits',
  creditsBody: `**One Page Solo Engine (OPSE)**
Mécaniques de jeu et tables d'oracle par **Inflatable Studios**.
Licence [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
→ [inflatablestudios.itch.io/one-page-solo-engine](https://inflatablestudios.itch.io/one-page-solo-engine)

**Donjons & Dragons (D&D)**
Les archétypes de classe (Guerrier, Roublard, Mage, Clerc), le concept de jauge de condition et le genre dungeon-crawling s'inspirent de D&D, créé à l'origine par Gary Gygax et Dave Arneson (1974). D&D est actuellement publié par Wizards of the Coast.

**Autres Inspirations**
- *Ironsworn* (Shawn Tomkin) — pour le design narratif du jeu en solo
- *Scarlet Heroes* (Kevin Crawford) — pour le jeu en solo style D&D
- *Mythic Game Master Emulator* (Tom Pierson) — pour les mécaniques du Facteur de Chaos

**Code de l'Application**
Développé avec React, Vite, TypeScript, Tailwind CSS et Zustand.
Licence MIT. L'intégration IA utilise votre clé API personnelle et est traitée directement par le fournisseur choisi.`,
};

const es: Translations = {
  topbarTitle: '⚔ DUNGEON CRAWLER',
  abandonDungeon: 'Abandonar la mazmorra',
  aiSettings: 'Configuración IA',
  howToPlay: 'Cómo jugar',
  credits: 'Créditos',
  setupSubtitle: 'Impulsado por One Page Solo Engine',
  dungeonConfig: '⚔ Configuración de la Mazmorra',
  dungeonNameLabel: 'Nombre / Tema de la Mazmorra',
  dungeonNamePlaceholder: 'ej. Monasterio Hundido del Abad Rojo',
  rollTheme: 'Tirar',
  dungeonLength: 'Duración de la Mazmorra',
  rooms5: '5 Salas',
  rooms6: '6 Salas',
  rooms7: '7 Salas',
  time15: '~15 min',
  time20: '~20 min',
  time30: '~30 min',
  yourParty: '🗡 Tu Grupo',
  enterDungeon: 'Entrar en la Mazmorra',
  configureAiHint: 'Configura tu Dungeon Master IA en ⚙ Ajustes antes de empezar.',
  objectiveLabel: 'Objetivo',
  adversaryLabel: 'Adversario',
  rewardLabel: 'Recompensa',
  partySectionTitle: 'Grupo',
  roomLabel: 'Sala',
  hazardLabel: 'Peligro',
  partyLootLabel: 'Botín del grupo',
  roomObjectLabel: 'Objeto de la sala',
  chaosFactor: 'FC',
  settingScene: '◈ El Dungeon Master está preparando la escena...',
  narrating: '◈ El Dungeon Master está narrando...',
  awaitingDM: 'Esperando al Dungeon Master...',
  awaitingHint: 'Configura tu proveedor de IA en los ajustes.',
  aiUnavailable: 'Dungeon Master IA no disponible',
  aiUnavailableHint: 'Comprueba tu clave API y la configuración del proveedor.',
  roomHistory: 'HISTORIAL DE LA SALA',
  suggestedTactics: 'Tácticas sugeridas',
  customAction: 'Acción personalizada',
  customActionPlaceholder: 'Describe lo que hace el grupo...',
  actButton: 'Actuar',
  enterHint: 'Enter para confirmar · Shift+Enter para nueva línea',
  waitingScene: 'Esperando que la escena se desarrolle...',
  advanceRoom: 'Avanzar a la siguiente sala',
  youRolled: 'Has sacado',
  strongHitFlavor: 'La victoria sonríe a los audaces.',
  weakHitFlavor: 'Éxito, pero a un precio.',
  missFlavor: 'El destino se vuelve contra ti.',
  victoryTitle: '¡Victoria!',
  defeatTitle: 'Derrota',
  survivors: '✓ Supervivientes',
  fallen: '✝ Caídos',
  lootRecovered: '◈ Botín recuperado',
  newExpedition: 'Comenzar una nueva expedición',
  Healthy: 'Sano', Wounded: 'Herido', Exhausted: 'Agotado', Disabled: 'Fuera de combate',
  Warrior: 'Guerrero', Rogue: 'Pícaro', Mage: 'Mago', Cleric: 'Clérigo',
  settingsTitle: '⚙ Configuración del Dungeon Master IA',
  narrativeLanguage: 'Idioma de la narración',
  aiProvider: 'Proveedor IA',
  apiKeyLabel: 'Clave API',
  modelLabel: 'Modelo',
  baseUrlLabel: 'URL base',
  saveClose: 'Guardar y cerrar',
  webllmNote: 'El modelo se descargará en el navegador en el primer uso (~1-2 GB). No se requiere clave API.',
  keyPrivacyNote: 'Almacenado localmente. Nunca se transmite a otros servidores que el proveedor elegido.',
  howToPlayTitle: '📖 Cómo jugar',
  howToPlayBody: `**Solo Dungeon Crawler** es un juego narrativo de exploración de mazmorras para un jugador, impulsado por el **One Page Solo Engine (OPSE)** y un Dungeon Master IA.

**El Grupo**
Controlas 4 aventureros: un Guerrero, un Pícaro, un Mago y un Clérigo. Cada uno tiene una Barra de Condición: Sano → Herido → Agotado → Fuera de combate. Si los 4 están fuera de combate, la partida termina en Derrota.

**La Mazmorra**
Cada partida consta de 5, 6 o 7 salas generadas proceduralmente. La última es siempre el encuentro final con el jefe.

**Factor de Caos (FC)**
El FC (1–9, comienza en 5) es un modificador de dificultad. Un FC alto hace que los Éxitos Totales sean más difíciles y los Fallos más perjudiciales. Sube con Éxitos Parciales y Fallos, y baja con Éxitos Totales en salas liberadas.

**Ejecutar Acciones**
Cada turno, describe lo que hace tu grupo — eligiendo una táctica sugerida o escribiendo la tuya propia. El motor tira un d6 y lo compara con el FC actual:
- **Éxito Total (6+):** Éxito completo. Sin daño al grupo. Sala liberada.
- **Éxito Parcial (4–5):** Éxito con complicación. Un miembro empeora su Condición.
- **Fallo (1–3):** Fracaso con consecuencias. Uno o dos miembros sufren daño y se activa un Movimiento de Fallo.

**El Dungeon Master IA**
La IA narra el resultado de cada acción, describe las salas y sugiere tácticas. Es puramente narrativa — nunca tira los dados ella misma ni altera los resultados mecánicos.

**Victoria**
Libera todas las salas (o sobrevive al encuentro final) para proclamar la Victoria.`,
  creditsTitle: '📜 Inspiraciones y Créditos',
  creditsBody: `**One Page Solo Engine (OPSE)**
Mecánicas de juego y tablas de oráculo de **Inflatable Studios**.
Licencia [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
→ [inflatablestudios.itch.io/one-page-solo-engine](https://inflatablestudios.itch.io/one-page-solo-engine)

**Dungeons & Dragons (D&D)**
Los arquetipos de clase (Guerrero, Pícaro, Mago, Clérigo), el concepto de barra de condición y el género dungeon-crawling se inspiran en D&D, creado originalmente por Gary Gygax y Dave Arneson (1974). D&D es publicado actualmente por Wizards of the Coast.

**Otras Inspiraciones**
- *Ironsworn* (Shawn Tomkin) — por el diseño narrativo del juego en solitario
- *Scarlet Heroes* (Kevin Crawford) — por el juego en solitario estilo D&D
- *Mythic Game Master Emulator* (Tom Pierson) — por las mecánicas del Factor de Caos

**Código de la Aplicación**
Desarrollado con React, Vite, TypeScript, Tailwind CSS y Zustand.
Licencia MIT. La integración IA usa tu clave API personal y es procesada directamente por el proveedor elegido.`,
};

export const TRANSLATIONS: Record<string, Translations> = { en, it, de, fr, es };

export function useTranslations(lang: string): Translations {
  return TRANSLATIONS[lang] ?? TRANSLATIONS['en'];
}
