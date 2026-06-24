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
        <Link to="/" className={styles.link}>Przeglądaj</Link>
        {user && <Link to="/my-products" className={styles.link}>Moje ogłoszenia</Link>}
        {user && <Link to="/orders" className={styles.link}>Zamówienia</Link>}
      </div>

      <div className={styles.actions}>
        {user ? (
          <>
            <Link to="/cart" className={styles.cartBtn}>
              Koszyk
              {count > 0 && <span className={styles.badge}>{count}</span>}
            </Link>
            <span className={styles.email}>{user.email}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>Wyloguj</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Zaloguj się</Link>
            <Link to="/register" className="btn btn-primary">Zarejestruj się</Link>
          </>
        )}
      </div>
    </nav>
  );
}