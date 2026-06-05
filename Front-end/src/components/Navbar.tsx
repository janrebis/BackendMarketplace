import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>MRKT</Link>

      <div className={styles.links}>
        <Link to="/" className={styles.link}>Browse</Link>
        {user && <Link to="/my-products" className={styles.link}>My listings</Link>}
      </div>

      <div className={styles.actions}>
        {user ? (
          <>
            <Link to="/cart" className={styles.cartBtn}>
              Cart
              {count > 0 && <span className={styles.badge}>{count}</span>}
            </Link>
            <span className={styles.email}>{user.email}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}