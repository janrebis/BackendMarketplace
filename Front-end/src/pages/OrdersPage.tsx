import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import type { Order } from '../types';
import { pluralPl } from '../utils/pluralize';
import styles from './OrdersPage.module.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setError('Nie udało się wczytać zamówień.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Historia zamówień</h1>
        <span className={styles.count}>
          {orders.length} {pluralPl(orders.length, 'zamówienie', 'zamówienia', 'zamówień')}
        </span>
      </div>

      {loading && <p className={styles.state}>Wczytywanie...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className={styles.empty}>
          <p>Nie masz jeszcze żadnych zamówień.</p>
          <Link to="/" className="btn btn-primary">Przeglądaj ogłoszenia</Link>
        </div>
      )}

      <div className={styles.list}>
        {orders.map((order) => (
          <div key={order.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.orderId}>Zamówienie #{order.id}</span>
              <span className={styles.orderDate}>
                {new Date(order.createdAt).toLocaleString('pl-PL')}
              </span>
            </div>

            <div className={styles.itemsList}>
              {order.items.map((item) => (
                <div key={item.productId} className={styles.itemRow}>
                  <Link to={`/products/${item.productId}`} className={styles.itemName}>
                    {item.productName} × {item.quantity}
                  </Link>
                  <span className={styles.itemPrice}>{item.lineTotal.toFixed(2)} PLN</span>
                </div>
              ))}
            </div>

            <div className={styles.cardFooter}>
              <span>Suma</span>
              <span className={styles.totalAmount}>{order.totalPrice.toFixed(2)} PLN</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
