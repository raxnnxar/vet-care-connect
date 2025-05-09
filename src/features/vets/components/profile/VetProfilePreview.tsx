
import React, { useState } from 'react';
import { 
  User, Star, Calendar, MapPin, Award, Globe, Phone, 
  FileText, BookOpen, Certificate, PenSquare, Save, 
  Dog, Cat, Stethoscope, AlertCircle
} from 'lucide-react';
import { VeterinarianProfile, ServiceOffered, ANIMAL_TYPES, SPECIALIZATIONS } from '@/features/auth/types/veterinarianTypes';
import { Button } from '@/ui/atoms/button';
import { Card, CardContent } from '@/ui/molecules/card';
import { Badge } from '@/ui/atoms/badge';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Separator } from '@/ui/atoms/separator';

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

const translateSpecialization = (value: string): string => {
  const specialization = SPECIALIZATIONS.find(spec => spec.value === value);
  return specialization ? specialization.label : value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ');
};

const VetProfilePreview: React.FC<VetProfilePreviewProps> = ({ profileData, userId, isLoading, onSaveSection }) => {
  const [displayName, setDisplayName] = useState<string>('');
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({
    basicInfo: false,
    services: false,
    animals: false,
    education: false,
    certifications: false
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

        {/* Licencia y especialidades en el hero */}
        <div className="w-full mt-6 flex flex-col items-center">
          {profileData.license_number && (
            <div className="text-white/90 text-sm">
              Licencia: <span className="font-medium">{profileData.license_number}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Content section - nueva versión de scroll único */}
      <div className="p-4 space-y-6">
        {/* Especialidades */}
        <div className="flex flex-wrap justify-center gap-2 py-2">
          {profileData.specializations && profileData.specializations.length > 0 ? (
            profileData.specializations.map((spec) => (
              <Badge key={spec} className="bg-[#4DA6A8] hover:bg-[#3a8a8c] text-white px-3 py-1 text-sm">
                {translateSpecialization(spec)}
              </Badge>
            ))
          ) : (
            <Badge variant="outline">Sin especialidades</Badge>
          )}
        </div>

        {/* Información personal */}
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
              
              {profileData.languages_spoken && profileData.languages_spoken.length > 0 && (
                <div className="mt-4">
                  <h3 className="flex items-center text-lg font-medium mb-2">
                    <Globe className="w-5 h-5 mr-2 text-[#4DA6A8]" /> 
                    Idiomas:
                  </h3>
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
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
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

        <Separator className="my-6 bg-gray-200" />

        {/* Animales que atiende */}
        <EditableSection 
          title="Animales que atiende"
          isEditing={editingSections.animals}
          onEdit={() => toggleEditSection('animals')}
          onSave={handleSaveAnimals}
          isSaving={isLoading}
        >
          {!editingSections.animals ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {profileData.animals_treated && profileData.animals_treated.length > 0 ? (
                ANIMAL_TYPES.filter(animal => 
                  profileData.animals_treated?.includes(animal.value)
                ).map((animal) => (
                  <div key={animal.value} className="flex flex-col items-center p-4 bg-[#e8f7f3] rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2">
                      {animal.value === 'dog' ? (
                        <Dog className="w-8 h-8 text-[#4DA6A8]" />
                      ) : animal.value === 'cat' ? (
                        <Cat className="w-8 h-8 text-[#4DA6A8]" />
                      ) : (
                        <span className="w-8 h-8 flex items-center justify-center text-[#4DA6A8] text-xl">•</span>
                      )}
                    </div>
                    <span className="font-medium text-center">{animal.label}</span>
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
                  className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-colors ${
                    editedAnimals.includes(animal.value) 
                      ? 'bg-[#4DA6A8] text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => toggleAnimal(animal.value)}
                >
                  <div className={`w-10 h-10 rounded-full ${editedAnimals.includes(animal.value) ? 'bg-white/20' : 'bg-white'} flex items-center justify-center mb-2`}>
                    {animal.value === 'dog' ? (
                      <Dog className="w-6 h-6" />
                    ) : animal.value === 'cat' ? (
                      <Cat className="w-6 h-6" />
                    ) : (
                      <span className="w-6 h-6 flex items-center justify-center text-xl">•</span>
                    )}
                  </div>
                  <span className="font-medium text-center">{animal.label}</span>
                </div>
              ))}
            </div>
          )}
        </EditableSection>
        
        <Separator className="my-6 bg-gray-200" />

        {/* Servicios */}
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
                <div className="space-y-3">
                  {profileData.services_offered.map((service) => (
                    <Card key={service.id} className="overflow-hidden">
                      <div className="flex items-center p-4">
                        <div className="bg-[#e8f7f3] p-3 rounded-full mr-4">
                          <Stethoscope className="w-6 h-6 text-[#4DA6A8]" />
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-medium text-lg">{service.name}</h3>
                          {service.description && (
                            <p className="text-gray-600">{service.description}</p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          {service.price !== undefined && (
                            <div className="font-medium text-green-700 text-xl">
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
                          className="flex-1 mr-2"
                        />
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-1">$</span>
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
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Agregar nuevo servicio</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Input 
                        value={newService.name}
                        onChange={(e) => setNewService({...newService, name: e.target.value})}
                        placeholder="Nombre del servicio"
                        className="flex-1 mr-2"
                      />
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-1">$</span>
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
                      className="w-full"
                    >
                      + Agregar Servicio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </EditableSection>
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
            variant="default" 
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
