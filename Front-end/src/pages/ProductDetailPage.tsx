import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { CATEGORY_LABELS } from '../types';
import { resolveAssetUrl } from '../utils/assetUrl';
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
      .catch(() => setError('Produktu nie znaleziono.'))
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

  if (loading) return <div className={styles.state}>Wczytywanie...</div>;
  if (error || !product) return <div className={styles.state}><p className="error-msg">{error || 'Nie znaleziono.'}</p></div>;

  return (
    <div className={styles.page}>
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
        ← Wróć
      </button>

      <div className={styles.layout}>
        <div className={styles.main}>
          {product.imageUrl ? (
            <img className={styles.image} src={resolveAssetUrl(product.imageUrl)} alt={product.name} />
          ) : (
            <div className={styles.imagePlaceholder}>📦</div>
          )}
          <div className={styles.tag}>{CATEGORY_LABELS[product.category]} · Produkt #{product.id}</div>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.desc}>{product.description || 'Brak opisu.'}</p>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.priceBox}>
            <span className={styles.price}>{product.price.toFixed(2)}</span>
            <span className={styles.currency}>PLN</span>
          </div>

          {isOwner ? (
            <div className={styles.ownerNote}>
              <span>To Twoje ogłoszenie.</span>
              <button
                className="btn btn-ghost"
                onClick={() => navigate('/my-products')}
                style={{ width: '100%' }}
              >
                Zarządzaj w Moich ogłoszeniach →
              </button>
            </div>
          ) : user ? (
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? '✓ Dodano do koszyka' : inCart ? 'Dodaj ponownie' : 'Dodaj do koszyka'}
            </button>
          ) : (
            <button
              className="btn btn-ghost"
              style={{ width: '100%' }}
              onClick={() => navigate('/login')}
            >
              Zaloguj się, aby kupić
            </button>
          )}
        </div>
      </div>
    </div>
  );
}