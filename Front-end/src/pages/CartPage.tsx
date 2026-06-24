import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { placeOrder } from '../api/orders';
import type { Order } from '../types';
import { pluralPl } from '../utils/pluralize';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, remove, updateQty, clear, total, count } = useCart();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await placeOrder({
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
        })),
      });
      setOrder(res.data);
      clear();
    } catch (err) {
      const message =
        axios.isAxiosError(err) && typeof err.response?.data?.message === 'string'
          ? err.response.data.message
          : 'Nie udało się złożyć zamówienia. Spróbuj ponownie.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (order) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <span className={styles.successIcon}>✓</span>
          <h1 className={styles.successTitle}>Zamówienie złożone!</h1>
          <p className={styles.successSub}>
            Zamówienie #{order.id} na sumę {order.totalPrice.toFixed(2)} PLN zostało przyjęte.
            Dziękujemy za zakupy w MRKT.
          </p>
          <div className={styles.successActions}>
            <Link to="/orders" className="btn btn-primary">Zobacz historię zamówień</Link>
            <Link to="/" className="btn btn-ghost">Przeglądaj więcej</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <h1 className={styles.title}>Twój koszyk</h1>
          <p>Nic tu jeszcze nie ma.</p>
          <Link to="/" className="btn btn-primary">Przeglądaj ogłoszenia</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Twój koszyk</h1>
        <span className={styles.count}>
          {count} {pluralPl(count, 'sztuka', 'sztuki', 'sztuk')}
        </span>
      </div>

      <div className={styles.layout}>
        <div className={styles.items}>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className={styles.row}>
              <div className={styles.rowInfo}>
                <Link to={`/products/${product.id}`} className={styles.rowName}>
                  {product.name}
                </Link>
                <span className={styles.rowUnit}>
                  {product.price.toFixed(2)} PLN / szt.
                </span>
              </div>

              <div className={styles.rowControls}>
                <div className={styles.qty}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQty(product.id, quantity - 1)}
                  >−</button>
                  <span className={styles.qtyVal}>{quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQty(product.id, quantity + 1)}
                  >+</button>
                </div>

                <span className={styles.rowTotal}>
                  {(product.price * quantity).toFixed(2)} PLN
                </span>

                <button
                  className={styles.removeBtn}
                  onClick={() => remove(product.id)}
                  title="Usuń"
                >✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Podsumowanie</h2>

          <div className={styles.summaryLines}>
            {items.map(({ product, quantity }) => (
              <div key={product.id} className={styles.summaryLine}>
                <span className={styles.summaryLineName}>
                  {product.name} × {quantity}
                </span>
                <span>{(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className={styles.summaryTotal}>
            <span>Suma</span>
            <span className={styles.totalAmount}>{total.toFixed(2)} PLN</span>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Składanie zamówienia...' : 'Złóż zamówienie'}
          </button>

          <button
            className="btn btn-ghost"
            style={{ width: '100%' }}
            onClick={clear}
          >
            Wyczyść koszyk
          </button>

          <p className={styles.notice}>
            Zalogowano jako <span>{user?.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}