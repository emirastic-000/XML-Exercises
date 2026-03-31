import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">XML Training</Link>

      {user && (
        <div className="navbar-links">
          <Link to="/modules">Modules</Link>
          <Link to="/achievements">Achievements</Link>
          <Link to="/profile">Profile</Link>
          <button className="btn btn-outline" onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
