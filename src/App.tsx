
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthNavigator from './navigation/AuthNavigator';
import OwnerNavigator from './navigation/OwnerNavigator';
import VetNavigator from './navigation/VetNavigator';
import { ROUTES } from './frontend/shared/constants/routes';
import { Toaster } from '@/ui/molecules/toaster';
import { ReduxProvider } from './state/ReduxProvider';

const App: React.FC = () => {
  return (
    <ReduxProvider>
      <Router>
        <Routes>
          <Route path="/auth/*" element={<AuthNavigator />} />
          <Route path="/owner/*" element={<OwnerNavigator />} />
          <Route path="/vet/*" element={<VetNavigator />} />
          
          {/* Redirect to /owner if no specific route is matched */}
          <Route path="*" element={<OwnerNavigator />} />
        </Routes>
        <Toaster />
      </Router>
    </ReduxProvider>
  );
};

export default App;
