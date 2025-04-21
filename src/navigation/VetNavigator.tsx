
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// This is a skeleton file until VetNavigator is properly implemented
const VetNavigator: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Vet Dashboard - Coming Soon</div>} />
      <Route path="*" element={<div>Under Construction</div>} />
    </Routes>
  );
};

export default VetNavigator;
