import React from 'react';
import { HiX } from 'react-icons/hi';

const BaseModal = ({ 
  isOpen, 
  onClose, 
  title, 
  icon: Icon, 
  iconColor = 'text-emerald-600',
  children, 
  footer,
  maxWidth = 'max-w-2xl',
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl ${maxWidth} w-full max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            {Icon && <Icon className={`mr-2 ${iconColor}`} />}
            {title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <HiX className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseModal;
