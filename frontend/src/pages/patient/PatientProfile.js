import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/api/patients/profile').then(res => {
      setProfile(res.data);
      setForm(res.data);
    });
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/api/patients/profile', form);
      setProfile(res.data);
      setEditing(false);
      setMsg('Profil mis à jour avec succès !');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <Layout><div className="text-center py-4"><div className="spinner-border text-primary" /></div></Layout>;

  return (
    <Layout>
      <h4 className="fw-bold mb-4">Mon Profil</h4>

      {msg && <div className={`alert ${msg.includes('Erreur') ? 'alert-danger' : 'alert-success'}`}>{msg}</div>}

      <div className="card border-0 shadow-sm" style={{ maxWidth: 600 }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between mb-4">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                   style={{ width: 60, height: 60, fontSize: 24 }}>
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </div>
              <div>
                <h5 className="mb-0">{profile.firstName} {profile.lastName}</h5>
                <small className="text-muted">{profile.email}</small>
              </div>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={() => setEditing(!editing)}>
              <i className={`bi bi-${editing ? 'x' : 'pencil'} me-1`} />
              {editing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={save}>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label">Prénom</label>
                  <input className="form-control" value={form.firstName || ''} onChange={set('firstName')} />
                </div>
                <div className="col-6">
                  <label className="form-label">Nom</label>
                  <input className="form-control" value={form.lastName || ''} onChange={set('lastName')} />
                </div>
                <div className="col-6">
                  <label className="form-label">Téléphone</label>
                  <input className="form-control" value={form.phone || ''} onChange={set('phone')} />
                </div>
                <div className="col-6">
                  <label className="form-label">Groupe sanguin</label>
                  <select className="form-select" value={form.bloodType || ''} onChange={set('bloodType')}>
                    <option value="">-</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Adresse</label>
                  <input className="form-control" value={form.address || ''} onChange={set('address')} />
                </div>
                <div className="col-12">
                  <label className="form-label">Antécédents médicaux</label>
                  <textarea className="form-control" rows={3} value={form.medicalHistory || ''} onChange={set('medicalHistory')} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-3" disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                Enregistrer
              </button>
            </form>
          ) : (
            <div className="row g-3">
              {[
                { label: 'Téléphone', value: profile.phone },
                { label: 'Email', value: profile.email },
                { label: 'Date de naissance', value: profile.dateOfBirth },
                { label: 'Groupe sanguin', value: profile.bloodType },
                { label: 'Adresse', value: profile.address },
                { label: 'Antécédents', value: profile.medicalHistory },
              ].map(({ label, value }) => (
                <div key={label} className="col-6">
                  <small className="text-muted d-block">{label}</small>
                  <span>{value || <em className="text-muted">Non renseigné</em>}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PatientProfile;
