import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useWorkouts } from '../context/WorkoutContext';
import WorkoutForm from '../components/workouts/WorkoutForm';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

export default function WorkoutEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getWorkoutById, updateWorkout } = useWorkouts();

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

  const handleSubmit = (formData) => {
    updateWorkout(id, formData);
    navigate(`/workout/${id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
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
        <h1 className="text-xl font-bold font-['Space_Grotesk'] text-white">
          Modifica Scheda
        </h1>
      </div>

      <WorkoutForm initialData={workout} onSubmit={handleSubmit} isEdit={true} />
    </div>
  );
}
