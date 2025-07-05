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
        
        <div className="inline-block bg-white/90 backdrop-blur-sm rounded-full mx-[0px] px-[9px] py-[4px] my-[41px]">
          <p className="text-gray-700 text-sm font-medium">
            ¿Qué necesita tu mascota hoy?
          </p>
        </div>
      </div>
    </div>;
};
export default ServiceCategoryGrid;