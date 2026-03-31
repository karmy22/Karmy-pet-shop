import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AccountShell from '../components/accountShell';
import {
  listOrders,
  updateOrderStatus,
  updateShipment,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductVisibility,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryVisibility,
} from '../api/adminApi';
import { useAuth } from '../context/authContext';

const ORDER_STATUSES = ['pending', 'confirmed', 'fulfilled', 'cancelled'];
const SPECIES_OPTIONS = ['dog', 'cat', 'bird', 'fish', 'small-animals', 'reptile', 'both'];
const SHIPMENT_STATUSES = ['not_shipped', 'in_transit', 'delivered', 'exception'];

const EMPTY_PRODUCT = { name: '', description: '', species: 'dog', category: '', price: '', stock: '0', badges: '', seasonalCollection: '', isActive: true };
const EMPTY_CATEGORY = { name: '', description: '', species: 'dog', isActive: true, seasonalVisible: true };

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('orders');

  // ── Orders ───────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersMsg, setOrdersMsg] = useState('');
  const [ordersErr, setOrdersErr] = useState('');

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const token = await user.getIdToken();
      const data = await listOrders(token);
      setOrders(data.orders || []);
      setOrdersErr('');
    } catch (err) {
      setOrdersErr(err.message || 'Unable to load orders.');
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  // ── Products ─────────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsMsg, setProductsMsg] = useState('');
  const [productsErr, setProductsErr] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productEditing, setProductEditing] = useState(null);
  const [productSaving, setProductSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const token = await user.getIdToken();
      const data = await listProducts(token);
      setProducts(data.products || []);
      setProductsErr('');
    } catch (err) {
      setProductsErr(err.message || 'Unable to load products.');
    } finally {
      setProductsLoading(false);
    }
  }, [user]);

  // ── Categories ───────────────────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [catsMsg, setCatsMsg] = useState('');
  const [catsErr, setCatsErr] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [catForm, setCatForm] = useState(EMPTY_CATEGORY);
  const [showCatForm, setShowCatForm] = useState(false);
  const [categoryEditing, setCategoryEditing] = useState(null);
  const [catSaving, setCatSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCategories = useCallback(async () => {
    setCatsLoading(true);
    try {
      const token = await user.getIdToken();
      const data = await listCategories(token);
      setCategories(data.categories || []);
      setCatsErr('');
    } catch (err) {
      setCatsErr(err.message || 'Unable to load categories.');
    } finally {
      setCatsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchOrders();
    fetchProducts();
    fetchCategories();
  }, [user, fetchOrders, fetchProducts, fetchCategories]);

  const visibleProducts = useMemo(() => products.filter((p) => {
    const matchFilter = productFilter === 'all' || (productFilter === 'active' ? p.isActive : !p.isActive);
    const q = productSearch.toLowerCase();
    return matchFilter && (!q || p.name.toLowerCase().includes(q) || (p.slug || '').toLowerCase().includes(q));
  }), [products, productFilter, productSearch]);

  const visibleCategories = useMemo(() => categories.filter((c) => {
    const matchFilter = categoryFilter === 'all' || (categoryFilter === 'active' ? c.isActive : !c.isActive);
    const q = categorySearch.toLowerCase();
    return matchFilter && (!q || c.name.toLowerCase().includes(q) || (c.slug || '').toLowerCase().includes(q));
  }), [categories, categoryFilter, categorySearch]);

  // ── Order handlers ────────────────────────────────────────────────────────
  async function handleStatusChange(orderId, status) {
    setOrdersMsg('');
    setOrdersErr('');
    try {
      const token = await user.getIdToken();
      const data = await updateOrderStatus(orderId, status, token);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
      setOrdersMsg(`Order #${orderId.slice(-8).toUpperCase()} → ${status}.`);
    } catch (err) {
      setOrdersErr(err.message || 'Unable to update order status.');
    }
  }

  // ── Product handlers ──────────────────────────────────────────────────────
  async function handleSaveProduct(event) {
    event.preventDefault();
    setProductsMsg('');
    setProductsErr('');
    setProductSaving(true);
    try {
      const token = await user.getIdToken();
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        badges: typeof productForm.badges === 'string'
          ? productForm.badges.split(',').map((b) => b.trim()).filter(Boolean)
          : productForm.badges || [],
      };
      if (productEditing) {
        const data = await updateProduct(productEditing, payload, token);
        setProducts((prev) => prev.map((p) => (p._id === productEditing ? data.product : p)));
        setProductsMsg(`"${data.product.name}" updated.`);
      } else {
        const data = await createProduct(payload, token);
        setProducts((prev) => [data.product, ...prev]);
        setProductsMsg(`"${data.product.name}" added.`);
      }
      setProductForm(EMPTY_PRODUCT);
      setProductEditing(null);
      setShowProductForm(false);
    } catch (err) {
      setProductsErr(err.message || 'Unable to save product.');
    } finally {
      setProductSaving(false);
    }
  }

  async function handleToggleProduct(product) {
    setProductsMsg('');
    setProductsErr('');
    try {
      const token = await user.getIdToken();
      const data = await toggleProductVisibility(product._id, !product.isActive, token);
      setProducts((prev) => prev.map((p) => (p._id === product._id ? data.product : p)));
      setProductsMsg(`"${data.product.name}" is now ${data.product.isActive ? 'visible' : 'hidden'}.`);
    } catch (err) {
      setProductsErr(err.message || 'Unable to update product visibility.');
    }
  }

  async function handleDeleteProduct(id, name) {
    setProductsMsg('');
    setProductsErr('');
    try {
      const token = await user.getIdToken();
      await deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setProductsMsg(`"${name}" deleted.`);
    } catch (err) {
      setProductsErr(err.message || 'Unable to delete product.');
    } finally {
      setDeleteConfirm(null);
    }
  }

  // ── Category handlers ─────────────────────────────────────────────────────
  async function handleSaveCategory(event) {
    event.preventDefault();
    setCatsMsg('');
    setCatsErr('');
    setCatSaving(true);
    try {
      const token = await user.getIdToken();
      if (categoryEditing) {
        const data = await updateCategory(categoryEditing, catForm, token);
        setCategories((prev) => prev.map((c) => (c._id === categoryEditing ? data.category : c)));
        setCatsMsg(`"${data.category.name}" updated.`);
      } else {
        const data = await createCategory(catForm, token);
        setCategories((prev) => [...prev, data.category].sort((a, b) => a.name.localeCompare(b.name)));
        setCatsMsg(`"${data.category.name}" added.`);
      }
      setCatForm(EMPTY_CATEGORY);
      setCategoryEditing(null);
      setShowCatForm(false);
    } catch (err) {
      setCatsErr(err.message || 'Unable to save category.');
    } finally {
      setCatSaving(false);
    }
  }

  async function handleToggleCategory(cat) {
    setCatsMsg('');
    setCatsErr('');
    try {
      const token = await user.getIdToken();
      const data = await toggleCategoryVisibility(cat._id, !cat.isActive, token);
      setCategories((prev) => prev.map((c) => (c._id === cat._id ? data.category : c)));
      setCatsMsg(`"${data.category.name}" is now ${data.category.isActive ? 'visible' : 'hidden'}.`);
    } catch (err) {
      setCatsErr(err.message || 'Unable to update category visibility.');
    }
  }

  async function handleDeleteCategory(id, name) {
    setCatsMsg('');
    setCatsErr('');
    try {
      const token = await user.getIdToken();
      await deleteCategory(id, token);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      setProducts((prev) => prev.filter((p) => (p.category?._id || p.category) !== id));
      setCatsMsg(`"${name}" and its products deleted.`);
    } catch (err) {
      setCatsErr(err.message || 'Unable to delete category.');
    } finally {
      setDeleteConfirm(null);
    }
  }

  async function handleShipmentUpdate(orderId, payload) {
    setOrdersMsg('');
    setOrdersErr('');
    try {
      const token = await user.getIdToken();
      const data = await updateShipment(orderId, payload, token);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
      setOrdersMsg(`Shipment updated for ${orderId.slice(-8).toUpperCase()}.`);
    } catch (err) {
      setOrdersErr(err.message || 'Unable to update shipment.');
    }
  }

  return (
    <>
    {deleteConfirm && (
      <div style={overlayStyle}>
        <div style={dialogStyle}>
          <p style={{ fontWeight: 700, margin: '0 0 8px' }}>Confirm delete</p>
          {deleteConfirm.type === 'category' ? (
            <p style={{ color: '#9b3434', fontSize: '.9rem', margin: '0 0 16px' }}>
              Deleting <strong>{deleteConfirm.name}</strong> will permanently remove this category and <em>all products inside it</em>. Consider hiding it instead.
            </p>
          ) : (
            <p style={{ fontSize: '.9rem', margin: '0 0 16px' }}>
              Permanently delete <strong>{deleteConfirm.name}</strong>? Consider hiding it from the storefront instead.
            </p>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={dangerBtnStyle}
              onClick={() => deleteConfirm.type === 'category'
                ? handleDeleteCategory(deleteConfirm.id, deleteConfirm.name)
                : handleDeleteProduct(deleteConfirm.id, deleteConfirm.name)
              }
            >
              Delete permanently
            </button>
            <button style={cancelBtnStyle} onClick={() => setDeleteConfirm(null)}>Cancel</button>
          </div>
        </div>
      </div>
    )}
    <AccountShell
      title="Admin dashboard"
      subtitle="Manage orders, products, and categories."
      activeTab="admin"
    >
      {/* Tab bar */}
      <div style={tabBarStyle}>
        {['orders', 'products', 'categories'].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={tabBtnStyle(tab === t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Orders ──────────────────────────────────────────────────────────── */}
      {tab === 'orders' && (
        <section>
          {ordersMsg && <p style={okStyle}>{ordersMsg}</p>}
          {ordersErr && <p style={errStyle}>{ordersErr}</p>}
          <div style={{ display: 'grid', gap: 12 }}>
            {ordersLoading && <p style={mutedStyle}>Loading orders…</p>}
            {!ordersLoading && orders.length === 0 && <p style={mutedStyle}>No orders found.</p>}
            {!ordersLoading &&
              orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusChange={handleStatusChange}
                  onShipmentUpdate={handleShipmentUpdate}
                />
              ))}
          </div>
        </section>
      )}

      {/* ── Products ─────────────────────────────────────────────────────────── */}
      {tab === 'products' && (
        <section>
          {productsMsg && <p style={okStyle}>{productsMsg}</p>}
          {productsErr && <p style={errStyle}>{productsErr}</p>}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search by name or slug…"
              style={searchInputStyle}
            />
            {['all', 'active', 'hidden'].map((f) => (
              <button key={f} style={chipStyle(productFilter === f)} onClick={() => setProductFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <button
              onClick={() => { setProductEditing(null); setProductForm(EMPTY_PRODUCT); setShowProductForm(true); }}
              style={{ ...addBtnStyle, marginLeft: 'auto' }}
            >
              + Add product
            </button>
          </div>

          {showProductForm && (
            <form onSubmit={handleSaveProduct} style={formCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={formHeadStyle}>{productEditing ? 'Edit product' : 'New product'}</h3>
                <button type="button" style={cancelBtnStyle} onClick={() => { setShowProductForm(false); setProductEditing(null); setProductForm(EMPTY_PRODUCT); }}>Cancel</button>
              </div>
              <div style={formGridStyle}>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Name *</span>
                  <input
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
                    style={inputStyle}
                  />
                </label>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Category *</span>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value }))}
                    style={selectStyle}
                  >
                    <option value="">— select —</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </label>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Species *</span>
                  <select
                    value={productForm.species}
                    onChange={(e) => setProductForm((f) => ({ ...f, species: e.target.value }))}
                    style={selectStyle}
                  >
                    {SPECIES_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Price ($) *</span>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
                    style={inputStyle}
                  />
                </label>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Stock</span>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm((f) => ({ ...f, stock: e.target.value }))}
                    style={inputStyle}
                  />
                </label>
              </div>
              <label style={fieldStyle}>
                <span style={labelStyle}>Description</span>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </label>
              <div style={formGridStyle}>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Badges (comma-sep)</span>
                  <input
                    value={typeof productForm.badges === 'string' ? productForm.badges : (productForm.badges || []).join(', ')}
                    onChange={(e) => setProductForm((f) => ({ ...f, badges: e.target.value }))}
                    placeholder="new, sale, popular"
                    style={inputStyle}
                  />
                </label>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Seasonal collection</span>
                  <input
                    value={productForm.seasonalCollection || ''}
                    onChange={(e) => setProductForm((f) => ({ ...f, seasonalCollection: e.target.value }))}
                    style={inputStyle}
                  />
                </label>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.85rem', fontWeight: 600 }}>
                <input type="checkbox" checked={!!productForm.isActive} onChange={(e) => setProductForm((f) => ({ ...f, isActive: e.target.checked }))} />
                Visible on storefront
              </label>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="submit" disabled={productSaving} style={saveBtnStyle}>
                  {productSaving ? 'Saving…' : (productEditing ? 'Save changes' : 'Add product')}
                </button>
              </div>
            </form>
          )}

          <div style={{ display: 'grid', gap: 10 }}>
            {productsLoading && <p style={mutedStyle}>Loading products…</p>}
            {!productsLoading && visibleProducts.length === 0 && <p style={mutedStyle}>No products match.</p>}
            {!productsLoading &&
              visibleProducts.map((product) => (
                <article key={product._id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div>
                      <strong>{product.name}</strong>
                      <span style={{ marginLeft: 8, color: 'var(--mid)', fontSize: '.82rem' }}>
                        {product.category?.name || '—'} · {product.species}
                      </span>
                    </div>
                    <span style={visibilityPill(product.isActive)}>
                      {product.isActive ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8 }}>
                    <Meta label="Price" value={`$${Number(product.price || 0).toFixed(2)}`} />
                    <Meta label="Stock" value={String(product.stock ?? 0)} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => handleToggleProduct(product)} style={toggleBtnStyle(product.isActive)}>
                      {product.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button
                      style={ghostBtnStyle}
                      onClick={() => {
                        setProductEditing(product._id);
                        setProductForm({
                          name: product.name,
                          description: product.description || '',
                          species: product.species,
                          category: product.category?._id || product.category || '',
                          price: String(product.price),
                          stock: String(product.stock || 0),
                          badges: (product.badges || []).join(', '),
                          seasonalCollection: product.seasonalCollection || '',
                          isActive: product.isActive,
                        });
                        setShowProductForm(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => setDeleteConfirm({ type: 'product', id: product._id, name: product.name })} style={deleteBtnStyle}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      )}

      {/* ── Categories ───────────────────────────────────────────────────────── */}
      {tab === 'categories' && (
        <section>
          {catsMsg && <p style={okStyle}>{catsMsg}</p>}
          {catsErr && <p style={errStyle}>{catsErr}</p>}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
            <input
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Search by name or slug…"
              style={searchInputStyle}
            />
            {['all', 'active', 'hidden'].map((f) => (
              <button key={f} style={chipStyle(categoryFilter === f)} onClick={() => setCategoryFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <button
              onClick={() => { setCategoryEditing(null); setCatForm(EMPTY_CATEGORY); setShowCatForm(true); }}
              style={{ ...addBtnStyle, marginLeft: 'auto' }}
            >
              + Add category
            </button>
          </div>

          {showCatForm && (
            <form onSubmit={handleSaveCategory} style={formCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={formHeadStyle}>{categoryEditing ? 'Edit category' : 'New category'}</h3>
                <button type="button" style={cancelBtnStyle} onClick={() => { setShowCatForm(false); setCategoryEditing(null); setCatForm(EMPTY_CATEGORY); }}>Cancel</button>
              </div>
              <div style={formGridStyle}>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Name *</span>
                  <input
                    required
                    value={catForm.name}
                    onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))}
                    style={inputStyle}
                  />
                </label>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Species *</span>
                  <select
                    value={catForm.species}
                    onChange={(e) => setCatForm((f) => ({ ...f, species: e.target.value }))}
                    style={selectStyle}
                  >
                    {SPECIES_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label style={fieldStyle}>
                <span style={labelStyle}>Description</span>
                <textarea
                  rows={2}
                  value={catForm.description}
                  onChange={(e) => setCatForm((f) => ({ ...f, description: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.85rem', fontWeight: 600 }}>
                <input type="checkbox" checked={!!catForm.isActive} onChange={(e) => setCatForm((f) => ({ ...f, isActive: e.target.checked }))} />
                Visible on storefront
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.85rem', fontWeight: 600 }}>
                <input type="checkbox" checked={!!catForm.seasonalVisible} onChange={(e) => setCatForm((f) => ({ ...f, seasonalVisible: e.target.checked }))} />
                Show in seasonal collections
              </label>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="submit" disabled={catSaving} style={saveBtnStyle}>
                  {catSaving ? 'Saving…' : (categoryEditing ? 'Save changes' : 'Add category')}
                </button>
              </div>
            </form>
          )}

          <div style={{ display: 'grid', gap: 10 }}>
            {catsLoading && <p style={mutedStyle}>Loading categories…</p>}
            {!catsLoading && visibleCategories.length === 0 && <p style={mutedStyle}>No categories match.</p>}
            {!catsLoading &&
              visibleCategories.map((cat) => (
                <article key={cat._id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div>
                      <strong>{cat.name}</strong>
                      <span style={{ marginLeft: 8, color: 'var(--mid)', fontSize: '.82rem' }}>{cat.species}</span>
                    </div>
                    <span style={visibilityPill(cat.isActive)}>
                      {cat.isActive ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  {cat.description && (
                    <p style={{ margin: 0, fontSize: '.88rem', color: 'var(--mid)' }}>{cat.description}</p>
                  )}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => handleToggleCategory(cat)} style={toggleBtnStyle(cat.isActive)}>
                      {cat.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button
                      style={ghostBtnStyle}
                      onClick={() => {
                        setCategoryEditing(cat._id);
                        setCatForm({
                          name: cat.name,
                          description: cat.description || '',
                          species: cat.species,
                          isActive: cat.isActive,
                          seasonalVisible: cat.seasonalVisible ?? true,
                        });
                        setShowCatForm(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => setDeleteConfirm({ type: 'category', id: cat._id, name: cat.name })} style={deleteBtnStyle}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      )}
    </AccountShell>
    </>
  );
}

// ── OrderCard ────────────────────────────────────────────────────────────────
function OrderCard({ order, onStatusChange, onShipmentUpdate }) {
  const [showShipment, setShowShipment] = useState(false);
  const [shipForm, setShipForm] = useState({
    carrier: order.shipment?.carrier || '',
    trackingNumber: order.shipment?.trackingNumber || '',
    shipmentStatus: order.shipment?.shipmentStatus || 'not_shipped',
    estimatedDelivery: order.shipment?.estimatedDelivery
      ? String(order.shipment.estimatedDelivery).slice(0, 10) : '',
  });

  function handleShipSubmit(e) {
    e.preventDefault();
    onShipmentUpdate(order._id, shipForm);
    setShowShipment(false);
  }

  const setShip = (key) => (e) => setShipForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <article style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <strong>{order.customer?.email || 'No email'} · #{order._id.slice(-8).toUpperCase()}</strong>
        <span style={statusPill(order.status)}>{order.status}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
        <Meta label="Placed" value={new Date(order.createdAt).toLocaleString()} />
        <Meta label="Items" value={String(Array.isArray(order.items) ? order.items.length : 0)} />
        <Meta label="Total" value={`$${Number(order.total || 0).toFixed(2)}`} />
        {order.shipment?.trackingNumber && (
          <Meta label="Tracking" value={`${order.shipment.carrier || ''} ${order.shipment.trackingNumber}`.trim()} />
        )}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label style={{ display: 'grid', gap: 6, maxWidth: 220 }}>
          <span style={labelStyle}>Update status</span>
          <select value={order.status} onChange={(e) => onStatusChange(order._id, e.target.value)} style={selectStyle}>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <button style={ghostBtnStyle} onClick={() => setShowShipment((v) => !v)}>
          {showShipment ? 'Cancel' : 'Update shipment'}
        </button>
      </div>
      {showShipment && (
        <form onSubmit={handleShipSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 12, background: 'rgba(74,124,138,.05)', borderRadius: 10 }}>
          <label style={fieldStyle}>
            <span style={labelStyle}>Carrier</span>
            <input value={shipForm.carrier} onChange={setShip('carrier')} placeholder="UPS, FedEx, USPS…" style={inputStyle} />
          </label>
          <label style={fieldStyle}>
            <span style={labelStyle}>Tracking number</span>
            <input value={shipForm.trackingNumber} onChange={setShip('trackingNumber')} style={inputStyle} />
          </label>
          <label style={fieldStyle}>
            <span style={labelStyle}>Shipment status</span>
            <select value={shipForm.shipmentStatus} onChange={setShip('shipmentStatus')} style={selectStyle}>
              {SHIPMENT_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </label>
          <label style={fieldStyle}>
            <span style={labelStyle}>Est. delivery</span>
            <input type="date" value={shipForm.estimatedDelivery} onChange={setShip('estimatedDelivery')} style={inputStyle} />
          </label>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" style={saveBtnStyle}>Save shipment</button>
          </div>
        </form>
      )}
    </article>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────
function Meta({ label, value }) {
  return (
    <div style={{ background: 'rgba(74,124,138,.06)', borderRadius: 10, padding: '8px 10px' }}>
      <div style={{ color: 'var(--mid)', fontSize: '.72rem' }}>{label}</div>
      <div style={{ fontSize: '.9rem', fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const ghostBtnStyle = {
  border: '1px solid var(--mist)',
  borderRadius: 8,
  padding: '6px 14px',
  fontSize: '.82rem',
  fontWeight: 600,
  cursor: 'pointer',
  background: 'transparent',
  color: 'var(--ink)',
};

const cancelBtnStyle = {
  background: 'transparent',
  color: 'var(--mid)',
  border: '1px solid var(--mist)',
  borderRadius: 10,
  padding: '7px 14px',
  fontSize: '.88rem',
  cursor: 'pointer',
};

const dangerBtnStyle = {
  background: '#c0392b',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '9px 16px',
  fontSize: '.9rem',
  fontWeight: 700,
  cursor: 'pointer',
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(20,30,35,.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
};

const dialogStyle = {
  background: '#fff',
  borderRadius: 16,
  padding: '24px 28px',
  maxWidth: 440,
  width: '90%',
  boxShadow: '0 20px 60px rgba(0,0,0,.25)',
};

const searchInputStyle = {
  border: '1px solid var(--mist)',
  borderRadius: 10,
  padding: '9px 11px',
  fontSize: '.88rem',
  color: 'var(--ink)',
  background: 'var(--white)',
  flex: '1 1 180px',
  maxWidth: 260,
  boxSizing: 'border-box',
};

function chipStyle(active) {
  return {
    padding: '5px 12px',
    borderRadius: 999,
    border: '1px solid',
    borderColor: active ? 'var(--teal)' : 'var(--mist)',
    background: active ? 'rgba(74,124,138,.1)' : 'transparent',
    color: active ? 'var(--teal)' : 'var(--mid)',
    fontWeight: active ? 700 : 400,
    cursor: 'pointer',
    fontSize: '.82rem',
  };
}

// ── Style helpers ────────────────────────────────────────────────────────────
function statusPill(status) {
  const map = {
    pending: { background: '#fff2dd', color: '#9a5b19' },
    confirmed: { background: '#e8f4ff', color: '#1f5c86' },
    fulfilled: { background: '#e6f7ea', color: '#24663a' },
    cancelled: { background: '#ffe8e8', color: '#8b2d2d' },
  };
  return { ...pillBase, ...(map[status] || { background: '#f0f2f3', color: '#40525a' }) };
}

function visibilityPill(isActive) {
  return {
    ...pillBase,
    ...(isActive
      ? { background: '#e6f7ea', color: '#24663a' }
      : { background: '#f0f2f3', color: '#5c6b75' }),
  };
}

function toggleBtnStyle(isCurrentlyVisible) {
  return {
    border: `1px solid ${isCurrentlyVisible ? 'rgba(74,124,138,.35)' : 'rgba(36,102,58,.35)'}`,
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: '.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    background: isCurrentlyVisible ? 'rgba(74,124,138,.08)' : 'rgba(36,102,58,.08)',
    color: isCurrentlyVisible ? 'var(--teal)' : '#24663a',
  };
}

const pillBase = {
  borderRadius: 999,
  padding: '4px 10px',
  fontSize: '.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  whiteSpace: 'nowrap',
};

const tabBarStyle = {
  display: 'flex',
  gap: 6,
  marginBottom: 20,
  borderBottom: '2px solid rgba(74,124,138,.15)',
  paddingBottom: 0,
};

function tabBtnStyle(active) {
  return {
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
    padding: '8px 16px',
    fontSize: '.92rem',
    fontWeight: active ? 700 : 500,
    color: active ? 'var(--teal)' : 'var(--mid)',
    cursor: 'pointer',
    marginBottom: -2,
  };
}

const cardStyle = {
  background: 'rgba(255,255,255,.92)',
  border: '1px solid rgba(74,124,138,.2)',
  borderRadius: 16,
  boxShadow: '0 12px 24px rgba(36,58,68,.08)',
  padding: '14px 16px',
  display: 'grid',
  gap: 12,
};

const formCardStyle = {
  background: 'rgba(74,124,138,.04)',
  border: '1px solid rgba(74,124,138,.2)',
  borderRadius: 16,
  padding: 20,
  marginBottom: 16,
  display: 'grid',
  gap: 14,
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 12,
};

const formHeadStyle = {
  margin: 0,
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--ink)',
};

const fieldStyle = {
  display: 'grid',
  gap: 5,
};

const labelStyle = {
  fontSize: '.78rem',
  fontWeight: 700,
  color: 'var(--mid)',
  textTransform: 'uppercase',
  letterSpacing: '.04em',
};

const inputStyle = {
  border: '1px solid var(--mist)',
  borderRadius: 10,
  padding: '10px 11px',
  fontSize: '.9rem',
  color: 'var(--ink)',
  background: 'var(--white)',
  width: '100%',
  boxSizing: 'border-box',
};

const selectStyle = {
  border: '1px solid var(--mist)',
  borderRadius: 10,
  padding: '10px 11px',
  fontSize: '.9rem',
  color: 'var(--ink)',
  background: 'var(--white)',
  width: '100%',
};

const addBtnStyle = {
  background: 'var(--teal)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '9px 18px',
  fontSize: '.88rem',
  fontWeight: 700,
  cursor: 'pointer',
};

const saveBtnStyle = {
  background: 'var(--teal)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '10px 22px',
  fontSize: '.9rem',
  fontWeight: 700,
  cursor: 'pointer',
};

const deleteBtnStyle = {
  border: '1px solid rgba(155,52,52,.35)',
  borderRadius: 8,
  padding: '6px 14px',
  fontSize: '.82rem',
  fontWeight: 600,
  cursor: 'pointer',
  background: 'rgba(155,52,52,.06)',
  color: '#9b3434',
};

const mutedStyle = { margin: 0, color: 'var(--mid)' };

const okStyle = {
  marginTop: 0,
  marginBottom: 10,
  background: '#e8f8eb',
  border: '1px solid #bde5c5',
  color: '#245f34',
  borderRadius: 10,
  padding: '10px 12px',
};

const errStyle = {
  marginTop: 0,
  marginBottom: 10,
  background: '#fff1f1',
  border: '1px solid #e9baba',
  color: '#9b3434',
  borderRadius: 10,
  padding: '10px 12px',
};
