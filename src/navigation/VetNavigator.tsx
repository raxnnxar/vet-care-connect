
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { vetRoutes } from './routes/vetRoutes';
import UnderConstructionPage from './components/UnderConstructionPage';

const VetNavigator: React.FC = () => {
  return (
    <Routes>
      {vetRoutes.map((route) => {
        // Special handling for routes that use the UnderConstructionPage
        if (route.element === UnderConstructionPage && route.title) {
          return (
            <Route 
              key={route.path} 
              path={route.path} 
              element={<UnderConstructionPage title={route.title} />} 
            />
          );
        }
        
        // Regular routes
        return (
          <Route key={route.path} path={route.path} element={<route.element />} />
        );
      })}
    </Routes>
  );
};

export default VetNavigator;
