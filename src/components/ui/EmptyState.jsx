import Button from './Button';

/**
 * Empty state with large emoji illustration, title, description, and optional CTA.
 */
export default function EmptyState({
  emoji = '📭',
  title,
  description,
  action,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="text-6xl mb-6 select-none" role="img" aria-label={title}>
        {emoji}
      </div>
      <h3 className="text-xl font-semibold font-['Space_Grotesk'] text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-white/50 max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {action && actionLabel && (
        <div className="mt-6">
          <Button onClick={action} variant="primary" size="md">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
