import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types';
import styles from './MyProductsPage.module.css';

type FormState = { name: string; price: string; description: string };
const empty: FormState = { name: '', price: '', description: '' };

export default function MyProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const myProducts = products.filter((p) => p.ownerId === user?.id);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(empty);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), description: p.description });
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(empty);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const price = parseFloat(form.price);
    if (!form.name.trim()) return setFormError('Name is required.');
    if (isNaN(price) || price <= 0) return setFormError('Enter a valid price.');

    setSubmitting(true);
    try {
      const payload = { name: form.name.trim(), price, description: form.description.trim() };
      if (editingId !== null) {
        const res = await updateProduct(editingId, payload);
        setProducts((prev) => prev.map((p) => (p.id === editingId ? res.data : p)));
      } else {
        await createProduct(payload);
        const all = await getProducts();
        setProducts(all.data);
      }
      closeForm();
    } catch {
      setFormError('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My listings</h1>
          <p className={styles.sub}>{myProducts.length} product{myProducts.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New listing</button>
      </div>

      {error && <p className="error-msg" style={{ marginBottom: 16 }}>{error}</p>}

      {showForm && (
        <div className={styles.overlay} onClick={closeForm}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingId !== null ? 'Edit listing' : 'New listing'}</h2>
              <button className={styles.closeBtn} onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Product name"
                  maxLength={100}
                  required
                  autoFocus
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Price (PLN)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your product..."
                  maxLength={1000}
                  rows={4}
                  className={styles.textarea}
                />
              </div>
              {formError && <p className="error-msg">{formError}</p>}
              <div className={styles.formActions}>
                <button type="button" className="btn btn-ghost" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId !== null ? 'Save changes' : 'Create listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingId !== null && (
        <div className={styles.overlay} onClick={() => setDeletingId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Delete listing?</h2>
              <button className={styles.closeBtn} onClick={() => setDeletingId(null)}>✕</button>
            </div>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>This can't be undone.</p>
            <div className={styles.formActions}>
              <button className="btn btn-ghost" onClick={() => setDeletingId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deletingId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {loading && <p className={styles.state}>Loading...</p>}

      {!loading && myProducts.length === 0 && (
        <div className={styles.empty}>
          <p>You have no listings yet.</p>
          <button className="btn btn-primary" onClick={openCreate}>Create your first listing</button>
        </div>
      )}

      <div className={styles.list}>
        {myProducts.map((p) => (
          <div key={p.id} className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowName}>{p.name}</span>
              <span className={styles.rowDesc}>{p.description || '—'}</span>
            </div>
            <span className={styles.rowPrice}>{p.price.toFixed(2)} PLN</span>
            <div className={styles.rowActions}>
              <button className="btn btn-ghost" onClick={() => openEdit(p)}>Edit</button>
              <button className="btn btn-danger" onClick={() => setDeletingId(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}