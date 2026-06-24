import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import InputPage from './pages/InputPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import StartupDetailPage from './pages/StartupDetailPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/input" element={<InputPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/startups/:planId" element={<StartupDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
