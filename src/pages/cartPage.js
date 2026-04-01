import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import SiteFooter from '../components/siteFooter';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';
import { createOrder } from '../api/orderApi';

function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, itemCount, subtotal, changeQuantity, removeItem, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState('');

  async function handleCheckout() {
    setCheckoutError('');
    setCheckoutSuccess('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!items.length) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const payloadItems = items.map((item) => ({
        type: item.type,
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        meta: item.meta || {},
      }));

      const response = await createOrder({
        items: payloadItems,
        token,
        shipping: 0,
      });

      clearCart();
      setCheckoutSuccess(`Order placed successfully: ${response.order?._id || 'created'}`);
    } catch (error) {
      setCheckoutError(error.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)' }}>
      <Navbar />
      <main style={{ padding: '40px 6% 72px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ marginBottom: 26 }}>
          <div style={{ marginBottom: 12, color: 'var(--terracotta)', fontSize: '.82rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            Shopping Cart
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 5vw, 4rem)', margin: '0 0 10px' }}>
            {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </h1>
          <p style={{ color: 'var(--mid)', margin: 0, lineHeight: 1.7 }}>
            Review your products and custom kits before checkout.
          </p>
        </div>

        {items.length === 0 ? (
          <section style={{ background: 'rgba(255,255,255,.9)', border: '1px solid rgba(74,124,138,.18)', borderRadius: 14, padding: 24 }}>
            <p style={{ color: 'var(--mid)', marginTop: 0 }}>Add products from category pages or create a custom kit from the builder.</p>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--ink)', fontWeight: 700 }}>
              Return to store home
            </Link>
          </section>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {items.map((item) => (
              <article key={`${item.type}-${item.id}`} style={{ background: 'rgba(255,255,255,.9)', border: '1px solid rgba(74,124,138,.18)', borderRadius: 14, padding: 20, display: 'grid', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'start', flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ margin: '0 0 6px', fontSize: '1.2rem' }}>{item.name}</h2>
                    {item.type === 'product' ? (
                      <p style={{ margin: 0, color: 'var(--mid)', fontSize: '.85rem', textTransform: 'capitalize' }}>
                        {item.meta.species} / {item.meta.category}
                      </p>
                    ) : (
                      <p style={{ margin: 0, color: 'var(--mid)', fontSize: '.85rem' }}>{item.meta.addonsLabel}</p>
                    )}
                  </div>
                  <strong style={{ fontSize: '1.1rem' }}>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => changeQuantity(item.id, item.type, -1)} style={{ border: '1px solid var(--mist)', background: 'white', borderRadius: 8, width: 34, height: 34, cursor: 'pointer' }}>-</button>
                  <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                  <button type="button" onClick={() => changeQuantity(item.id, item.type, 1)} style={{ border: '1px solid var(--mist)', background: 'white', borderRadius: 8, width: 34, height: 34, cursor: 'pointer' }}>+</button>
                  <button type="button" onClick={() => removeItem(item.id, item.type)} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', color: 'var(--mid)', cursor: 'pointer', textDecoration: 'underline' }}>
                    Remove
                  </button>
                </div>
              </article>
            ))}

            <section style={{ background: 'rgba(255,252,244,.92)', border: '1px solid rgba(74,124,138,.2)', borderRadius: 14, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ color: 'var(--mid)' }}>Subtotal</span>
                <strong style={{ fontSize: '1.35rem' }}>${subtotal.toFixed(2)}</strong>
              </div>
              {checkoutError && (
                <div style={{ marginBottom: 10, color: '#b42318', fontWeight: 600 }}>{checkoutError}</div>
              )}
              {checkoutSuccess && (
                <div style={{ marginBottom: 10, color: '#027a48', fontWeight: 600 }}>{checkoutSuccess}</div>
              )}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  style={{ border: 'none', borderRadius: 10, padding: '12px 18px', background: 'var(--ink)', color: 'white', fontWeight: 700, cursor: isSubmitting ? 'wait' : 'pointer', opacity: isSubmitting ? 0.8 : 1 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Proceed to Checkout'}
                </button>
                <button type="button" onClick={clearCart} style={{ border: '1px solid var(--mist)', borderRadius: 10, padding: '12px 18px', background: 'white', color: 'var(--mid)', fontWeight: 600, cursor: 'pointer' }}>
                  Clear Cart
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

export default CartPage;
