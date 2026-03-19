import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Pencil, Trash2, Clock, Dumbbell, Calendar } from 'lucide-react';
import { useWorkouts } from '../context/WorkoutContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import { DAYS_OF_WEEK, DAYS_FULL } from '../constants';
import { useState } from 'react';

export default function WorkoutDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getWorkoutById, deleteWorkout } = useWorkouts();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const workout = getWorkoutById(id);

  if (!workout) {
    return (
      <EmptyState
        emoji="🔍"
        title="Scheda non trovata"
        description="La scheda che stai cercando non esiste o è stata eliminata."
        action={() => navigate('/')}
        actionLabel="Torna alla home"
      />
    );
  }

  const { name, description, days = [], exercises = [] } = workout;
  const estimatedMinutes = exercises.reduce((acc, ex) => acc + (ex.sets || 3) * 3, 0);
  const activeDays = days.map((d) => DAYS_FULL[d]).join(', ');

  const handleDelete = () => {
    deleteWorkout(id);
    navigate('/');
  };

  // Group exercises by muscle group
  const grouped = exercises.reduce((acc, ex) => {
    const group = ex.muscleGroup || 'Altro';
    if (!acc[group]) acc[group] = [];
    acc[group].push(ex);
    return acc;
  }, {});

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            aria-label="Torna indietro"
            className="px-2"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-xl font-bold font-['Space_Grotesk'] text-white flex-1 truncate">
            {name}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/workout/${id}/edit`)}
            aria-label="Modifica scheda"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            aria-label="Elimina scheda"
          >
            <Trash2 size={16} />
          </Button>
        </div>

        {/* Info card */}
        <div className="bg-[#16213E] rounded-2xl p-5 flex flex-col gap-4 border border-white/5">
          {description && (
            <p className="text-sm text-white/60 leading-relaxed">{description}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Dumbbell size={16} className="text-[#E8FF3A]" />
              <span className="text-white/50">Esercizi:</span>
              <span className="font-mono font-bold text-white">{exercises.length}</span>
            </div>
            {estimatedMinutes > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-[#E8FF3A]" />
                <span className="text-white/50">Durata:</span>
                <span className="font-mono font-bold text-white">~{estimatedMinutes} min</span>
              </div>
            )}
          </div>

          {/* Days */}
          {days.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} className="text-white/40" />
                <span className="text-xs text-white/40">{activeDays}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DAYS_OF_WEEK.map((day, i) => (
                  <span
                    key={day}
                    className={[
                      'text-xs px-2.5 py-1 rounded-lg font-mono font-bold border',
                      days.includes(i)
                        ? 'bg-[#E8FF3A]/15 text-[#E8FF3A] border-[#E8FF3A]/30'
                        : 'bg-white/5 text-white/15 border-transparent',
                    ].join(' ')}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Exercises */}
        {exercises.length === 0 ? (
          <EmptyState
            emoji="💪"
            title="Nessun esercizio"
            description="Aggiungi esercizi a questa scheda."
            action={() => navigate(`/workout/${id}/edit`)}
            actionLabel="Modifica scheda"
          />
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(grouped).map(([group, exs]) => (
              <section key={group}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge label={group} />
                  <span className="text-xs text-white/30 font-mono">{exs.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {exs.map((ex, i) => (
                    <div
                      key={ex.id}
                      className="bg-[#16213E] border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3"
                    >
                      <span className="text-white/30 font-mono text-xs w-5 shrink-0">{i + 1}</span>
                      {ex.emoji && <span className="text-lg" aria-hidden="true">{ex.emoji}</span>}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{ex.name}</p>
                        {ex.notes && (
                          <p className="text-xs text-white/30 mt-0.5 truncate">{ex.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-xs font-mono text-white/50">
                        <span className="text-white/70 font-bold">{ex.sets}</span>
                        <span>×</span>
                        <span className="text-white/70 font-bold">{ex.reps}</span>
                        {ex.weight && (
                          <>
                            <span className="text-white/20">|</span>
                            <span className="text-[#E8FF3A]/70">{ex.weight}kg</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Spacer for sticky button */}
        <div className="h-20" aria-hidden="true" />
      </div>

      {/* Sticky start button */}
      {exercises.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 p-4 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/95 to-transparent pointer-events-none">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-base shadow-lg shadow-[#E8FF3A]/10"
              onClick={() => navigate(`/workout/${id}/train`)}
            >
              <Play size={20} />
              Inizia Allenamento
            </Button>
          </div>
        </div>
      )}

      {/* Delete modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Elimina scheda"
        size="sm"
      >
        <div className="flex flex-col gap-5">
          <p className="text-sm text-white/70 leading-relaxed">
            Sei sicuro di voler eliminare <strong className="text-white">{name}</strong>?
            L'azione non è reversibile.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" size="md" className="flex-1" onClick={() => setShowDeleteModal(false)}>
              Annulla
            </Button>
            <Button variant="danger" size="md" className="flex-1" onClick={handleDelete}>
              Elimina
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
