
import React from 'react';

interface LayoutBaseProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const LayoutBase: React.FC<LayoutBaseProps> = ({ children, header, footer }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {header && (
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          {header}
        </header>
      )}
      
      <main className="flex-grow">{children}</main>
      
      {footer && (
        <footer className="sticky bottom-0 z-10 bg-white border-t border-gray-200">
          {footer}
        </footer>
      )}
    </div>
  );
};

export default LayoutBase;
