import React from 'react';
import { HiOutlineChevronUp, HiOutlineChevronDown } from 'react-icons/hi';

const WardOrderingStep = ({ selectedWards, moveWard }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Arrange Ward Order</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {selectedWards.map((ward, index) => (
          <div key={ward.wardId} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
            <div className="flex flex-col">
              <button
                onClick={() => moveWard(index, 'up')}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <HiOutlineChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveWard(index, 'down')}
                disabled={index === selectedWards.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <HiOutlineChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">#{index + 1} Ward {ward.wardNumber}</p>
              <p className="text-xs text-gray-600">{ward.wardName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardOrderingStep;
