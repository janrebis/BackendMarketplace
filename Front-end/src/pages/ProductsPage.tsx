import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import type { Product } from '../types';
import styles from './ProductsPage.module.css';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

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
  }, [products, search, sort, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearch('');
    setSort('default');
    setMinPrice('');
    setMaxPrice('');
  };

  const hasFilters = search || sort !== 'default' || minPrice || maxPrice;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Browse listings</h1>
        <span className={styles.count}>{filtered.length} results</span>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.filters}>
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className={styles.priceInput}
            min="0"
          />
          <input
            type="number"
            placeholder="Max price"
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
            <option value="default">Sort: default</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name: A–Z</option>
          </select>

          {hasFilters && (
            <button className="btn btn-ghost" onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>
      </div>

      {loading && <p className={styles.state}>Loading...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className={styles.empty}>
          <p>No products found.</p>
          {hasFilters && (
            <button className="btn btn-ghost" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className={styles.grid}>
        {filtered.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className={styles.card}
          >
            <div className={styles.cardBody}>
              <h2 className={styles.cardName}>{product.name}</h2>
              <p className={styles.cardDesc}>{product.description}</p>
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.price}>
                {product.price.toFixed(2)} <span className={styles.currency}>PLN</span>
              </span>
              <span className={styles.viewLink}>View →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}