import React from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';

const AlternativeDates = ({ 
  alternativeDates, 
  onDateSelect 
}) => {
  if (alternativeDates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <HiOutlineCalendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p>No alternative dates found with available wards.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alternativeDates.map((altDate) => (
        <div
          key={altDate.date}
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            altDate.isRecommended
              ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
              : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
          }`}
          onClick={() => onDateSelect(altDate.date)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HiOutlineCalendar className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {altDate.dateFormatted}
                </p>
                <p className="text-xs text-gray-600">
                  {altDate.availableWards} ward(s) available
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {altDate.isRecommended && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Recommended
                </span>
              )}
              <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                Select Date
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlternativeDates;
