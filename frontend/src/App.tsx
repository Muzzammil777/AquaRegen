import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RainfallPage } from './pages/RainfallPage';
import { HarvestingPage } from './pages/HarvestingPage';
import { GroundwaterPage } from './pages/GroundwaterPage';
import { MapPage } from './pages/MapPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Landing & Auth */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* Main Authenticated Dashboard Shell */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/rainfall" element={<RainfallPage />} />
                <Route path="/harvesting" element={<HarvestingPage />} />
                <Route path="/groundwater" element={<GroundwaterPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/simulator" element={<SimulatorPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/ai" element={<AIAssistantPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
