import Sidebar from './Sidebar';

const Layout = ({ children }) => (
  <div className="d-flex">
    <Sidebar />
    <div className="main-content flex-grow-1">
      {children}
    </div>
  </div>
);

export default Layout;
