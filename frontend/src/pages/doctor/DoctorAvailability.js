import { useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const DAYS = [
  { value: 'MONDAY', label: 'Lundi' },
  { value: 'TUESDAY', label: 'Mardi' },
  { value: 'WEDNESDAY', label: 'Mercredi' },
  { value: 'THURSDAY', label: 'Jeudi' },
  { value: 'FRIDAY', label: 'Vendredi' },
  { value: 'SATURDAY', label: 'Samedi' },
  { value: 'SUNDAY', label: 'Dimanche' },
];

const DoctorAvailability = () => {
  const [form, setForm] = useState({
    dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00', available: true,
  });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [k]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/doctors/availability', form);
      setMsg('Disponibilité enregistrée !');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Erreur : ' + (err.response?.data?.message || 'inconnue'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <h4 className="fw-bold mb-4">Gérer mes Disponibilités</h4>

      <div className="card border-0 shadow-sm" style={{ maxWidth: 500 }}>
        <div className="card-body p-4">
          {msg && (
            <div className={`alert ${msg.includes('Erreur') ? 'alert-danger' : 'alert-success'}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Jour de la semaine</label>
              <select className="form-select" value={form.dayOfWeek} onChange={set('dayOfWeek')}>
                {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label fw-semibold">Heure de début</label>
                <input type="time" className="form-control" value={form.startTime} onChange={set('startTime')} required />
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold">Heure de fin</label>
                <input type="time" className="form-control" value={form.endTime} onChange={set('endTime')} required />
              </div>
            </div>

            <div className="mb-4 form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id="availableSwitch"
                checked={form.available}
                onChange={set('available')}
              />
              <label className="form-check-label" htmlFor="availableSwitch">
                Disponible ce jour
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={saving}>
              {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Enregistrer
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorAvailability;
