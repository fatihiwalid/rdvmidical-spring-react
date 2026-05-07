import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const AgentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('appointments');
  const [showBookForm, setShowBookForm] = useState(false);
  const [bookForm, setBookForm] = useState({ patientId: '', doctorId: '', appointmentDate: '', startTime: '', reason: '' });
  const [bookMsg, setBookMsg] = useState('');

  const load = () => {
    Promise.all([
      api.get('/api/agent/appointments'),
      api.get('/api/agent/patients'),
      api.get('/api/doctors'),
    ]).then(([apptRes, patRes, docRes]) => {
      setAppointments(apptRes.data);
      setPatients(patRes.data);
      setDoctors(docRes.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const book = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/agent/appointments', bookForm);
      setBookMsg('RDV créé !');
      setShowBookForm(false);
      load();
      setTimeout(() => setBookMsg(''), 3000);
    } catch (err) {
      setBookMsg('Erreur : ' + (err.response?.data?.message || 'inconnue'));
    }
  };

  const filteredAppts = appointments.filter(a =>
    search === '' ||
    `${a.patientFirstName} ${a.patientLastName} ${a.doctorFirstName} ${a.doctorLastName}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="d-flex justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-0">Tableau de bord Agent</h4>
          <p className="text-muted">Gestion des rendez-vous et patients</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowBookForm(!showBookForm)}>
          <i className="bi bi-calendar-plus me-2" />Créer un RDV
        </button>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: 'Total RDV', value: appointments.length, color: 'primary', icon: 'bi-calendar' },
          { label: 'En attente', value: appointments.filter(a => a.status === 'PENDING').length, color: 'warning', icon: 'bi-hourglass' },
          { label: 'Patients', value: patients.length, color: 'success', icon: 'bi-people' },
          { label: 'Médecins', value: doctors.length, color: 'info', icon: 'bi-person-badge' },
        ].map(s => (
          <div key={s.label} className="col-6 col-md-3">
            <div className={`card stat-card border-0 border-start border-4 border-${s.color}`}>
              <div className="card-body">
                <div className="text-muted small">{s.label}</div>
                <div className={`fs-3 fw-bold text-${s.color}`}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookMsg && <div className={`alert ${bookMsg.includes('Erreur') ? 'alert-danger' : 'alert-success'}`}>{bookMsg}</div>}

      {showBookForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white"><h6 className="mb-0 fw-bold">Créer un Rendez-vous</h6></div>
          <div className="card-body">
            <form onSubmit={book} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Patient</label>
                <select className="form-select" value={bookForm.patientId}
                        onChange={e => setBookForm({ ...bookForm, patientId: e.target.value })} required>
                  <option value="">Sélectionner</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Médecin</label>
                <select className="form-select" value={bookForm.doctorId}
                        onChange={e => setBookForm({ ...bookForm, doctorId: e.target.value })} required>
                  <option value="">Sélectionner</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} — {d.specialization}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" value={bookForm.appointmentDate}
                       onChange={e => setBookForm({ ...bookForm, appointmentDate: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Heure</label>
                <input type="time" className="form-control" value={bookForm.startTime}
                       onChange={e => setBookForm({ ...bookForm, startTime: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Motif</label>
                <input className="form-control" value={bookForm.reason}
                       onChange={e => setBookForm({ ...bookForm, reason: e.target.value })} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary me-2">Créer</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowBookForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'appointments' ? 'active' : ''}`} onClick={() => setTab('appointments')}>
            Rendez-vous <span className="badge bg-primary ms-1">{appointments.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'patients' ? 'active' : ''}`} onClick={() => setTab('patients')}>
            Patients <span className="badge bg-success ms-1">{patients.length}</span>
          </button>
        </li>
      </ul>

      {tab === 'appointments' && (
        <>
          <div className="mb-3">
            <input className="form-control" placeholder="Rechercher par nom patient ou médecin..."
                   value={search} onChange={e => setSearch(e.target.value)} />
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
                        <th>#</th><th>Patient</th><th>Médecin</th><th>Date</th><th>Heure</th><th>Motif</th><th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppts.map(a => (
                        <tr key={a.id}>
                          <td>{a.id}</td>
                          <td>{a.patientFirstName} {a.patientLastName}</td>
                          <td>Dr. {a.doctorFirstName} {a.doctorLastName}</td>
                          <td>{a.appointmentDate}</td>
                          <td>{a.startTime || '-'}</td>
                          <td>{a.reason || '-'}</td>
                          <td><StatusBadge status={a.status} /></td>
                        </tr>
                      ))}
                      {filteredAppts.length === 0 && (
                        <tr><td colSpan={7} className="text-center py-4 text-muted">Aucun résultat</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {tab === 'patients' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr><th>#</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Groupe sanguin</th><th>Adresse</th></tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.firstName} {p.lastName}</td>
                      <td>{p.email}</td>
                      <td>{p.phone || '-'}</td>
                      <td>{p.bloodType || '-'}</td>
                      <td>{p.address || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AgentDashboard;
