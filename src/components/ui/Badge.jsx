import { MUSCLE_GROUP_COLORS } from '../../constants';

/**
 * Badge component for muscle groups with distinct colors per group.
 * Falls back to a neutral style for unknown groups.
 */
export default function Badge({ label, className = '' }) {
  const colors = MUSCLE_GROUP_COLORS[label] ?? {
    bg: 'bg-white/10',
    text: 'text-white/70',
    border: 'border-white/20',
  };

  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
        colors.bg,
        colors.text,
        colors.border,
        className,
      ].join(' ')}
    >
      {label}
    </span>
  );
}
