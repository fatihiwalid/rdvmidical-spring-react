import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '',
    password: '', phone: '', role: 'PATIENT',
    bloodType: '', address: '', specialization: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'PATIENT') navigate('/patient/dashboard');
      else if (user.role === 'MEDECIN') navigate('/doctor/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
      <div className="card shadow-lg border-0" style={{ width: 500 }}>
        <div className="card-body p-5">
          <h4 className="fw-bold mb-4 text-center">
            <i className="bi bi-person-plus text-primary me-2" />
            Créer un compte
          </h4>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label">Prénom</label>
                <input className="form-control" value={form.firstName} onChange={set('firstName')} required />
              </div>
              <div className="col-6">
                <label className="form-label">Nom</label>
                <input className="form-control" value={form.lastName} onChange={set('lastName')} required />
              </div>
              <div className="col-6">
                <label className="form-label">Nom d'utilisateur</label>
                <input className="form-control" value={form.username} onChange={set('username')} required />
              </div>
              <div className="col-6">
                <label className="form-label">Téléphone</label>
                <input className="form-control" value={form.phone} onChange={set('phone')} />
              </div>
              <div className="col-12">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={form.email} onChange={set('email')} required />
              </div>
              <div className="col-12">
                <label className="form-label">Mot de passe</label>
                <input type="password" className="form-control" value={form.password} onChange={set('password')} required />
              </div>
              <div className="col-12">
                <label className="form-label">Rôle</label>
                <select className="form-select" value={form.role} onChange={set('role')}>
                  <option value="PATIENT">Patient</option>
                  <option value="MEDECIN">Médecin</option>
                </select>
              </div>

              {form.role === 'PATIENT' && (
                <>
                  <div className="col-6">
                    <label className="form-label">Groupe sanguin</label>
                    <select className="form-select" value={form.bloodType} onChange={set('bloodType')}>
                      <option value="">Sélectionner</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label">Adresse</label>
                    <input className="form-control" value={form.address} onChange={set('address')} />
                  </div>
                </>
              )}

              {form.role === 'MEDECIN' && (
                <div className="col-12">
                  <label className="form-label">Spécialisation</label>
                  <input className="form-control" value={form.specialization} onChange={set('specialization')} required />
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              S'inscrire
            </button>
          </form>

          <div className="text-center mt-3">
            <small>Déjà inscrit ? </small>
            <Link to="/login" className="small">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
