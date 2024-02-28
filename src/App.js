import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Authentication/Login'; // Import your Login component
import Registration from './Authentication/Register'; // Import your Registration component (not included in provided prompt)
import Home from './pages/Home'; // Add a Home page (optional)


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} index />
        <Route path="/register" element={<Registration />} />
        <Route path="/" element={<Home />} /> {/* Replace Home component with your protected route if needed */}
      </Routes>
    </Router>
  );
};

export default App;
