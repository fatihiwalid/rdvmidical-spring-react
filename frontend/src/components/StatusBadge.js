const STATUS_MAP = {
  PENDING:   { label: 'En attente',  cls: 'badge-pending'   },
  CONFIRMED: { label: 'Confirmé',    cls: 'badge-confirmed' },
  REJECTED:  { label: 'Rejeté',      cls: 'badge-rejected'  },
  CANCELLED: { label: 'Annulé',      cls: 'badge-cancelled' },
  COMPLETED: { label: 'Terminé',     cls: 'badge-completed' },
};

const StatusBadge = ({ status }) => {
  const { label, cls } = STATUS_MAP[status] || { label: status, cls: '' };
  return <span className={`badge ${cls}`}>{label}</span>;
};

export default StatusBadge;
