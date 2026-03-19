import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useWorkouts } from '../context/WorkoutContext';
import WorkoutForm from '../components/workouts/WorkoutForm';
import Button from '../components/ui/Button';

export default function WorkoutCreate() {
  const navigate = useNavigate();
  const { addWorkout } = useWorkouts();

  const handleSubmit = (formData) => {
    const newWorkout = addWorkout(formData);
    navigate(`/workout/${newWorkout.id}`);
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
          Nuova Scheda
        </h1>
      </div>

      <WorkoutForm onSubmit={handleSubmit} isEdit={false} />
    </div>
  );
}
