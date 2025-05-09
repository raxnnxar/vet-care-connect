
import React, { useState } from 'react';
import { User, Star, Calendar, Clock, DollarSign, PenSquare, Save, Dog, Cat, Stethoscope } from 'lucide-react';
import { VeterinarianProfile, ServiceOffered, ANIMAL_TYPES } from '@/features/auth/types/veterinarianTypes';
import { Button } from '@/ui/atoms/button';
import { Card, CardContent } from '@/ui/molecules/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/molecules/tabs';
import { Badge } from '@/ui/atoms/badge';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface VetProfilePreviewProps {
  profileData: VeterinarianProfile;
  userId: string;
  isLoading: boolean;
  onSaveSection: (sectionData: Partial<VeterinarianProfile>, sectionName: string) => Promise<void>;
}

interface EditableSectionProps {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  isSaving: boolean;
  children: React.ReactNode;
}

const VetProfilePreview: React.FC<VetProfilePreviewProps> = ({ profileData, userId, isLoading, onSaveSection }) => {
  const [displayName, setDisplayName] = useState<string>('');
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({
    basicInfo: false,
    services: false,
    animals: false
  });
  
  // Local state for editing sections
  const [editedBio, setEditedBio] = useState(profileData.bio || '');
  const [editedServices, setEditedServices] = useState<ServiceOffered[]>(
    profileData.services_offered || []
  );
  const [editedAnimals, setEditedAnimals] = useState<string[]>(
    profileData.animals_treated || []
  );
  const [newService, setNewService] = useState<ServiceOffered>({
    id: '',
    name: '',
    description: '',
    price: undefined
  });
  
  // Get veterinarian's display name
  React.useEffect(() => {
    const fetchProfileName = async () => {
      if (!userId) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile name:', error);
      } else if (data?.display_name) {
        setDisplayName(data.display_name);
      }
    };
    
    fetchProfileName();
  }, [userId]);
  
  const toggleEditSection = (section: string) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Reset local state to current profile data when starting to edit
    if (!editingSections[section]) {
      if (section === 'basicInfo') {
        setEditedBio(profileData.bio || '');
      } else if (section === 'services') {
        setEditedServices([...(profileData.services_offered || [])]);
      } else if (section === 'animals') {
        setEditedAnimals([...(profileData.animals_treated || [])]);
      }
    }
  };
  
  const handleSaveBasicInfo = async () => {
    await onSaveSection({ bio: editedBio }, 'información básica');
    toggleEditSection('basicInfo');
  };
  
  const handleSaveServices = async () => {
    await onSaveSection({ services_offered: editedServices }, 'servicios');
    toggleEditSection('services');
  };
  
  const handleSaveAnimals = async () => {
    await onSaveSection({ animals_treated: editedAnimals }, 'animales atendidos');
    toggleEditSection('animals');
  };
  
  const addService = () => {
    if (!newService.name) return;
    
    const serviceToAdd = {
      ...newService,
      id: uuidv4()
    };
    
    setEditedServices([...editedServices, serviceToAdd]);
    setNewService({
      id: '',
      name: '',
      description: '',
      price: undefined
    });
  };
  
  const removeService = (serviceId: string) => {
    setEditedServices(editedServices.filter(service => service.id !== serviceId));
  };
  
  const toggleAnimal = (animalType: string) => {
    if (editedAnimals.includes(animalType)) {
      setEditedAnimals(editedAnimals.filter(animal => animal !== animalType));
    } else {
      setEditedAnimals([...editedAnimals, animalType]);
    }
  };
  
  // Format rating to display with one decimal place
  const formattedRating = profileData?.average_rating 
    ? Number(profileData.average_rating).toFixed(1)
    : '0.0';
  
  return (
    <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg shadow overflow-hidden">
      {/* Hero section with profile image */}
      <div className="bg-[#79D0B8] p-6 flex flex-col items-center text-white">
        <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden mb-4 border-4 border-white">
          {profileData.profile_image_url ? (
            <img 
              src={profileData.profile_image_url} 
              alt={displayName}
              className="w-full h-full object-cover" 
            />
          ) : (
            <User className="w-16 h-16 text-white" />
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-center">{displayName}</h1>
        <p className="text-xl mb-2">Veterinario</p>
        
        {/* Rating and reviews section */}
        <div className="flex items-center bg-[#4DA6A8] rounded-full px-6 py-2 mt-2">
          <span className="text-xl font-bold mr-2">{formattedRating}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`w-5 h-5 ${Number(formattedRating) >= star ? 'fill-white text-white' : 'text-white/50'}`} 
              />
            ))}
          </div>
          <span className="ml-3">
            ({profileData.total_reviews || 0} reseñas)
          </span>
        </div>
      </div>
      
      {/* Content section */}
      <div className="p-4">
        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="servicios">Servicios</TabsTrigger>
            <TabsTrigger value="mascotas">Mascotas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="perfil">
            <EditableSection 
              title="Información Personal"
              isEditing={editingSections.basicInfo}
              onEdit={() => toggleEditSection('basicInfo')}
              onSave={handleSaveBasicInfo}
              isSaving={isLoading}
            >
              {!editingSections.basicInfo ? (
                <div className="prose">
                  <div className="flex items-center gap-2 mb-4 text-gray-700">
                    <Calendar className="w-5 h-5 text-[#4DA6A8]" />
                    <span>{profileData.years_of_experience || 0} años de experiencia</span>
                  </div>
                  
                  <p className="text-gray-700 whitespace-pre-wrap">{profileData.bio || 'Sin biografía'}</p>
                  
                  {profileData.specializations && profileData.specializations.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Especialidades:</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.specializations.map((spec) => (
                          <Badge key={spec} className="bg-[#4DA6A8] hover:bg-[#3a8a8c]">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profileData.languages_spoken && profileData.languages_spoken.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Idiomas:</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.languages_spoken.map((language) => (
                          <Badge key={language} variant="outline">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profileData.emergency_services && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-center">
                      <span className="text-red-600 font-medium">
                        Ofrece servicios de emergencia
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biografía
                    </label>
                    <Textarea 
                      value={editedBio} 
                      onChange={(e) => setEditedBio(e.target.value)}
                      placeholder="Cuéntanos sobre ti y tu experiencia como veterinario..."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              )}
            </EditableSection>
          </TabsContent>
          
          <TabsContent value="servicios">
            <EditableSection 
              title="Servicios Ofrecidos"
              isEditing={editingSections.services}
              onEdit={() => toggleEditSection('services')}
              onSave={handleSaveServices}
              isSaving={isLoading}
            >
              {!editingSections.services ? (
                <div>
                  {profileData.services_offered && profileData.services_offered.length > 0 ? (
                    <div className="space-y-2">
                      {profileData.services_offered.map((service) => (
                        <Card key={service.id} className="overflow-hidden">
                          <div className="flex items-center p-4">
                            <div className="bg-[#e8f7f3] p-2 rounded-full mr-4">
                              <Stethoscope className="w-6 h-6 text-[#4DA6A8]" />
                            </div>
                            
                            <div className="flex-grow">
                              <h3 className="font-medium">{service.name}</h3>
                              {service.description && (
                                <p className="text-sm text-gray-600">{service.description}</p>
                              )}
                            </div>
                            
                            <div className="text-right">
                              {service.price !== undefined && (
                                <div className="font-medium text-green-700">
                                  ${service.price.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center py-6">
                      No hay servicios registrados
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {editedServices.map((service, index) => (
                    <Card key={service.id || index} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Input 
                              value={service.name}
                              onChange={(e) => {
                                const updatedServices = [...editedServices];
                                updatedServices[index].name = e.target.value;
                                setEditedServices(updatedServices);
                              }}
                              placeholder="Nombre del servicio"
                            />
                            <div className="flex items-center ml-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <Input 
                                type="number"
                                value={service.price || ''}
                                onChange={(e) => {
                                  const updatedServices = [...editedServices];
                                  updatedServices[index].price = e.target.value ? parseFloat(e.target.value) : undefined;
                                  setEditedServices(updatedServices);
                                }}
                                placeholder="Precio"
                                className="w-24"
                              />
                            </div>
                          </div>
                          
                          <Textarea
                            value={service.description || ''}
                            onChange={(e) => {
                              const updatedServices = [...editedServices];
                              updatedServices[index].description = e.target.value;
                              setEditedServices(updatedServices);
                            }}
                            placeholder="Descripción del servicio (opcional)"
                            className="h-20"
                          />
                          
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeService(service.id)}
                          >
                            Eliminar servicio
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Add new service form */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Agregar nuevo servicio</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Input 
                            value={newService.name}
                            onChange={(e) => setNewService({...newService, name: e.target.value})}
                            placeholder="Nombre del servicio"
                          />
                          <div className="flex items-center ml-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <Input 
                              type="number"
                              value={newService.price || ''}
                              onChange={(e) => setNewService({
                                ...newService, 
                                price: e.target.value ? parseFloat(e.target.value) : undefined
                              })}
                              placeholder="Precio"
                              className="w-24"
                            />
                          </div>
                        </div>
                        
                        <Textarea
                          value={newService.description || ''}
                          onChange={(e) => setNewService({...newService, description: e.target.value})}
                          placeholder="Descripción del servicio (opcional)"
                          className="h-20"
                        />
                        
                        <Button 
                          variant="outline" 
                          onClick={addService}
                          disabled={!newService.name}
                        >
                          Agregar Servicio
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </EditableSection>
          </TabsContent>
          
          <TabsContent value="mascotas">
            <EditableSection 
              title="Animales que atiende"
              isEditing={editingSections.animals}
              onEdit={() => toggleEditSection('animals')}
              onSave={handleSaveAnimals}
              isSaving={isLoading}
            >
              {!editingSections.animals ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {profileData.animals_treated && profileData.animals_treated.length > 0 ? (
                    ANIMAL_TYPES.filter(animal => 
                      profileData.animals_treated?.includes(animal.value)
                    ).map((animal) => (
                      <div key={animal.value} className="flex items-center p-3 bg-[#e8f7f3] rounded-md">
                        {animal.value === 'dog' ? (
                          <Dog className="w-5 h-5 mr-2 text-[#4DA6A8]" />
                        ) : animal.value === 'cat' ? (
                          <Cat className="w-5 h-5 mr-2 text-[#4DA6A8]" />
                        ) : (
                          <span className="w-5 h-5 mr-2 flex items-center justify-center text-[#4DA6A8]">•</span>
                        )}
                        <span>{animal.label}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-center py-6 col-span-full">
                      No hay tipos de animales registrados
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {ANIMAL_TYPES.map((animal) => (
                    <div 
                      key={animal.value}
                      className={`flex items-center p-3 rounded-md cursor-pointer ${
                        editedAnimals.includes(animal.value) 
                          ? 'bg-[#4DA6A8] text-white' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => toggleAnimal(animal.value)}
                    >
                      {animal.value === 'dog' ? (
                        <Dog className="w-5 h-5 mr-2" />
                      ) : animal.value === 'cat' ? (
                        <Cat className="w-5 h-5 mr-2" />
                      ) : (
                        <span className="w-5 h-5 mr-2 flex items-center justify-center">•</span>
                      )}
                      <span>{animal.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </EditableSection>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Bottom action buttons */}
      <div className="bg-white border-t border-gray-200 p-4 flex justify-center">
        <Button className="bg-[#79D0B8] hover:bg-[#4DA6A8]">
          <Calendar className="mr-2 h-4 w-4" />
          Agendar cita
        </Button>
      </div>
    </div>
  );
};

// Helper component for editable sections
const EditableSection: React.FC<EditableSectionProps> = ({ 
  title, 
  isEditing, 
  onEdit, 
  onSave, 
  isSaving,
  children 
}) => {
  return (
    <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <PenSquare className="h-4 w-4 mr-1" />
            Editar
          </Button>
        ) : (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={onSave}
            disabled={isSaving}
            className="bg-[#79D0B8] hover:bg-[#4DA6A8] text-white"
          >
            {isSaving ? (
              <span className="flex items-center">
                <div className="animate-spin mr-1 h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full"></div>
                Guardando...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Guardar
              </>
            )}
          </Button>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default VetProfilePreview;
