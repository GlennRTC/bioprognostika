import React from 'react';
import { CardProps } from '@/types';

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  className = '',
}) => {
  const baseClasses = 'rounded-2xl p-6';
  
  const variantClasses = {
    default: 'bg-white shadow-sm border border-neutral-200',
    medical: 'bg-white shadow-medical border border-primary-100',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  return (
    <div className={classes}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-neutral-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;