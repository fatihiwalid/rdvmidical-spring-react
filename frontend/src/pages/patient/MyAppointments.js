import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const load = () => {
    api.get('/api/patients/appointments')
      .then(res => setAppointments(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Annuler ce rendez-vous ?')) return;
    setCancelling(id);
    try {
      await api.put(`/api/appointments/${id}/cancel`);
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <Layout>
      <h4 className="fw-bold mb-4">Mes Rendez-vous</h4>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-1 d-block mb-2" />
              Aucun rendez-vous
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Médecin</th>
                    <th>Spécialité</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Motif</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>Dr. {a.doctorFirstName} {a.doctorLastName}</td>
                      <td>{a.doctorSpecialization}</td>
                      <td>{a.appointmentDate}</td>
                      <td>{a.startTime || '-'}</td>
                      <td>{a.reason || '-'}</td>
                      <td><StatusBadge status={a.status} /></td>
                      <td>
                        {['PENDING', 'CONFIRMED'].includes(a.status) && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            disabled={cancelling === a.id}
                            onClick={() => cancel(a.id)}
                          >
                            {cancelling === a.id
                              ? <span className="spinner-border spinner-border-sm" />
                              : <i className="bi bi-x-circle" />}
                          </button>
                        )}
                      </td>
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

export default MyAppointments;
