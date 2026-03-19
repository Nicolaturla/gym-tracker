import { useState, useRef, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { exerciseCatalog, searchExercises } from '../../data/exerciseCatalog';
import { MUSCLE_GROUPS } from '../../constants';

export default function ExerciseCatalogSearch({ isOpen, onClose, onAddExercise }) {
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [customName, setCustomName] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const searchRef = useRef(null);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedGroup(null);
      setShowCustom(false);
      setCustomName('');
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const results = searchExercises(query, selectedGroup);

  const handleAddFromCatalog = (exercise) => {
    onAddExercise({
      id: crypto.randomUUID(),
      catalogId: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      emoji: exercise.emoji,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      weight: '',
      notes: '',
    });
    onClose();
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    onAddExercise({
      id: crypto.randomUUID(),
      catalogId: null,
      name: customName.trim(),
      muscleGroup: selectedGroup ?? 'Altro',
      equipment: '',
      emoji: '🏋️',
      sets: 3,
      reps: '10-12',
      weight: '',
      notes: '',
    });
    onClose();
  };

  const allGroups = MUSCLE_GROUPS;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Aggiungi Esercizio" size="lg">
      <div className="flex flex-col gap-4">

        {/* Search input */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca esercizio..."
            aria-label="Cerca esercizio nel catalogo"
            className="w-full bg-[#0F3460] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8FF3A] focus:ring-1 focus:ring-[#E8FF3A] transition-colors min-h-[44px]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Cancella ricerca"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Muscle group filter chips (horizontal scroll) */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="Filtra per gruppo muscolare">
          <button
            onClick={() => setSelectedGroup(null)}
            className={[
              'shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-colors min-h-[32px]',
              !selectedGroup
                ? 'bg-[#E8FF3A]/15 text-[#E8FF3A] border-[#E8FF3A]/30'
                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10',
            ].join(' ')}
            aria-pressed={!selectedGroup}
          >
            Tutti
          </button>
          {allGroups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(selectedGroup === group ? null : group)}
              className={[
                'shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-colors min-h-[32px]',
                selectedGroup === group
                  ? 'bg-[#E8FF3A]/15 text-[#E8FF3A] border-[#E8FF3A]/30'
                  : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10',
              ].join(' ')}
              aria-pressed={selectedGroup === group}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-white/30">
          {results.length} {results.length === 1 ? 'risultato' : 'risultati'}
        </p>

        {/* Results list */}
        <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto" role="list" aria-label="Risultati catalogo">
          {results.map((exercise) => (
            <li key={exercise.id}>
              <button
                onClick={() => handleAddFromCatalog(exercise)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F3460]/50 hover:bg-[#0F3460] border border-white/5 hover:border-white/20 transition-all text-left group"
                aria-label={`Aggiungi ${exercise.name}`}
              >
                <span className="text-xl shrink-0" aria-hidden="true">{exercise.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-[#E8FF3A] transition-colors">
                    {exercise.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge label={exercise.muscleGroup} />
                    {exercise.equipment && (
                      <span className="text-xs text-white/30">{exercise.equipment}</span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-xs text-white/30 font-mono">
                  {exercise.defaultSets}×{exercise.defaultReps}
                </div>
                <Plus size={16} className="shrink-0 text-white/30 group-hover:text-[#E8FF3A] transition-colors" />
              </button>
            </li>
          ))}

          {results.length === 0 && (
            <li className="text-center py-8 text-sm text-white/30">
              Nessun esercizio trovato
            </li>
          )}
        </ul>

        {/* Custom exercise section */}
        <div className="border-t border-white/10 pt-4">
          {!showCustom ? (
            <button
              onClick={() => setShowCustom(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/20 text-sm text-white/40 hover:text-white/70 hover:border-white/40 transition-colors min-h-[44px]"
            >
              <Plus size={16} />
              Aggiungi esercizio personalizzato
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium text-white/60">Esercizio personalizzato</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                  placeholder="Nome esercizio..."
                  aria-label="Nome esercizio personalizzato"
                  autoFocus
                  className="flex-1 bg-[#0F3460] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8FF3A] focus:ring-1 focus:ring-[#E8FF3A] min-h-[44px]"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddCustom}
                  disabled={!customName.trim()}
                >
                  Aggiungi
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
