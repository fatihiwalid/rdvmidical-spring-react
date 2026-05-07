import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

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

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <Layout>
      <h4 className="fw-bold mb-4">Mes Rendez-vous</h4>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'REJECTED', 'CANCELLED'].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL' ? 'Tous' : s}
            {s !== 'ALL' && (
              <span className="ms-1 badge bg-white text-dark">
                {appointments.filter(a => a.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Motif</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.patientFirstName} {a.patientLastName}</td>
                      <td>{a.appointmentDate}</td>
                      <td>{a.startTime || '-'}</td>
                      <td>{a.reason || '-'}</td>
                      <td><StatusBadge status={a.status} /></td>
                      <td>
                        {a.status === 'PENDING' && (
                          <>
                            <button className="btn btn-success btn-sm me-1"
                                    onClick={() => updateStatus(a.id, 'CONFIRMED')}>
                              Accepter
                            </button>
                            <button className="btn btn-danger btn-sm"
                                    onClick={() => updateStatus(a.id, 'REJECTED')}>
                              Refuser
                            </button>
                          </>
                        )}
                        {a.status === 'CONFIRMED' && (
                          <button className="btn btn-info btn-sm text-white"
                                  onClick={() => updateStatus(a.id, 'COMPLETED')}>
                            Terminer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">Aucun rendez-vous</td>
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

export default DoctorAppointments;
