import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import WorkoutCreate from './pages/WorkoutCreate';
import WorkoutEdit from './pages/WorkoutEdit';
import WorkoutDetail from './pages/WorkoutDetail';
import TrainingMode from './pages/TrainingMode';
import CatalogPage from './pages/CatalogPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workout/new" element={<WorkoutCreate />} />
          <Route path="/workout/:id" element={<WorkoutDetail />} />
          <Route path="/workout/:id/edit" element={<WorkoutEdit />} />
          <Route path="/workout/:id/train" element={<TrainingMode />} />
          <Route path="/catalog" element={<CatalogPage />} />
          {/* Fallback */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
