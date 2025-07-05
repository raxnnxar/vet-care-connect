import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
const ServiceCategoryGrid = () => {
  const {
    user
  } = useSelector((state: any) => state.auth);
  const [displayName, setDisplayName] = useState('');
  useEffect(() => {
    const fetchDisplayName = async () => {
      if (user?.id) {
        try {
          const {
            data,
            error
          } = await supabase.from('profiles').select('display_name').eq('id', user.id).single();
          if (data && !error) {
            setDisplayName(data.display_name);
          }
        } catch (err) {
          console.error('Error fetching display name:', err);
        }
      }
    };
    fetchDisplayName();
  }, [user?.id]);
  return <div className="absolute inset-0 flex flex-col justify-center items-start px-4">
      {/* Greeting Section */}
      <div className="mb-6">
        <h2 className="text-2xl mb-2 drop-shadow-sm font-bold text-white">
          ¡Hola{displayName ? `, ${displayName}` : ''}!
        </h2>
        <div className="inline-block bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
          <p className="text-gray-700 text-sm font-medium">
            ¿Qué necesita tu mascota hoy?
          </p>
        </div>
      </div>
    </div>;
};
export default ServiceCategoryGrid;