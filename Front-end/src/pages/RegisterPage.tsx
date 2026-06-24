import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 12) {
      setError('Hasło musi mieć co najmniej 12 znaków.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: unknown } };
      const data = axiosErr.response?.data;
      if (Array.isArray(data)) {
        setError(data.map((e: { description: string }) => e.description).join(' '));
      } else {
        setError('Rejestracja nie powiodła się. Spróbuj ponownie.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <div className={styles.header}>
          <span className={styles.logo}>MRKT</span>
          <h1 className={styles.title}>Utwórz konto</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ty@przyklad.pl"
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="min. 12 znaków"
              required
            />
            <span className={styles.hint}>Minimum 12 znaków</span>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Tworzenie konta...' : 'Utwórz konto'}
          </button>
        </form>

        <p className={styles.footer}>
          Masz już konto?{' '}
          <Link to="/login" className={styles.footerLink}>Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}