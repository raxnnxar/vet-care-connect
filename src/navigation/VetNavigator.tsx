
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { VET_ROUTES } from './navigationConfig';

// This is a skeleton file until VetNavigator is properly implemented
const VetNavigator: React.FC = () => {
  return (
    <Routes>
      <Route path={VET_ROUTES.DASHBOARD} element={<div>Vet Dashboard - Coming Soon</div>} />
      <Route path={VET_ROUTES.APPOINTMENTS} element={<div>Vet Appointments - Coming Soon</div>} />
      <Route path={VET_ROUTES.PROFILE} element={<div>Vet Profile - Coming Soon</div>} />
      <Route path={VET_ROUTES.SETTINGS} element={<div>Vet Settings - Coming Soon</div>} />
      <Route path={VET_ROUTES.PATIENTS} element={<div>Vet Patients - Coming Soon</div>} />
      <Route path={VET_ROUTES.SCHEDULE} element={<div>Vet Schedule - Coming Soon</div>} />
      <Route path="*" element={<div>Under Construction</div>} />
    </Routes>
  );
};

export default VetNavigator;
