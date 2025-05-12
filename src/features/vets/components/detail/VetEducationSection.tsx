
import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';

interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  year: number;
  document_url?: string;
}

interface VetEducationSectionProps {
  education: EducationEntry[];
}

const VetEducationSection: React.FC<VetEducationSectionProps> = ({ education }) => {
  // Sort education entries by year (most recent first)
  const sortedEducation = [...education].sort((a, b) => 
    (b.year || 0) - (a.year || 0)
  );

  if (education.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <GraduationCap className="mr-2 h-5 w-5 text-[#4DA6A8]" />
          Formación Académica
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {sortedEducation.map((edu) => (
          <div key={edu.id} className="py-3 border-b last:border-0">
            <div className="flex flex-col">
              <span className="font-medium">{edu.degree}</span>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{edu.institution}</span>
                <span className="text-gray-500">{edu.year}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VetEducationSection;
