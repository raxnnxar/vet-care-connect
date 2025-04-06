
import React from 'react';
import { LayoutBase, NavbarInferior, HeaderConBusqueda } from '../../frontend/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <LayoutBase
      header={<HeaderConBusqueda title="Welcome to Vett" />}
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="px-4 py-6">
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Vett App Prototype</h2>
          <p className="text-blue-700 mb-4">
            This is the foundation for the Vett application. The UI components will be added
            incrementally based on design files.
          </p>
          <Button variant="default">Explore Features</Button>
        </Card>

        <h2 className="text-xl font-semibold mb-4">Project Structure</h2>
        <p className="text-gray-700 mb-6">
          The app is structured with separation of concerns following modern best practices.
          Navigate the codebase to see the feature-based organization and mock data setup.
        </p>

        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
          <h3 className="font-medium mb-2">Frontend Organization</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>auth - Authentication related components and hooks</li>
            <li>pets - Pet management features</li>
            <li>vets - Veterinarian listing and details</li>
            <li>appointments - Booking and management</li>
            <li>ui - Shared UI components</li>
            <li>navigation - App navigation structure</li>
          </ul>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium mb-2">Backend Mock Data</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>users.json - User accounts (pet owners and vets)</li>
            <li>pets.json - Pet profiles and information</li>
            <li>vets.json - Veterinarian profiles</li>
            <li>appointments.json - Scheduled appointments</li>
            <li>available-slots.json - Available booking slots</li>
          </ul>
        </div>
      </div>
    </LayoutBase>
  );
};

export default Index;
