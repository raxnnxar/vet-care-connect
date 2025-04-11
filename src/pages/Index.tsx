
import React from 'react';
import { LayoutBase, NavbarInferior, HeaderConBusqueda } from '../frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';

const Index = () => {
  return (
    <LayoutBase>
      <HeaderConBusqueda />
      <div className="container mx-auto p-4">
        <Card className="mb-5 p-5">
          <h1 className="text-2xl font-bold mb-4">Bienvenido a Vett</h1>
          <p className="mb-4">La aplicación compañera para la salud de tu mascota.</p>
          <Button>Empezar</Button>
        </Card>
      </div>
      <NavbarInferior />
    </LayoutBase>
  );
};

export default Index;
