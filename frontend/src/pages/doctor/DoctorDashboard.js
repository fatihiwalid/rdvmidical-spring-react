import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/api/doctors/appointments')
      .then(res => setAppointments(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/doctors/appointments/${id}/status?status=${status}`);
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur');
    }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'PENDING').length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
  };

  return (
    <Layout>
      <div className="mb-4">
        <h4 className="fw-bold">Bonjour Dr. {user?.lastName} 👋</h4>
        <p className="text-muted">Gérez vos consultations et disponibilités.</p>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: 'Total RDV', value: stats.total, color: 'primary', icon: 'bi-calendar' },
          { label: 'En attente', value: stats.pending, color: 'warning', icon: 'bi-hourglass' },
          { label: 'Confirmés', value: stats.confirmed, color: 'success', icon: 'bi-check-circle' },
          { label: 'Terminés', value: stats.completed, color: 'info', icon: 'bi-check2-all' },
        ].map(s => (
          <div key={s.label} className="col-6 col-md-3">
            <div className={`card stat-card border-0 border-start border-4 border-${s.color}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small">{s.label}</div>
                    <div className={`fs-3 fw-bold text-${s.color}`}>{s.value}</div>
                  </div>
                  <i className={`bi ${s.icon} fs-2 text-${s.color} opacity-50`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h6 className="mb-0 fw-bold">Rendez-vous en attente</h6>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Motif</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.filter(a => a.status === 'PENDING').slice(0, 5).map(a => (
                    <tr key={a.id}>
                      <td>{a.patientFirstName} {a.patientLastName}</td>
                      <td>{a.appointmentDate}</td>
                      <td>{a.startTime || '-'}</td>
                      <td>{a.reason || '-'}</td>
                      <td><StatusBadge status={a.status} /></td>
                      <td>
                        <button className="btn btn-success btn-sm me-1"
                                onClick={() => updateStatus(a.id, 'CONFIRMED')}>
                          <i className="bi bi-check" />
                        </button>
                        <button className="btn btn-danger btn-sm"
                                onClick={() => updateStatus(a.id, 'REJECTED')}>
                          <i className="bi bi-x" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {appointments.filter(a => a.status === 'PENDING').length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        Aucun RDV en attente
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
