import { useState, useEffect } from 'react';
import { HiX, HiCheckCircle, HiExclamationCircle, HiInformationCircle } from 'react-icons/hi';

const SnackBar = ({ 
  isOpen, 
  onClose, 
  message, 
  type = 'success', 
  duration = 5000,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <HiCheckCircle className="text-green-500" />;
      case 'error':
        return <HiExclamationCircle className="text-red-500" />;
      case 'warning':
        return <HiExclamationCircle className="text-yellow-500" />;
      case 'info':
        return <HiInformationCircle className="text-blue-500" />;
      default:
        return <HiCheckCircle className="text-green-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-green-800';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed ${getPositionClasses()} z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      <div className={`max-w-sm w-full border rounded-lg shadow-lg ${getBackgroundColor()}`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${getTextColor()}`}>
                {message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={handleClose}
                className={`inline-flex rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === 'success' ? 'text-green-500 hover:bg-green-500 focus:ring-green-500' :
                  type === 'error' ? 'text-red-500 hover:bg-red-500 focus:ring-red-500' :
                  type === 'warning' ? 'text-yellow-500 hover:bg-yellow-500 focus:ring-yellow-500' :
                  'text-blue-500 hover:bg-blue-500 focus:ring-blue-500'
                }`}
              >
                <HiX className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnackBar;
