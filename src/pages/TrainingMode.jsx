import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, Clock, SkipForward, Plus, Check, X } from 'lucide-react';
import { useWorkouts } from '../context/WorkoutContext';
import { useTrainingSession } from '../hooks/useTrainingSession';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

// ---- Confetti component (pure CSS/emoji, no dependency) ----
function ConfettiParticle({ style }) {
  return <div className="absolute text-2xl animate-bounce select-none pointer-events-none" style={style} />;
}

const CONFETTI_EMOJIS = ['🎉', '💪', '🏆', '⚡', '🔥', '✨', '🎯', '🥇'];
function Confetti() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
    style: {
      left: `${(i * 5.3) % 100}%`,
      top: `${(i * 7.1) % 60}%`,
      animationDelay: `${(i * 0.15) % 1.5}s`,
      animationDuration: `${0.6 + (i % 4) * 0.3}s`,
      fontSize: `${1.2 + (i % 3) * 0.4}rem`,
    },
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <ConfettiParticle key={p.id} style={p.style} />
      ))}
    </div>
  );
}

// ---- Rest timer overlay ----
function RestTimer({ seconds, onSkip, onAdd }) {
  if (seconds === null) return null;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const maxRest = 60;
  const progress = Math.max(0, seconds / maxRest);
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#16213E] rounded-3xl p-8 flex flex-col items-center gap-6 border border-white/10 shadow-2xl w-72">
        <p className="text-sm font-medium text-white/50 uppercase tracking-wider">Riposo</p>

        {/* Circular timer */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 88 88" aria-hidden="true">
            <circle cx="44" cy="44" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
            <circle
              cx="44"
              cy="44"
              r={radius}
              fill="none"
              stroke="#E8FF3A"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <span className="font-mono text-3xl font-bold text-white" aria-live="polite" aria-label={`${seconds} secondi di riposo`}>
            {seconds}
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button variant="ghost" size="md" className="w-full" onClick={() => onAdd(30)}>
            <Plus size={14} /> +30 sec
          </Button>
          <Button variant="primary" size="md" className="w-full" onClick={onSkip}>
            <SkipForward size={14} /> Salta
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- Finished screen ----
function FinishedScreen({ workoutName, elapsed, completedSets, onDone }) {
  return (
    <div className="relative min-h-screen bg-[#1A1A2E] flex flex-col items-center justify-center text-center p-8 overflow-hidden">
      <Confetti />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="text-7xl">🏆</div>
        <div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-[#E8FF3A] mb-2">
            Allenamento Completato!
          </h1>
          <p className="text-white/60">{workoutName}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          <div className="bg-[#16213E] rounded-2xl p-4 border border-white/5">
            <p className="text-3xl font-bold font-mono text-[#E8FF3A]">{elapsed}</p>
            <p className="text-xs text-white/40 mt-1">Durata</p>
          </div>
          <div className="bg-[#16213E] rounded-2xl p-4 border border-white/5">
            <p className="text-3xl font-bold font-mono text-[#E8FF3A]">{completedSets}</p>
            <p className="text-xs text-white/40 mt-1">Serie completate</p>
          </div>
        </div>

        <Button variant="primary" size="lg" className="w-full max-w-xs" onClick={onDone}>
          <Check size={18} />
          Torna alle schede
        </Button>
      </div>
    </div>
  );
}

// ---- Main TrainingMode page ----
export default function TrainingMode() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getWorkoutById } = useWorkouts();
  const workout = getWorkoutById(id);

  const {
    session,
    currentExerciseIndex,
    progress,
    totalSets,
    completedSets,
    progressPercent,
    isFinished,
    elapsed,
    elapsedFormatted,
    restSeconds,
    completeSet,
    updateSetField,
    nextExercise,
    prevExercise,
    clearSession,
    skipRest,
    addRestTime,
  } = useTrainingSession(workout);

  if (!workout) {
    return (
      <EmptyState
        emoji="🔍"
        title="Scheda non trovata"
        action={() => navigate('/')}
        actionLabel="Torna alla home"
      />
    );
  }

  if (!session || session.workoutId !== workout.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white/40 text-sm">Caricamento sessione...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <FinishedScreen
        workoutName={workout.name}
        elapsed={elapsedFormatted}
        completedSets={completedSets}
        onDone={() => {
          clearSession();
          navigate('/');
        }}
      />
    );
  }

  const currentExProgress = progress[currentExerciseIndex];
  if (!currentExProgress) return null;

  const currentExercise = workout.exercises[currentExerciseIndex];
  const { sets } = currentExProgress;

  // Find the next uncompleted set for this exercise
  const nextSetIndex = sets.findIndex((s) => !s.completed);

  return (
    <>
      <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col">

        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-4 border-b border-white/5 bg-[#16213E] shrink-0">
          <button
            onClick={() => {
              if (confirm('Abbandonare l\'allenamento? Il progresso sarà salvato.')) {
                navigate(`/workout/${id}`);
              }
            }}
            aria-label="Esci dall'allenamento"
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/40 truncate">{workout.name}</p>
            <p className="text-sm font-bold font-['Space_Grotesk'] text-white truncate">
              {currentExercise?.name}
            </p>
          </div>

          {/* Stopwatch */}
          <div className="flex items-center gap-1.5 text-white/50 shrink-0">
            <Clock size={13} />
            <span className="font-mono text-sm">{elapsedFormatted}</span>
          </div>
        </header>

        {/* Progress bar */}
        <div className="h-1 bg-white/5 shrink-0" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`Progresso: ${progressPercent}%`}>
          <div
            className="h-full bg-[#E8FF3A] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">

          {/* Exercise header */}
          <div className="text-center">
            <div className="text-4xl mb-2" aria-hidden="true">{currentExercise?.emoji ?? '🏋️'}</div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
              {currentExercise?.name}
            </h2>
            {currentExercise?.muscleGroup && (
              <p className="text-sm text-white/40 mt-1">{currentExercise.muscleGroup}</p>
            )}
            <p className="text-xs text-white/30 mt-2 font-mono">
              Esercizio {currentExerciseIndex + 1} di {progress.length}
            </p>
          </div>

          {/* Sets list */}
          <div className="flex flex-col gap-3">
            {sets.map((set, i) => {
              const isCurrent = i === nextSetIndex;
              const isCompleted = set.completed;
              const isFuture = !isCompleted && !isCurrent;

              return (
                <div
                  key={i}
                  className={[
                    'rounded-2xl border p-4 transition-all duration-200',
                    isCompleted
                      ? 'bg-green-500/10 border-green-500/30'
                      : isCurrent
                      ? 'bg-[#16213E] border-[#E8FF3A]/50 shadow-[0_0_20px_rgba(232,255,58,0.08)]'
                      : 'bg-[#16213E]/40 border-white/5 opacity-50',
                  ].join(' ')}
                  aria-label={`Serie ${i + 1}${isCompleted ? ' completata' : isCurrent ? ' corrente' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Set number / status */}
                    <div
                      className={[
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono font-bold shrink-0',
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-[#E8FF3A] text-[#1A1A2E]'
                          : 'bg-white/10 text-white/30',
                      ].join(' ')}
                      aria-hidden="true"
                    >
                      {isCompleted ? <Check size={14} /> : i + 1}
                    </div>

                    {/* Reps input */}
                    <div className="flex-1 flex flex-col gap-0.5">
                      <label className="text-xs text-white/40" htmlFor={`reps-${i}`}>Reps</label>
                      <input
                        id={`reps-${i}`}
                        type="text"
                        value={set.reps}
                        onChange={(e) => updateSetField(currentExProgress.exerciseId, i, 'reps', e.target.value)}
                        disabled={isCompleted || isFuture}
                        className={[
                          'bg-transparent border-b font-mono text-lg font-bold text-center w-full focus:outline-none transition-colors',
                          isCompleted
                            ? 'border-green-500/30 text-green-400'
                            : isCurrent
                            ? 'border-[#E8FF3A]/40 text-white focus:border-[#E8FF3A]'
                            : 'border-white/10 text-white/20',
                        ].join(' ')}
                        aria-label={`Ripetizioni serie ${i + 1}`}
                      />
                    </div>

                    {/* Weight input */}
                    <div className="flex-1 flex flex-col gap-0.5">
                      <label className="text-xs text-white/40" htmlFor={`weight-${i}`}>Peso (kg)</label>
                      <input
                        id={`weight-${i}`}
                        type="number"
                        min="0"
                        step="0.5"
                        value={set.weight}
                        onChange={(e) => updateSetField(currentExProgress.exerciseId, i, 'weight', e.target.value)}
                        disabled={isCompleted || isFuture}
                        placeholder="0"
                        className={[
                          'bg-transparent border-b font-mono text-lg font-bold text-center w-full focus:outline-none transition-colors',
                          isCompleted
                            ? 'border-green-500/30 text-green-400'
                            : isCurrent
                            ? 'border-[#E8FF3A]/40 text-white focus:border-[#E8FF3A]'
                            : 'border-white/10 text-white/20',
                        ].join(' ')}
                        aria-label={`Peso serie ${i + 1}`}
                      />
                    </div>

                    {/* Complete set button (only for current set) */}
                    {isCurrent && (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => completeSet(currentExProgress.exerciseId, i, set.reps, set.weight)}
                        className="shrink-0 px-4"
                        aria-label={`Completa serie ${i + 1}`}
                      >
                        <Check size={16} />
                      </Button>
                    )}

                    {isCompleted && (
                      <div className="shrink-0 w-10 h-10 flex items-center justify-center" aria-hidden="true">
                        <Check size={18} className="text-green-400" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats row */}
          <div className="flex justify-center gap-6 text-center text-sm text-white/40">
            <span><strong className="text-white font-mono">{completedSets}</strong> / {totalSets} serie</span>
            <span><strong className="text-[#E8FF3A] font-mono">{progressPercent}%</strong></span>
          </div>
        </div>

        {/* Bottom navigation */}
        <footer className="bg-[#16213E] border-t border-white/5 px-4 py-4 shrink-0 flex items-center gap-3"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
        >
          <Button
            variant="ghost"
            size="md"
            onClick={prevExercise}
            disabled={currentExerciseIndex === 0}
            aria-label="Esercizio precedente"
            className="px-3"
          >
            <ChevronLeft size={20} />
          </Button>

          <div className="flex-1 text-center text-xs text-white/30">
            {currentExerciseIndex + 1} / {progress.length}
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={nextExercise}
            disabled={currentExerciseIndex === progress.length - 1}
            aria-label="Esercizio successivo"
            className="px-3"
          >
            Avanti
            <ArrowRight size={16} />
          </Button>
        </footer>
      </div>

      {/* Rest timer overlay */}
      <RestTimer seconds={restSeconds} onSkip={skipRest} onAdd={addRestTime} />
    </>
  );
}
