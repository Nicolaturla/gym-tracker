import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { exerciseCatalog, searchExercises } from '../data/exerciseCatalog';
import { MUSCLE_GROUPS } from '../constants';
import Badge from '../components/ui/Badge';

export default function CatalogPage() {
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  const results = searchExercises(query, selectedGroup);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Catalogo Esercizi</h1>
        <p className="text-sm text-white/40 mt-1">{exerciseCatalog.length} esercizi disponibili</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca esercizio..."
          aria-label="Cerca nel catalogo"
          className="w-full bg-[#16213E] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8FF3A] focus:ring-1 focus:ring-[#E8FF3A] transition-colors min-h-[44px]"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Cancella ricerca"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 p-1"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Group filter */}
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
        {MUSCLE_GROUPS.map((group) => (
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

      {/* Results */}
      <p className="text-xs text-white/30">{results.length} risultati</p>

      <div className="flex flex-col gap-2">
        {results.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-[#16213E] border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <span className="text-xl shrink-0" aria-hidden="true">{exercise.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{exercise.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge label={exercise.muscleGroup} />
                {exercise.equipment && (
                  <span className="text-xs text-white/30">{exercise.equipment}</span>
                )}
              </div>
            </div>
            <div className="shrink-0 text-xs text-white/40 font-mono">
              {exercise.defaultSets}×{exercise.defaultReps}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
