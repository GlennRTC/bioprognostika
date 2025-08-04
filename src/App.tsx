import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './features/risk-calculator/components/LandingPage';
import Calculator from './features/risk-calculator/components/Calculator';
import Results from './features/risk-calculator/components/Results';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-healing-mint/20">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;