
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';

interface UnderConstructionPageProps {
  title: string;
}

const UnderConstructionPage: React.FC<UnderConstructionPageProps> = ({ title }) => (
  <LayoutBase
    header={
      <div className="flex justify-between items-center px-4 py-3 bg-[#79D0B8]">
        <h1 className="text-white font-medium text-lg">{title}</h1>
      </div>
    }
    footer={<NavbarInferior activeTab="home" />}
  >
    <div className="flex flex-col items-center justify-center p-8 h-[70vh]">
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold text-[#4DA6A8] mb-4">En Construcción</h2>
        <p className="text-gray-600">
          Esta sección estará disponible próximamente.
        </p>
      </div>
    </div>
  </LayoutBase>
);

export default UnderConstructionPage;
