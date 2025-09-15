import React from 'react';

export const Badge: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${className}`}>{children}</span>
);
