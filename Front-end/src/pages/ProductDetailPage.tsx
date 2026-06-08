import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { add, items } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProductById(Number(id))
      .then((res) => setProduct(res.data))
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user && product && user.id === product.ownerId;
  const inCart = items.some((i) => i.product.id === product?.id);

  const handleAddToCart = () => {
    if (!product) return;
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className={styles.state}>Loading...</div>;
  if (error || !product) return <div className={styles.state}><p className="error-msg">{error || 'Not found.'}</p></div>;

  return (
    <div className={styles.page}>
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
        ← Back
      </button>

      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.tag}>Product #{product.id}</div>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.desc}>{product.description || 'No description provided.'}</p>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.priceBox}>
            <span className={styles.price}>{product.price.toFixed(2)}</span>
            <span className={styles.currency}>PLN</span>
          </div>

          {isOwner ? (
            <div className={styles.ownerNote}>
              <span>This is your listing.</span>
              <button
                className="btn btn-ghost"
                onClick={() => navigate('/my-products')}
                style={{ width: '100%' }}
              >
                Manage in My listings →
              </button>
            </div>
          ) : user ? (
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? '✓ Added to cart' : inCart ? 'Add again' : 'Add to cart'}
            </button>
          ) : (
            <button
              className="btn btn-ghost"
              style={{ width: '100%' }}
              onClick={() => navigate('/login')}
            >
              Login to buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}