
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';
import { Badge } from '@/ui/atoms/badge';
import { ArrowLeft, Calendar, Syringe, Building, FileText, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/frontend/shared/utils/date';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { VaccinationRecord } from '../types/vaccinationTypes';
import VaccinationForm from '../components/medical/VaccinationForm';

const VaccinationDetailScreen: React.FC = () => {
  const { id: petId, vaccinationId: vaccineId } = useParams<{ id: string; vaccinationId: string }>();
  const navigate = useNavigate();
  const [vaccinationDetail, setVaccinationDetail] = useState<VaccinationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchVaccinationDetail = async () => {
      if (!petId || !vaccineId) {
        setError('Parámetros de navegación faltantes');
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching vaccination detail for:', { petId, vaccineId });
      
      try {
        const { data, error } = await supabase
          .from('vaccination_records')
          .select('*')
          .eq('id', vaccineId)
          .eq('pet_id', petId)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Vaccination detail data:', data);
        setVaccinationDetail(data);
      } catch (error) {
        console.error('Error fetching vaccination detail:', error);
        setError('No se pudo cargar el detalle de la vacuna');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaccinationDetail();
  }, [petId, vaccineId]);

  const handleBack = () => {
    navigate(`/owner/pets/${petId}/medical-records`);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    // Refetch the data
    window.location.reload();
  };

  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Detalle de vacuna</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      </LayoutBase>
    );
  }

  if (error || !vaccinationDetail) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Detalle de vacuna</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Syringe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontró el registro
              </h3>
              <p className="text-gray-500 mb-4">
                {error || 'El registro de vacunación solicitado no existe o no tienes permisos para verlo.'}
              </p>
              <Button onClick={handleBack}>Volver al expediente</Button>
            </CardContent>
          </Card>
        </div>
      </LayoutBase>
    );
  }

  if (showEditForm) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setShowEditForm(false)}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Editar vacuna</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="p-4 pb-20">
          <VaccinationForm
            petId={petId!}
            existingRecord={vaccinationDetail}
            onClose={() => setShowEditForm(false)}
            onVaccinationAdded={handleEditSuccess}
          />
        </div>
      </LayoutBase>
    );
  }

  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">Detalle de vacuna</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="p-4 pb-20 space-y-4">
        {/* Vacuna principal */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">
                {vaccinationDetail.vaccine_name}
              </CardTitle>
              <div className="flex flex-col gap-2">
                <Badge variant="outline">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(vaccinationDetail.application_date)}
                </Badge>
                {vaccinationDetail.needs_booster ? (
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    Requiere refuerzo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    Completada
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Próximo refuerzo */}
        {vaccinationDetail.next_due_date && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-blue-600">
                <Calendar className="h-5 w-5 mr-2" />
                Próximo refuerzo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700">{formatDate(vaccinationDetail.next_due_date)}</p>
            </CardContent>
          </Card>
        )}

        {/* Lote */}
        {vaccinationDetail.lot_number && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Lote
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700">{vaccinationDetail.lot_number}</p>
              {vaccinationDetail.lot_expiry_date && (
                <p className="text-sm text-gray-500 mt-1">
                  Vence: {formatDate(vaccinationDetail.lot_expiry_date)}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Fabricante */}
        {vaccinationDetail.manufacturer && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Fabricante
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700">{vaccinationDetail.manufacturer}</p>
            </CardContent>
          </Card>
        )}

        {/* Sitio anatómico y vía */}
        {(vaccinationDetail.anatomical_site || vaccinationDetail.route) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Aplicación
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {vaccinationDetail.anatomical_site && (
                <p className="text-gray-700">
                  <span className="font-medium">Sitio:</span> {vaccinationDetail.anatomical_site}
                </p>
              )}
              {vaccinationDetail.route && (
                <p className="text-gray-700">
                  <span className="font-medium">Vía:</span> {vaccinationDetail.route}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notas */}
        {vaccinationDetail.notes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Notas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700 whitespace-pre-wrap">{vaccinationDetail.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Botón de editar */}
        <Card>
          <CardContent className="p-4">
            <Button
              onClick={() => setShowEditForm(true)}
              className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3]"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar / Añadir datos
            </Button>
          </CardContent>
        </Card>
      </div>
    </LayoutBase>
  );
};

export default VaccinationDetailScreen;
