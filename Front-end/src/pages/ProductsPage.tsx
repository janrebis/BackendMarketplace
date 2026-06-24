import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { Product, ProductCategory } from '../types';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../types';
import { pluralPl } from '../utils/pluralize';
import { resolveAssetUrl } from '../utils/assetUrl';
import styles from './ProductsPage.module.css';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name-asc';
type CategoryFilter = ProductCategory | 'all';

export default function ProductsPage() {
  const { user } = useAuth();
  const { add } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setError('Nie udało się wczytać produktów.'))
      .finally(() => setLoading(false));
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ProductCategory, number>> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (minPrice !== '') {
      result = result.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter((p) => p.price <= parseFloat(maxPrice));
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, search, sort, minPrice, maxPrice, category]);

  const clearFilters = () => {
    setSearch('');
    setSort('default');
    setMinPrice('');
    setMaxPrice('');
    setCategory('all');
  };

  const hasFilters = search || sort !== 'default' || minPrice || maxPrice || category !== 'all';

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    add(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId((current) => (current === product.id ? null : current)), 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Przeglądaj ogłoszenia</h1>
        <span className={styles.count}>
          {filtered.length} {pluralPl(filtered.length, 'wynik', 'wyniki', 'wyników')}
        </span>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Kategorie</h2>
          <button
            className={`${styles.categoryItem} ${category === 'all' ? styles.categoryItemActive : ''}`}
            onClick={() => setCategory('all')}
          >
            <span>Wszystkie</span>
            <span className={styles.categoryCount}>{products.length}</span>
          </button>
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              className={`${styles.categoryItem} ${category === c ? styles.categoryItemActive : ''}`}
              onClick={() => setCategory(c)}
            >
              <span>{CATEGORY_LABELS[c]}</span>
              <span className={styles.categoryCount}>{categoryCounts[c] ?? 0}</span>
            </button>
          ))}
        </aside>

        <div className={styles.content}>
          <div className={styles.toolbar}>
            <input
              className={styles.search}
              type="text"
              placeholder="Szukaj produktów..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className={styles.filters}>
              <input
                type="number"
                placeholder="Cena min."
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className={styles.priceInput}
                min="0"
              />
              <input
                type="number"
                placeholder="Cena maks."
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={styles.priceInput}
                min="0"
              />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className={styles.select}
              >
                <option value="default">Sortuj: domyślnie</option>
                <option value="price-asc">Cena: od najniższej</option>
                <option value="price-desc">Cena: od najwyższej</option>
                <option value="name-asc">Nazwa: A–Z</option>
              </select>

              {hasFilters && (
                <button className="btn btn-ghost" onClick={clearFilters}>
                  Wyczyść
                </button>
              )}
            </div>
          </div>

          {loading && <p className={styles.state}>Wczytywanie...</p>}
          {error && <p className="error-msg">{error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <div className={styles.empty}>
              <p>Nie znaleziono produktów.</p>
              {hasFilters && (
                <button className="btn btn-ghost" onClick={clearFilters}>
                  Wyczyść filtry
                </button>
              )}
            </div>
          )}

          <div className={styles.grid}>
            {filtered.map((product) => {
              const canAddToCart = user && product.ownerId !== user.id;

              return (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className={styles.card}
                >
                  {product.imageUrl ? (
                    <img
                      className={styles.cardImage}
                      src={resolveAssetUrl(product.imageUrl)}
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.cardImagePlaceholder}>📦</div>
                  )}
                  <div className={styles.cardBody}>
                    <span className={styles.cardCategory}>{CATEGORY_LABELS[product.category]}</span>
                    <h2 className={styles.cardName}>{product.name}</h2>
                    <p className={styles.cardDesc}>{product.description}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>
                      {product.price.toFixed(2)} <span className={styles.currency}>PLN</span>
                    </span>
                    {canAddToCart ? (
                      <button
                        className={`btn btn-primary ${styles.quickAddBtn}`}
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        {addedId === product.id ? '✓ Dodano' : 'Dodaj do koszyka'}
                      </button>
                    ) : (
                      <span className={styles.viewLink}>Zobacz →</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}