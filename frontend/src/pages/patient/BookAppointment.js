import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctorId: '', appointmentDate: '', startTime: '', reason: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/doctors').then(res => setDoctors(res.data));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/api/appointments', form);
      setSuccess(true);
      setTimeout(() => navigate('/patient/appointments'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <h4 className="fw-bold mb-4">Prendre un Rendez-vous</h4>

      <div className="card border-0 shadow-sm" style={{ maxWidth: 600 }}>
        <div className="card-body p-4">
          {success && (
            <div className="alert alert-success">
              <i className="bi bi-check-circle me-2" />
              Rendez-vous réservé ! Redirection en cours...
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Médecin</label>
              <select className="form-select" value={form.doctorId} onChange={set('doctorId')} required>
                <option value="">Sélectionner un médecin</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.firstName} {d.lastName} — {d.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Date</label>
              <input
                type="date"
                className="form-control"
                value={form.appointmentDate}
                onChange={set('appointmentDate')}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Heure préférée</label>
              <input
                type="time"
                className="form-control"
                value={form.startTime}
                onChange={set('startTime')}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Motif de la consultation</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.reason}
                onChange={set('reason')}
                placeholder="Décrivez brièvement votre motif..."
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {submitting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Confirmer le rendez-vous
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;
