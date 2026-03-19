import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Plus, Save, X } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ExerciseItem from '../exercises/ExerciseItem';
import ExerciseCatalogSearch from '../exercises/ExerciseCatalogSearch';
import { DAYS_OF_WEEK, DAYS_FULL } from '../../constants';

const emptyWorkout = {
  name: '',
  description: '',
  days: [],
  exercises: [],
};

export default function WorkoutForm({ initialData = null, onSubmit, isEdit = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({
    ...emptyWorkout,
    ...(initialData ?? {}),
  }));
  const [errors, setErrors] = useState({});
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // DnD sensors — pointer + keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const setField = (field) => (e) => {
    const val = typeof e === 'string' || typeof e === 'number' ? e : e?.target?.value ?? e;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleDay = (dayIndex) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(dayIndex)
        ? prev.days.filter((d) => d !== dayIndex)
        : [...prev.days, dayIndex].sort(),
    }));
  };

  const addExercise = (exercise) => {
    setForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, exercise],
    }));
  };

  const updateExercise = (exerciseId, updates) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      ),
    }));
  };

  const removeExercise = (exerciseId) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setForm((prev) => {
        const oldIndex = prev.exercises.findIndex((ex) => ex.id === active.id);
        const newIndex = prev.exercises.findIndex((ex) => ex.id === over.id);
        return { ...prev, exercises: arrayMove(prev.exercises, oldIndex, newIndex) };
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Il nome della scheda è obbligatorio';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

        {/* Workout name */}
        <div>
          <label htmlFor="workout-name" className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
            Nome Scheda
          </label>
          <input
            id="workout-name"
            type="text"
            value={form.name}
            onChange={setField('name')}
            placeholder="Es. Push Day A, Upper Body..."
            required
            aria-required="true"
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={[
              'w-full bg-transparent border-b-2 py-3 text-2xl font-bold font-[\'Space_Grotesk\'] text-white placeholder:text-white/20',
              'focus:outline-none transition-colors',
              errors.name
                ? 'border-red-500 focus:border-red-400'
                : 'border-white/20 focus:border-[#E8FF3A]',
            ].join(' ')}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-xs text-red-400 mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="workout-desc" className="text-xs font-medium text-white/50 uppercase tracking-wider">
            Descrizione <span className="normal-case text-white/30">(opzionale)</span>
          </label>
          <textarea
            id="workout-desc"
            value={form.description}
            onChange={setField('description')}
            placeholder="Obiettivo della scheda, note generali..."
            rows={2}
            className="w-full bg-[#0F3460]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E8FF3A] focus:ring-1 focus:ring-[#E8FF3A] transition-colors resize-none"
          />
        </div>

        {/* Day selector */}
        <div>
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
            Giorni della Settimana
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Seleziona giorni">
            {DAYS_OF_WEEK.map((short, i) => (
              <button
                key={short}
                type="button"
                onClick={() => toggleDay(i)}
                aria-pressed={form.days.includes(i)}
                aria-label={DAYS_FULL[i]}
                className={[
                  'px-4 py-2 rounded-xl text-sm font-mono font-bold min-h-[44px] border transition-all duration-150',
                  form.days.includes(i)
                    ? 'bg-[#E8FF3A]/15 text-[#E8FF3A] border-[#E8FF3A]/40 shadow-[0_0_12px_rgba(232,255,58,0.15)]'
                    : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/70',
                ].join(' ')}
              >
                {short}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Esercizi
              {form.exercises.length > 0 && (
                <span className="ml-2 text-white/30 normal-case font-mono">({form.exercises.length})</span>
              )}
            </p>
          </div>

          {form.exercises.length === 0 && (
            <div className="border border-dashed border-white/15 rounded-xl py-10 text-center">
              <p className="text-3xl mb-2">🏋️</p>
              <p className="text-sm text-white/30">Nessun esercizio aggiunto</p>
              <p className="text-xs text-white/20 mt-1">Clicca il bottone qui sotto per aggiungerne</p>
            </div>
          )}

          {/* Sortable exercise list */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={form.exercises.map((ex) => ex.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {form.exercises.map((exercise, index) => (
                  <ExerciseItem
                    key={exercise.id}
                    exercise={exercise}
                    index={index}
                    onChange={updateExercise}
                    onDelete={removeExercise}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add exercise button */}
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => setIsCatalogOpen(true)}
            className="w-full border-dashed"
          >
            <Plus size={16} />
            Aggiungi Esercizio
          </Button>
        </div>

        {/* Form actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => navigate(-1)}
            className="sm:flex-1"
          >
            <X size={16} />
            Annulla
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="sm:flex-2 sm:flex-[2]"
          >
            <Save size={16} />
            {isEdit ? 'Salva Modifiche' : 'Crea Scheda'}
          </Button>
        </div>
      </form>

      <ExerciseCatalogSearch
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onAddExercise={addExercise}
      />
    </>
  );
}
