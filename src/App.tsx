import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { GetStartedPage } from './pages/GetStartedPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { LearnTopicPage } from './pages/LearnTopicPage';
import ProgressDashboardPage from './pages/ProgressDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          
          {/* Home */}
          <Route index element={<LandingPage />} />

          {/* Learner setup + diagnostic quiz */}
          <Route path="get-started" element={<GetStartedPage />} />

          {/* Personalised learning roadmap */}
          <Route path="roadmap" element={<RoadmapPage />} />

          {/* Individual learning topic */}
          <Route path="learn/:topicId" element={<LearnTopicPage />} />

          {/* Progress dashboard */}
          <Route path="progress" element={<ProgressDashboardPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;