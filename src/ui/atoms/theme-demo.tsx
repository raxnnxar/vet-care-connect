
import React from 'react';
import { theme } from '@/theme/theme';

export const ThemeDemo = () => {
  return (
    <div className="p-8 bg-background">
      <h2 className="text-2xl font-semibold mb-6">Vett Theme Demo</h2>
      
      <section className="mb-8">
        <h3 className="text-xl font-medium mb-4">Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Primary Colors */}
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-md shadow flex items-end p-2">
              <span className="text-xs text-white font-mono">primary</span>
            </div>
            <p className="text-sm font-medium">Primary (Teal)</p>
            <p className="text-xs text-gray-500 font-mono">#7ECEC4</p>
          </div>

          {/* Primary Shades */}
          <div className="space-y-2">
            <div className="grid grid-rows-5 h-20 rounded-md overflow-hidden shadow">
              <div className="bg-primary-300 flex items-center justify-center">
                <span className="text-xs text-white font-mono">300</span>
              </div>
              <div className="bg-primary-400 flex items-center justify-center">
                <span className="text-xs text-white font-mono">400</span>
              </div>
              <div className="bg-primary-500 flex items-center justify-center">
                <span className="text-xs text-white font-mono">500</span>
              </div>
              <div className="bg-primary-600 flex items-center justify-center">
                <span className="text-xs text-white font-mono">600</span>
              </div>
              <div className="bg-primary-700 flex items-center justify-center">
                <span className="text-xs text-white font-mono">700</span>
              </div>
            </div>
            <p className="text-sm font-medium">Primary Shades</p>
          </div>
          
          {/* Secondary Color */}
          <div className="space-y-2">
            <div className="h-20 bg-secondary border border-gray-200 rounded-md shadow flex items-end p-2">
              <span className="text-xs text-gray-800 font-mono">secondary</span>
            </div>
            <p className="text-sm font-medium">Secondary (White)</p>
            <p className="text-xs text-gray-500 font-mono">#FFFFFF</p>
          </div>
          
          {/* Gray */}
          <div className="space-y-2">
            <div className="grid grid-rows-5 h-20 rounded-md overflow-hidden shadow">
              <div className="bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-800 font-mono">100</span>
              </div>
              <div className="bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-800 font-mono">200</span>
              </div>
              <div className="bg-gray-400 flex items-center justify-center">
                <span className="text-xs text-white font-mono">400</span>
              </div>
              <div className="bg-gray-600 flex items-center justify-center">
                <span className="text-xs text-white font-mono">600</span>
              </div>
              <div className="bg-gray-800 flex items-center justify-center">
                <span className="text-xs text-white font-mono">800</span>
              </div>
            </div>
            <p className="text-sm font-medium">Gray Scale</p>
          </div>
          
          {/* Status Colors */}
          <div className="space-y-2">
            <div className="grid grid-rows-4 h-20 rounded-md overflow-hidden shadow">
              <div className="bg-success flex items-center justify-center">
                <span className="text-xs text-white font-mono">success</span>
              </div>
              <div className="bg-info flex items-center justify-center">
                <span className="text-xs text-white font-mono">info</span>
              </div>
              <div className="bg-warning flex items-center justify-center">
                <span className="text-xs text-white font-mono">warning</span>
              </div>
              <div className="bg-error flex items-center justify-center">
                <span className="text-xs text-white font-mono">error</span>
              </div>
            </div>
            <p className="text-sm font-medium">Semantic Colors</p>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h3 className="text-xl font-medium mb-4">Typography</h3>
        <div className="space-y-4">
          <div>
            <h1 className="text-5xl font-bold">Heading 1 (3rem)</h1>
            <p className="text-sm text-gray-500 mt-1">5xl / Bold</p>
          </div>
          <div>
            <h2 className="text-4xl font-semibold">Heading 2 (2.25rem)</h2>
            <p className="text-sm text-gray-500 mt-1">4xl / Semibold</p>
          </div>
          <div>
            <h3 className="text-3xl font-semibold">Heading 3 (1.875rem)</h3>
            <p className="text-sm text-gray-500 mt-1">3xl / Semibold</p>
          </div>
          <div>
            <h4 className="text-2xl font-medium">Heading 4 (1.5rem)</h4>
            <p className="text-sm text-gray-500 mt-1">2xl / Medium</p>
          </div>
          <div>
            <h5 className="text-xl font-medium">Heading 5 (1.25rem)</h5>
            <p className="text-sm text-gray-500 mt-1">xl / Medium</p>
          </div>
          <div>
            <h6 className="text-lg font-medium">Heading 6 (1.125rem)</h6>
            <p className="text-sm text-gray-500 mt-1">lg / Medium</p>
          </div>
          <div>
            <p className="text-base">Body Text - Base (1rem)</p>
            <p className="text-sm text-gray-500 mt-1">base / Normal</p>
          </div>
          <div>
            <p className="text-sm">Small Text (0.875rem)</p>
            <p className="text-sm text-gray-500 mt-1">sm / Normal</p>
          </div>
          <div>
            <p className="text-xs">Extra Small Text (0.75rem)</p>
            <p className="text-sm text-gray-500 mt-1">xs / Normal</p>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h3 className="text-xl font-medium mb-4">Spacing</h3>
        <div className="flex flex-wrap gap-4">
          {[1, 2, 4, 6, 8, 12, 16].map((size) => (
            <div key={size} className="flex flex-col items-center">
              <div 
                className={`bg-primary-100 border border-primary-200 flex items-center justify-center`} 
                style={{ width: `${size/4}rem`, height: `${size/4}rem` }}
              >
                <span className="text-xs text-primary-900">{size}</span>
              </div>
              <span className="text-xs text-gray-500 mt-1">{size/4}rem</span>
            </div>
          ))}
        </div>
      </section>
      
      <section className="mb-8">
        <h3 className="text-xl font-medium mb-4">Border Radius</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-100 border border-primary-200 rounded-sm"></div>
            <span className="text-xs text-gray-500 mt-1">sm (0.125rem)</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-100 border border-primary-200 rounded"></div>
            <span className="text-xs text-gray-500 mt-1">default (0.25rem)</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-100 border border-primary-200 rounded-md"></div>
            <span className="text-xs text-gray-500 mt-1">md (0.375rem)</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-100 border border-primary-200 rounded-lg"></div>
            <span className="text-xs text-gray-500 mt-1">lg (0.5rem)</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-100 border border-primary-200 rounded-xl"></div>
            <span className="text-xs text-gray-500 mt-1">xl (0.75rem)</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-100 border border-primary-200 rounded-2xl"></div>
            <span className="text-xs text-gray-500 mt-1">2xl (1rem)</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-100 border border-primary-200 rounded-full"></div>
            <span className="text-xs text-gray-500 mt-1">full (9999px)</span>
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-xl font-medium mb-4">Shadows</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white border border-gray-100 shadow-sm rounded-lg"></div>
            <span className="text-xs text-gray-500 mt-2">shadow-sm</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white border border-gray-100 shadow rounded-lg"></div>
            <span className="text-xs text-gray-500 mt-2">shadow (default)</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white border border-gray-100 shadow-md rounded-lg"></div>
            <span className="text-xs text-gray-500 mt-2">shadow-md</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white border border-gray-100 shadow-lg rounded-lg"></div>
            <span className="text-xs text-gray-500 mt-2">shadow-lg</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white border border-gray-100 shadow-xl rounded-lg"></div>
            <span className="text-xs text-gray-500 mt-2">shadow-xl</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThemeDemo;
