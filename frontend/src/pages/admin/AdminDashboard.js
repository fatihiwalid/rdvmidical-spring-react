import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([
      api.get('/api/admin/stats'),
      api.get('/api/admin/users'),
      api.get('/api/admin/appointments'),
    ]).then(([statsRes, usersRes, apptRes]) => {
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setAppointments(apptRes.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleUser = async (id) => {
    await api.put(`/api/admin/users/${id}/toggle`);
    load();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    await api.delete(`/api/admin/users/${id}`);
    load();
  };

  return (
    <Layout>
      <div className="mb-4">
        <h4 className="fw-bold">Dashboard Super Admin</h4>
        <p className="text-muted">Vue d'ensemble du système.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" style={{ width: 48, height: 48 }} /></div>
      ) : (
        <>
          {stats && (
            <div className="row g-3 mb-4">
              {[
                { label: 'Patients', value: stats.totalPatients, color: 'success', icon: 'bi-people' },
                { label: 'Médecins', value: stats.totalDoctors, color: 'primary', icon: 'bi-person-badge' },
                { label: 'Agents', value: stats.totalAgents, color: 'info', icon: 'bi-headset' },
                { label: 'Total RDV', value: stats.totalAppointments, color: 'secondary', icon: 'bi-calendar' },
                { label: 'En attente', value: stats.pendingAppointments, color: 'warning', icon: 'bi-hourglass' },
                { label: 'Confirmés', value: stats.confirmedAppointments, color: 'success', icon: 'bi-check-circle' },
                { label: 'Annulés', value: stats.cancelledAppointments, color: 'danger', icon: 'bi-x-circle' },
                { label: 'Terminés', value: stats.completedAppointments, color: 'dark', icon: 'bi-check2-all' },
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
          )}

          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button className={`nav-link ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>
                Statistiques
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
                Utilisateurs <span className="badge bg-primary ms-1">{users.length}</span>
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === 'appointments' ? 'active' : ''}`} onClick={() => setTab('appointments')}>
                Rendez-vous <span className="badge bg-secondary ms-1">{appointments.length}</span>
              </button>
            </li>
          </ul>

          {tab === 'stats' && stats && (
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white"><h6 className="mb-0">Répartition des RDV</h6></div>
                  <div className="card-body">
                    {[
                      { label: 'En attente', value: stats.pendingAppointments, color: '#ffc107' },
                      { label: 'Confirmés', value: stats.confirmedAppointments, color: '#198754' },
                      { label: 'Annulés', value: stats.cancelledAppointments, color: '#dc3545' },
                      { label: 'Terminés', value: stats.completedAppointments, color: '#0d6efd' },
                    ].map(item => (
                      <div key={item.label} className="mb-2">
                        <div className="d-flex justify-content-between">
                          <small>{item.label}</small>
                          <small className="fw-bold">{item.value}</small>
                        </div>
                        <div className="progress" style={{ height: 8 }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: stats.totalAppointments > 0
                                ? `${(item.value / stats.totalAppointments) * 100}%`
                                : '0%',
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white"><h6 className="mb-0">Répartition des utilisateurs</h6></div>
                  <div className="card-body">
                    {[
                      { label: 'Patients', value: stats.totalPatients, color: '#198754' },
                      { label: 'Médecins', value: stats.totalDoctors, color: '#0d6efd' },
                      { label: 'Agents', value: stats.totalAgents, color: '#0dcaf0' },
                    ].map(item => {
                      const total = stats.totalPatients + stats.totalDoctors + stats.totalAgents;
                      return (
                        <div key={item.label} className="mb-2">
                          <div className="d-flex justify-content-between">
                            <small>{item.label}</small>
                            <small className="fw-bold">{item.value}</small>
                          </div>
                          <div className="progress" style={{ height: 8 }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: total > 0 ? `${(item.value / total) * 100}%` : '0%',
                                backgroundColor: item.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th><th>Nom</th><th>Username</th><th>Email</th>
                        <th>Rôle</th><th>Statut</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.firstName} {u.lastName}</td>
                          <td>{u.username}</td>
                          <td>{u.email}</td>
                          <td><span className="badge bg-secondary">{u.role}</span></td>
                          <td>
                            <span className={`badge ${u.enabled ? 'bg-success' : 'bg-danger'}`}>
                              {u.enabled ? 'Actif' : 'Désactivé'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-outline-warning btn-sm me-1"
                                    onClick={() => toggleUser(u.id)}
                                    title={u.enabled ? 'Désactiver' : 'Activer'}>
                              <i className={`bi bi-${u.enabled ? 'lock' : 'unlock'}`} />
                            </button>
                            <button className="btn btn-outline-danger btn-sm"
                                    onClick={() => deleteUser(u.id)}
                                    title="Supprimer">
                              <i className="bi bi-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === 'appointments' && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th><th>Patient</th><th>Médecin</th>
                        <th>Date</th><th>Heure</th><th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map(a => (
                        <tr key={a.id}>
                          <td>{a.id}</td>
                          <td>{a.patientFirstName} {a.patientLastName}</td>
                          <td>Dr. {a.doctorFirstName} {a.doctorLastName}</td>
                          <td>{a.appointmentDate}</td>
                          <td>{a.startTime || '-'}</td>
                          <td><StatusBadge status={a.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default AdminDashboard;
