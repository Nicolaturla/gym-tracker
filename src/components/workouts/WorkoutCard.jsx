import { useNavigate } from 'react-router-dom';
import { Play, Pencil, Trash2, Clock, Dumbbell } from 'lucide-react';
import { DAYS_OF_WEEK } from '../../constants';
import Button from '../ui/Button';

export default function WorkoutCard({ workout, onDelete }) {
  const navigate = useNavigate();
  const { id, name, description, days = [], exercises = [] } = workout;

  // Estimate ~3 min per exercise set series
  const estimatedMinutes = exercises.reduce((acc, ex) => acc + (ex.sets || 3) * 3, 0);

  // Collect unique muscle groups for preview
  const muscleGroups = [...new Set(exercises.map((ex) => ex.muscleGroup).filter(Boolean))];

  return (
    <article
      className="bg-[#16213E] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 hover:border-white/15 transition-all duration-200 hover:shadow-lg hover:shadow-black/20 group"
      aria-label={`Scheda: ${name}`}
    >
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white leading-tight mb-1 group-hover:text-[#E8FF3A] transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Days badges */}
      {days.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label="Giorni allenamento">
          {DAYS_OF_WEEK.map((day, i) => (
            <span
              key={day}
              className={[
                'text-xs px-2 py-0.5 rounded-md font-mono font-bold transition-colors',
                days.includes(i)
                  ? 'bg-[#E8FF3A]/15 text-[#E8FF3A] border border-[#E8FF3A]/30'
                  : 'bg-white/5 text-white/20 border border-transparent',
              ].join(' ')}
              aria-label={`${day}${days.includes(i) ? ' (attivo)' : ''}`}
            >
              {day}
            </span>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-white/50">
        <span className="flex items-center gap-1.5">
          <Dumbbell size={13} />
          <span className="font-mono font-bold text-white/70">{exercises.length}</span>
          {exercises.length === 1 ? 'esercizio' : 'esercizi'}
        </span>
        {estimatedMinutes > 0 && (
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            <span className="font-mono font-bold text-white/70">~{estimatedMinutes}</span>
            min
          </span>
        )}
      </div>

      {/* Exercise preview chips */}
      {exercises.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {exercises.slice(0, 4).map((ex) => (
            <span
              key={ex.id}
              className="text-xs bg-white/5 text-white/50 border border-white/10 px-2 py-0.5 rounded-lg flex items-center gap-1"
            >
              {ex.emoji && <span aria-hidden="true">{ex.emoji}</span>}
              {ex.name}
            </span>
          ))}
          {exercises.length > 4 && (
            <span className="text-xs bg-white/5 text-white/40 border border-white/10 px-2 py-0.5 rounded-lg">
              +{exercises.length - 4} altri
            </span>
          )}
        </div>
      )}

      {/* Muscle group tags */}
      {muscleGroups.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {muscleGroups.slice(0, 4).map((group) => (
            <span key={group} className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
              {group}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/5">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/workout/${id}/train`)}
          aria-label={`Inizia allenamento: ${name}`}
        >
          <Play size={14} />
          Inizia
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/workout/${id}/edit`)}
          aria-label={`Modifica scheda: ${name}`}
        >
          <Pencil size={14} />
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(id)}
          aria-label={`Elimina scheda: ${name}`}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </article>
  );
}
