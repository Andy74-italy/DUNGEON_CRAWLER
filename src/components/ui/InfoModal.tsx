/**
 * components/ui/InfoModal.tsx – How To Play and Credits modal.
 * Renders markdown-like text with bold (**) and link ([text](url)) support.
 */

import { Modal } from './Modal';
import { useDungeonStore } from '../../store';
import { useTranslations } from '../../i18n/translations';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'howToPlay' | 'credits';
}

/** Minimal markdown renderer: bold (**text**), links ([text](url)), line breaks, and headers (** line **). */
function renderMarkdown(text: string): JSX.Element[] {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const key = i;

    // Stand-alone bold line (header style) e.g. **Title**
    if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
      return (
        <p key={key} className="font-display font-semibold text-dungeon-200 text-sm mt-4 mb-1 first:mt-0">
          {line.trim().slice(2, -2)}
        </p>
      );
    }

    // Empty line → spacer
    if (line.trim() === '') {
      return <div key={key} className="h-2" />;
    }

    // Regular line with inline formatting
    const parts = parseLine(line);
    return (
      <p key={key} className="text-dungeon-300 text-sm leading-relaxed">
        {parts}
      </p>
    );
  });
}

function parseLine(text: string): (string | JSX.Element)[] {
  const result: (string | JSX.Element)[] = [];

  // Combined regex: match either bold or link
  const combinedRegex = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Text before this match
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      // Bold
      result.push(
        <strong key={`b-${match.index}`} className="text-dungeon-100 font-semibold">
          {match[1]}
        </strong>
      );
    } else if (match[2] !== undefined && match[3] !== undefined) {
      // Link
      result.push(
        <a
          key={`l-${match.index}`}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold-400 hover:text-gold-300 underline underline-offset-2"
        >
          {match[2]}
        </a>
      );
    }

    lastIndex = combinedRegex.lastIndex;
  }

  // Remaining text after last match
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result.length > 0 ? result : [text];
}

export function InfoModal({ isOpen, onClose, mode }: InfoModalProps) {
  const lang = useDungeonStore((s) => s.language);
  const t = useTranslations(lang);

  const title = mode === 'howToPlay' ? t.howToPlayTitle : t.creditsTitle;
  const body = mode === 'howToPlay' ? t.howToPlayBody : t.creditsBody;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <div className="max-h-[65vh] overflow-y-auto pr-1 space-y-0.5">
        {renderMarkdown(body)}
      </div>
    </Modal>
  );
}
