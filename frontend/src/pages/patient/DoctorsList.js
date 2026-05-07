import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/doctors')
      .then(res => setDoctors(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter(d =>
    `${d.firstName} ${d.lastName} ${d.specialization}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h4 className="fw-bold mb-4">Nos Médecins</h4>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Rechercher par nom ou spécialité..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row g-3">
          {filtered.map(d => (
            <div key={d.id} className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                         style={{ width: 50, height: 50, fontSize: 20 }}>
                      {d.firstName[0]}{d.lastName[0]}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Dr. {d.firstName} {d.lastName}</h6>
                      <small className="text-primary">{d.specialization}</small>
                    </div>
                  </div>
                  {d.bio && <p className="text-muted small mb-2">{d.bio}</p>}
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold text-success">
                      {d.consultationFee ? `${d.consultationFee} MAD` : 'Tarif NC'}
                    </span>
                    <span className={`badge ${d.available ? 'bg-success' : 'bg-secondary'}`}>
                      {d.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 pb-3">
                  <button
                    className="btn btn-primary btn-sm w-100"
                    onClick={() => navigate('/patient/book')}
                  >
                    <i className="bi bi-calendar-plus me-1" />Prendre RDV
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default DoctorsList;
