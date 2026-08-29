/**
 * App.tsx – State-driven router.
 * Renders the appropriate screen based on gameStatus from Zustand store.
 * No external router dependency needed.
 */

import { useDungeonStore } from './store';
import { SetupScreen } from './components/setup/SetupScreen';
import { GameScreen } from './components/layout/GameScreen';
import { EndScreen } from './components/endscreen/EndScreen';

export default function App() {
  const gameStatus = useDungeonStore((s) => s.gameStatus);

  switch (gameStatus) {
    case 'SETUP':
      return <SetupScreen />;

    case 'EXPLORING':
    case 'IN_COMBAT':
      return <GameScreen />;

    case 'VICTORY':
    case 'DEFEAT':
      return <EndScreen />;

    default:
      return <SetupScreen />;
  }
}
