import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DoctorPage from './pages/DoctorPage';
import PatientPage from './pages/PatientPage';
import RuralPage from './pages/RuralPage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorPage />} />
          <Route path="/patients" element={<PatientPage />} />
          <Route path="/rural" element={<RuralPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;