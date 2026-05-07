import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';

import PatientDashboard from './pages/patient/PatientDashboard';
import MyAppointments from './pages/patient/MyAppointments';
import BookAppointment from './pages/patient/BookAppointment';
import DoctorsList from './pages/patient/DoctorsList';
import PatientProfile from './pages/patient/PatientProfile';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorAvailability from './pages/doctor/DoctorAvailability';
import DoctorProfile from './pages/doctor/DoctorProfile';

import AgentDashboard from './pages/agent/AgentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const paths = {
    PATIENT: '/patient/dashboard',
    MEDECIN: '/doctor/dashboard',
    AGENT: '/agent/dashboard',
    SUPER_ADMIN: '/admin/dashboard',
  };
  return <Navigate to={paths[user.role] || '/login'} replace />;
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient routes */}
        <Route path="/patient/dashboard" element={
          <PrivateRoute roles={['PATIENT']}><PatientDashboard /></PrivateRoute>
        } />
        <Route path="/patient/appointments" element={
          <PrivateRoute roles={['PATIENT']}><MyAppointments /></PrivateRoute>
        } />
        <Route path="/patient/book" element={
          <PrivateRoute roles={['PATIENT']}><BookAppointment /></PrivateRoute>
        } />
        <Route path="/patient/doctors" element={
          <PrivateRoute roles={['PATIENT']}><DoctorsList /></PrivateRoute>
        } />
        <Route path="/patient/profile" element={
          <PrivateRoute roles={['PATIENT']}><PatientProfile /></PrivateRoute>
        } />

        {/* Doctor routes */}
        <Route path="/doctor/dashboard" element={
          <PrivateRoute roles={['MEDECIN']}><DoctorDashboard /></PrivateRoute>
        } />
        <Route path="/doctor/appointments" element={
          <PrivateRoute roles={['MEDECIN']}><DoctorAppointments /></PrivateRoute>
        } />
        <Route path="/doctor/availability" element={
          <PrivateRoute roles={['MEDECIN']}><DoctorAvailability /></PrivateRoute>
        } />
        <Route path="/doctor/profile" element={
          <PrivateRoute roles={['MEDECIN']}><DoctorProfile /></PrivateRoute>
        } />

        {/* Agent routes */}
        <Route path="/agent/dashboard" element={
          <PrivateRoute roles={['AGENT']}><AgentDashboard /></PrivateRoute>
        } />
        <Route path="/agent/appointments" element={
          <PrivateRoute roles={['AGENT']}><AgentDashboard /></PrivateRoute>
        } />
        <Route path="/agent/patients" element={
          <PrivateRoute roles={['AGENT']}><AgentDashboard /></PrivateRoute>
        } />
        <Route path="/agent/book" element={
          <PrivateRoute roles={['AGENT']}><AgentDashboard /></PrivateRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute roles={['SUPER_ADMIN']}><AdminDashboard /></PrivateRoute>
        } />
        <Route path="/admin/users" element={
          <PrivateRoute roles={['SUPER_ADMIN']}><AdminDashboard /></PrivateRoute>
        } />
        <Route path="/admin/appointments" element={
          <PrivateRoute roles={['SUPER_ADMIN']}><AdminDashboard /></PrivateRoute>
        } />

        <Route path="/unauthorized" element={
          <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <h1 className="display-1 text-danger">403</h1>
              <p>Accès non autorisé</p>
              <a href="/login" className="btn btn-primary">Retour connexion</a>
            </div>
          </div>
        } />
        <Route path="*" element={
          <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <h1 className="display-1 text-muted">404</h1>
              <p>Page non trouvée</p>
              <a href="/" className="btn btn-primary">Accueil</a>
            </div>
          </div>
        } />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
