import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, X } from 'lucide-react';
import { useWorkouts } from '../context/WorkoutContext';
import WorkoutCard from '../components/workouts/WorkoutCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';

export default function Dashboard() {
  const navigate = useNavigate();
  const { workouts, deleteWorkout } = useWorkouts();
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return workouts;
    const q = query.toLowerCase();
    return workouts.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q) ||
        w.exercises?.some((ex) => ex.name.toLowerCase().includes(q))
    );
  }, [workouts, query]);

  const confirmDelete = (id) => setDeleteTarget(id);
  const handleDelete = () => {
    if (deleteTarget) {
      deleteWorkout(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
              Le tue Schede
            </h1>
            <p className="text-sm text-white/40 mt-1">
              {workouts.length === 0
                ? 'Nessuna scheda ancora'
                : `${workouts.length} ${workouts.length === 1 ? 'scheda' : 'schede'}`}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/workout/new')}
            aria-label="Crea nuova scheda"
          >
            <Plus size={16} />
            Nuova
          </Button>
        </div>

        {/* Search bar — only show if there are workouts */}
        {workouts.length > 0 && (
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca scheda o esercizio..."
              aria-label="Cerca tra le schede"
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
        )}

        {/* Content */}
        {workouts.length === 0 ? (
          <EmptyState
            emoji="🏋️"
            title="Nessuna scheda ancora"
            description="Crea la tua prima scheda di allenamento per iniziare a tracciare i tuoi progressi."
            action={() => navigate('/workout/new')}
            actionLabel="+ Crea prima scheda"
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            emoji="🔍"
            title="Nessun risultato"
            description={`Nessuna scheda corrisponde a "${query}".`}
            action={() => setQuery('')}
            actionLabel="Cancella filtro"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onDelete={confirmDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Elimina scheda"
        size="sm"
      >
        <div className="flex flex-col gap-5">
          <p className="text-sm text-white/70 leading-relaxed">
            Sei sicuro di voler eliminare questa scheda? L'azione non è reversibile.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="md"
              className="flex-1"
              onClick={() => setDeleteTarget(null)}
            >
              Annulla
            </Button>
            <Button
              variant="danger"
              size="md"
              className="flex-1"
              onClick={handleDelete}
            >
              Elimina
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
