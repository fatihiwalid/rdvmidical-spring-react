import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuByRole = {
  PATIENT: [
    { to: '/patient/dashboard', icon: 'bi-house', label: 'Tableau de bord' },
    { to: '/patient/doctors', icon: 'bi-person-badge', label: 'Médecins' },
    { to: '/patient/appointments', icon: 'bi-calendar-check', label: 'Mes RDV' },
    { to: '/patient/book', icon: 'bi-calendar-plus', label: 'Prendre RDV' },
    { to: '/patient/profile', icon: 'bi-person-circle', label: 'Mon Profil' },
  ],
  MEDECIN: [
    { to: '/doctor/dashboard', icon: 'bi-house', label: 'Tableau de bord' },
    { to: '/doctor/appointments', icon: 'bi-calendar-check', label: 'Mes RDV' },
    { to: '/doctor/availability', icon: 'bi-clock', label: 'Disponibilités' },
    { to: '/doctor/profile', icon: 'bi-person-circle', label: 'Mon Profil' },
  ],
  AGENT: [
    { to: '/agent/dashboard', icon: 'bi-house', label: 'Tableau de bord' },
    { to: '/agent/appointments', icon: 'bi-calendar-check', label: 'Tous les RDV' },
    { to: '/agent/patients', icon: 'bi-people', label: 'Patients' },
    { to: '/agent/book', icon: 'bi-calendar-plus', label: 'Créer RDV' },
  ],
  SUPER_ADMIN: [
    { to: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { to: '/admin/users', icon: 'bi-people', label: 'Utilisateurs' },
    { to: '/admin/appointments', icon: 'bi-calendar-check', label: 'Rendez-vous' },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menu = menuByRole[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar d-flex flex-column py-3">
      <div className="px-3 mb-4">
        <h5 className="text-white fw-bold mb-0">
          <i className="bi bi-hospital me-2" />
          MediRDV
        </h5>
        <small className="text-white-50">
          {user?.firstName} {user?.lastName}
        </small>
        <br />
        <span className="badge bg-light text-primary mt-1">{user?.role}</span>
      </div>

      <nav className="nav flex-column flex-grow-1">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${item.icon} me-2`} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 mt-auto">
        <button className="btn btn-outline-light btn-sm w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
