import { useEffect, useState } from 'react';
import axios from 'axios';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { uploadProductImage } from '../api/uploads';
import { useAuth } from '../context/AuthContext';
import type { Product, ProductCategory } from '../types';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../types';
import { pluralPl } from '../utils/pluralize';
import { resolveAssetUrl } from '../utils/assetUrl';
import styles from './MyProductsPage.module.css';

type FormState = {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  imageFile: File | null;
  category: ProductCategory;
};
const empty: FormState = {
  name: '',
  price: '',
  description: '',
  imageUrl: '',
  imageFile: null,
  category: ALL_CATEGORIES[0],
};

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && typeof err.response?.data?.message === 'string') {
    return err.response.data.message;
  }
  return fallback;
}

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
  const [previewUrl, setPreviewUrl] = useState('');

  const myProducts = products.filter((p) => p.ownerId === user?.id);

  useEffect(() => {
    if (form.imageFile) {
      const objectUrl = URL.createObjectURL(form.imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(form.imageUrl ? resolveAssetUrl(form.imageUrl) : '');
  }, [form.imageFile, form.imageUrl]);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setError('Nie udało się wczytać produktów.'))
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
    setForm({
      name: p.name,
      price: String(p.price),
      description: p.description,
      imageUrl: p.imageUrl,
      imageFile: null,
      category: p.category,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFormError('Dozwolone są tylko pliki graficzne (JPG, PNG, GIF, WEBP).');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setFormError('Plik jest zbyt duży. Maksymalny rozmiar to 5 MB.');
      e.target.value = '';
      return;
    }

    setFormError('');
    setForm((f) => ({ ...f, imageFile: file }));
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
    if (!form.name.trim()) return setFormError('Nazwa jest wymagana.');
    if (isNaN(price) || price <= 0) return setFormError('Podaj prawidłową cenę.');

    setSubmitting(true);
    try {
      let imageUrl = form.imageUrl;
      if (form.imageFile) {
        const uploadRes = await uploadProductImage(form.imageFile);
        imageUrl = uploadRes.data.url;
      }

      const payload = {
        name: form.name.trim(),
        price,
        description: form.description.trim(),
        imageUrl,
        category: form.category,
      };
      if (editingId !== null) {
        const res = await updateProduct(editingId, payload);
        setProducts((prev) => prev.map((p) => (p.id === editingId ? res.data : p)));
      } else {
        await createProduct(payload);
        const all = await getProducts();
        setProducts(all.data);
      }
      closeForm();
    } catch (err) {
      setFormError(getErrorMessage(err, 'Coś poszło nie tak. Spróbuj ponownie.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Nie udało się usunąć produktu.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Moje ogłoszenia</h1>
          <p className={styles.sub}>
            {myProducts.length} {pluralPl(myProducts.length, 'produkt', 'produkty', 'produktów')}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nowe ogłoszenie</button>
      </div>

      {error && <p className="error-msg" style={{ marginBottom: 16 }}>{error}</p>}

      {showForm && (
        <div className={styles.overlay} onClick={closeForm}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingId !== null ? 'Edytuj ogłoszenie' : 'Nowe ogłoszenie'}</h2>
              <button className={styles.closeBtn} onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Nazwa</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nazwa produktu"
                  maxLength={100}
                  required
                  autoFocus
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Cena (PLN)</label>
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
                <label className={styles.label}>Kategoria</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))}
                >
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Opis</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Opisz swój produkt..."
                  maxLength={1000}
                  rows={4}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Zdjęcie</label>
                {previewUrl && (
                  <img src={previewUrl} alt="Podgląd zdjęcia" className={styles.imagePreview} />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                />
                <span className={styles.hint}>JPG, PNG, GIF lub WEBP, maks. 5 MB.</span>
              </div>
              {formError && <p className="error-msg">{formError}</p>}
              <div className={styles.formActions}>
                <button type="button" className="btn btn-ghost" onClick={closeForm}>Anuluj</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Zapisywanie...' : editingId !== null ? 'Zapisz zmiany' : 'Utwórz ogłoszenie'}
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
              <h2>Usunąć ogłoszenie?</h2>
              <button className={styles.closeBtn} onClick={() => setDeletingId(null)}>✕</button>
            </div>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Tej operacji nie można odwrócić.</p>
            <div className={styles.formActions}>
              <button className="btn btn-ghost" onClick={() => setDeletingId(null)}>Anuluj</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deletingId)}>Usuń</button>
            </div>
          </div>
        </div>
      )}

      {loading && <p className={styles.state}>Wczytywanie...</p>}

      {!loading && myProducts.length === 0 && (
        <div className={styles.empty}>
          <p>Nie masz jeszcze żadnych ogłoszeń.</p>
          <button className="btn btn-primary" onClick={openCreate}>Utwórz swoje pierwsze ogłoszenie</button>
        </div>
      )}

      <div className={styles.list}>
        {myProducts.map((p) => (
          <div key={p.id} className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowName}>{p.name}</span>
              <span className={styles.rowDesc}>{CATEGORY_LABELS[p.category]} · {p.description || '—'}</span>
            </div>
            <span className={styles.rowPrice}>{p.price.toFixed(2)} PLN</span>
            <div className={styles.rowActions}>
              <button className="btn btn-ghost" onClick={() => openEdit(p)}>Edytuj</button>
              <button className="btn btn-danger" onClick={() => setDeletingId(p.id)}>Usuń</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}