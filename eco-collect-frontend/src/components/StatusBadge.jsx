import React from 'react';

const STATUS_CONFIG = {
  draft: { class: 'bg-yellow-100 text-yellow-800', label: 'DRAFT' },
  approved: { class: 'bg-blue-100 text-blue-800', label: 'APPROVED' },
  sent: { class: 'bg-orange-100 text-orange-800', label: 'SENT' },
  paid: { class: 'bg-green-100 text-green-800', label: 'PAID' },
  unpaid: { class: 'bg-red-100 text-red-800', label: 'UNPAID' },
  overdue: { class: 'bg-red-100 text-red-800', label: 'OVERDUE' }
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;