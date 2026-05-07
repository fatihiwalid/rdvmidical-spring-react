import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_PATHS = {
  PATIENT: '/patient/dashboard',
  MEDECIN: '/doctor/dashboard',
  AGENT: '/agent/dashboard',
  SUPER_ADMIN: '/admin/dashboard',
};

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      navigate(ROLE_PATHS[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg border-0" style={{ width: 420 }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="bi bi-hospital text-primary" style={{ fontSize: 48 }} />
            <h3 className="mt-2 fw-bold">MediRDV</h3>
            <p className="text-muted">Gestion des Rendez-vous Médicaux</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom d'utilisateur</label>
              <input
                className="form-control"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="admin, dr.benali, patient1..."
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Connexion
            </button>
          </form>

          <hr />
          <div className="text-center">
            <small className="text-muted">Pas encore inscrit ? </small>
            <Link to="/register" className="small">Créer un compte</Link>
          </div>

          <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted d-block fw-bold mb-1">Comptes de test :</small>
            <small className="text-muted d-block">Admin: admin / admin123</small>
            <small className="text-muted d-block">Médecin: dr.benali / doctor123</small>
            <small className="text-muted d-block">Agent: agent1 / agent123</small>
            <small className="text-muted d-block">Patient: patient1 / patient123</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
