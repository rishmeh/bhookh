import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css';
import App from './App.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Find from './Find.jsx';
import Donate from './Donate.jsx';
import About from './About.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/find" element={<Find />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  </StrictMode>
);
