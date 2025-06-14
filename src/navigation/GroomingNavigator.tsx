
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import grooming screens
import GroomingDashboard from '@/features/grooming/screens/GroomingDashboard';
import GroomingProfileScreen from '@/features/grooming/screens/GroomingProfileScreen';
import GroomingWeeklyAgendaScreen from '@/features/grooming/screens/GroomingWeeklyAgendaScreen';

// Import owner screens for grooming detail access
import GroomingDetailScreen from '@/features/grooming/screens/GroomingDetailScreen';
import GroomingReviewScreen from '@/features/grooming/screens/GroomingReviewScreen';

// Import shared screens
import NotificationsScreen from '@/features/notifications/screens/NotificationsScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';

const GroomingNavigator = () => {
  return (
    <Routes>
      {/* Main grooming dashboard */}
      <Route path="/" element={<GroomingDashboard />} />
      <Route path="/grooming" element={<GroomingDashboard />} />
      <Route path="/grooming/dashboard" element={<GroomingDashboard />} />
      
      {/* Grooming profile management */}
      <Route path="/grooming/profile" element={<GroomingProfileScreen />} />
      
      {/* Grooming schedule */}
      <Route path="/grooming/schedule" element={<GroomingWeeklyAgendaScreen />} />
      
      {/* Grooming detail and reviews (for testing purposes) */}
      <Route path="/owner/grooming/:id" element={<GroomingDetailScreen />} />
      <Route path="/owner/grooming/:id/review" element={<GroomingReviewScreen />} />
      
      {/* Shared screens */}
      <Route path="/notifications" element={<NotificationsScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
    </Routes>
  );
};

export default GroomingNavigator;
