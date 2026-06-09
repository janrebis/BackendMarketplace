import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, remove, updateQty, clear, total, count } = useCart();
  const { user } = useAuth();
  const [ordered, setOrdered] = useState(false);
  const [loading, setLoading] = useState(false);

  // NOTE: Order placement is a local simulation until the backend implements
  // POST /api/orders. When that endpoint exists, replace the setTimeout below
  // with an actual API call using the Order type from types.ts.
  const handleCheckout = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 900));
    clear();
    setOrdered(true);
    setLoading(false);
  };

  if (ordered) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <span className={styles.successIcon}>✓</span>
          <h1 className={styles.successTitle}>Order placed!</h1>
          <p className={styles.successSub}>
            Your order has been received. Thanks for shopping on MRKT.
          </p>
          <div className={styles.successActions}>
            <Link to="/" className="btn btn-primary">Browse more</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <h1 className={styles.title}>Your cart</h1>
          <p>Nothing here yet.</p>
          <Link to="/" className="btn btn-primary">Browse listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your cart</h1>
        <span className={styles.count}>{count} item{count !== 1 ? 's' : ''}</span>
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
                  {product.price.toFixed(2)} PLN / unit
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
                  title="Remove"
                >✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Summary</h2>

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
            <span>Total</span>
            <span className={styles.totalAmount}>{total.toFixed(2)} PLN</span>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Placing order...' : 'Place order'}
          </button>

          <button
            className="btn btn-ghost"
            style={{ width: '100%' }}
            onClick={clear}
          >
            Clear cart
          </button>

          <p className={styles.notice}>
            Logged in as <span>{user?.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}