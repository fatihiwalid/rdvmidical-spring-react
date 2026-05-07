import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/patients/appointments')
      .then(res => setAppointments(res.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'PENDING').length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
  };

  return (
    <Layout>
      <div className="mb-4">
        <h4 className="fw-bold">Bonjour, {user?.firstName} 👋</h4>
        <p className="text-muted">Voici un résumé de vos rendez-vous médicaux.</p>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: 'Total RDV', value: stats.total, color: 'primary', icon: 'bi-calendar' },
          { label: 'En attente', value: stats.pending, color: 'warning', icon: 'bi-hourglass' },
          { label: 'Confirmés', value: stats.confirmed, color: 'success', icon: 'bi-check-circle' },
          { label: 'Annulés', value: stats.cancelled, color: 'danger', icon: 'bi-x-circle' },
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
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Derniers rendez-vous</h6>
          <Link to="/patient/book" className="btn btn-primary btn-sm">
            <i className="bi bi-plus me-1" />Prendre RDV
          </Link>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-1 d-block mb-2" />
              Aucun rendez-vous trouvé
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Médecin</th>
                    <th>Spécialité</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 5).map(a => (
                    <tr key={a.id}>
                      <td>Dr. {a.doctorFirstName} {a.doctorLastName}</td>
                      <td>{a.doctorSpecialization}</td>
                      <td>{a.appointmentDate}</td>
                      <td>{a.startTime || '-'}</td>
                      <td><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
