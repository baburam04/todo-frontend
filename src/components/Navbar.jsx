import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="logo">
          Todo App
        </Link>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/auth">Login/Register</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;