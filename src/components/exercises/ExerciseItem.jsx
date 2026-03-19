import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../ui/Button';

export default function ExerciseItem({ exercise, onChange, onDelete, index }) {
  const [showNotes, setShowNotes] = useState(Boolean(exercise.notes));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  const handleField = (field) => (e) => {
    onChange(exercise.id, { [field]: e.target.value });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#0F3460]/50 border border-white/10 rounded-xl p-4 flex flex-col gap-3"
      aria-label={`Esercizio ${index + 1}: ${exercise.name}`}
    >
      {/* Top row: drag handle + name + delete */}
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          aria-label="Trascina per riordinare"
          className="text-white/30 hover:text-white/60 cursor-grab active:cursor-grabbing p-1 touch-none"
        >
          <GripVertical size={18} />
        </button>

        {/* Exercise name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {exercise.emoji && (
            <span className="text-lg shrink-0" aria-hidden="true">{exercise.emoji}</span>
          )}
          <span className="text-sm font-semibold text-white font-['Space_Grotesk'] truncate">
            {exercise.name}
          </span>
          {exercise.muscleGroup && (
            <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded shrink-0 hidden sm:inline">
              {exercise.muscleGroup}
            </span>
          )}
        </div>

        {/* Delete */}
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(exercise.id)}
          aria-label={`Rimuovi ${exercise.name}`}
          className="shrink-0 min-h-[36px] px-2"
        >
          <Trash2 size={14} />
        </Button>
      </div>

      {/* Input row: sets / reps / weight */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`sets-${exercise.id}`}
            className="text-xs text-white/50 font-medium"
          >
            Serie
          </label>
          <input
            id={`sets-${exercise.id}`}
            type="number"
            min="1"
            max="20"
            value={exercise.sets ?? ''}
            onChange={handleField('sets')}
            className="bg-[#1A1A2E] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white text-center focus:outline-none focus:border-[#E8FF3A] focus:ring-1 focus:ring-[#E8FF3A] transition-colors min-h-[44px]"
            aria-label={`Serie per ${exercise.name}`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor={`reps-${exercise.id}`}
            className="text-xs text-white/50 font-medium"
          >
            Reps
          </label>
          <input
            id={`reps-${exercise.id}`}
            type="text"
            value={exercise.reps ?? ''}
            onChange={handleField('reps')}
            placeholder="8-10"
            className="bg-[#1A1A2E] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white text-center focus:outline-none focus:border-[#E8FF3A] focus:ring-1 focus:ring-[#E8FF3A] transition-colors min-h-[44px]"
            aria-label={`Ripetizioni per ${exercise.name}`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor={`weight-${exercise.id}`}
            className="text-xs text-white/50 font-medium"
          >
            Peso (kg)
          </label>
          <input
            id={`weight-${exercise.id}`}
            type="number"
            min="0"
            step="0.5"
            value={exercise.weight ?? ''}
            onChange={handleField('weight')}
            placeholder="0"
            className="bg-[#1A1A2E] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white text-center focus:outline-none focus:border-[#E8FF3A] focus:ring-1 focus:ring-[#E8FF3A] transition-colors min-h-[44px]"
            aria-label={`Peso per ${exercise.name}`}
          />
        </div>
      </div>

      {/* Notes toggle */}
      <button
        type="button"
        onClick={() => setShowNotes((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors self-start"
        aria-expanded={showNotes}
      >
        {showNotes ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {showNotes ? 'Nascondi note' : 'Aggiungi note'}
      </button>

      {showNotes && (
        <textarea
          value={exercise.notes ?? ''}
          onChange={handleField('notes')}
          placeholder="Note per questo esercizio (es. tecnica, forma, progressione...)"
          rows={2}
          aria-label={`Note per ${exercise.name}`}
          className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E8FF3A] focus:ring-1 focus:ring-[#E8FF3A] transition-colors resize-none"
        />
      )}
    </div>
  );
}
