import React from 'react';
import { HiOutlinePencil } from 'react-icons/hi';

const RouteTableRow = ({ route, onEditRoute, formatStatus }) => {
  return (
    <tr key={route.routeId} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        #{route.routeId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {route.routeName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {route.zoneName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {new Date(route.collectionDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {route.truckName || 'Not assigned'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {route.dispatcherName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {route.collectorName || 'Not assigned'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${formatStatus(route.status).color}`}>
          {formatStatus(route.status).text}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(route.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onEditRoute(route)}
          className="flex items-center text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200"
        >
          <HiOutlinePencil className="w-3 h-3 mr-1" />
          Edit
        </button>
      </td>
    </tr>
  );
};

export default RouteTableRow;
