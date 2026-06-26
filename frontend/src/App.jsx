import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import IdeaAnalysisPage from './pages/IdeaAnalysisPage.jsx';
import InputPage from './pages/InputPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import SharedViewPage from './pages/SharedViewPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import StartupDetailPage from './pages/StartupDetailPage.jsx';
import ComparisonPage from './pages/ComparisonPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import AICofounderPage from './pages/AICofounderPage.jsx';
import InvestorToolsPage from './pages/InvestorToolsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/input" element={<InputPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/analyze-idea" element={<IdeaAnalysisPage />} />
      <Route path="/share/:token" element={<SharedViewPage />} />
      <Route path="/compare" element={<ComparisonPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/ai-cofounder" element={<AICofounderPage />} />
      <Route path="/investor-tools" element={<InvestorToolsPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/startups/:planId" element={<StartupDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
