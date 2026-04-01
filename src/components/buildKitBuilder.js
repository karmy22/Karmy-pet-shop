import React, { useState } from 'react';
import { ADDONS, BASES, calcTotal, SHIPPING_COST } from '../data/buildKit';
import { useCart } from '../context/cartContext';

function BuildKitBuilder() {
  const { addCustomKit } = useCart();
  const [step, setStep] = useState(1);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) => (
      prev.find((item) => item.id === addon.id)
        ? prev.filter((item) => item.id !== addon.id)
        : [...prev, addon]
    ));
  };

  const subtotal = calcTotal(selectedBase, selectedAddons);
  const total = subtotal + SHIPPING_COST;
  const freeCount = selectedBase ? Math.min(selectedAddons.length, selectedBase.freeSlots) : 0;
  const savings = selectedBase ? freeCount * selectedBase.addonValue : 0;

  const reset = () => {
    setStep(1);
    setSelectedBase(null);
    setSelectedAddons([]);
  };

  return (
    <section id="builder" style={{ padding: '64px 6%', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
        {[['1', 'Choose Base'], ['2', 'Add-Ons'], ['3', 'Review']].map(([n, label], i) => {
          const num = parseInt(n, 10);
          const cls = step > num ? 'done' : step === num ? 'active' : 'idle';
          return (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className={`step-dot ${cls}`}>{step > num ? '✓' : n}</div>
              <span style={{ fontSize: '.85rem', fontWeight: 600, color: step === num ? 'var(--ink)' : 'var(--mid)' }}>{label}</span>
              {i < 2 && <div style={{ width: 32, height: 1.5, background: step > num + 1 ? 'var(--ink)' : 'var(--mist)', margin: '0 4px' }} />}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div style={{ animation: 'fadeUp .5s ease both' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, marginBottom: 6 }}>
            Start with your base
          </h2>
          <p style={{ color: 'var(--mid)', marginBottom: 36, fontSize: '.95rem' }}>Harnesses include 2 clip-on accessories free. Leashes are mix-and-match at a flat add-on rate, and shipping is included for every kit.</p>

          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>Harnesses</span>
              <span className="pill">2 Add-Ons Free</span>
            </div>
            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {BASES.filter((base) => base.type === 'harness').map((base) => (
                <div key={base.id} className={`base-card ${selectedBase?.id === base.id ? 'selected' : ''}`} onClick={() => setSelectedBase(base)}>
                  {base.badge && <div className="pill" style={{ position: 'absolute', top: 16, right: 16, fontSize: '.65rem' }}>{base.badge}</div>}
                  <div style={{ fontSize: '.72rem', letterSpacing: '.08em', fontWeight: 700, color: 'var(--mid)', marginBottom: 12, textTransform: 'uppercase' }}>{base.type}</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 2 }}>{base.name}</div>
                  <div style={{ color: 'var(--mid)', fontSize: '.85rem', marginBottom: 12 }}>Size: {base.size}</div>
                  <p style={{ color: 'var(--mid)', fontSize: '.88rem', lineHeight: 1.5, marginBottom: 16 }}>{base.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontWeight: 800, fontSize: '1.4rem' }}>${base.price}</span>
                    <span style={{ fontSize: '.8rem', color: 'var(--warm-strong)', fontWeight: 600 }}>+ 2 accessories free</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>Leashes</span>
              <span className="pill pill-outline" style={{ borderColor: 'var(--ink)', background: 'transparent' }}>Mix &amp; Match Add-Ons</span>
            </div>
            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {BASES.filter((base) => base.type === 'leash').map((base) => (
                <div key={base.id} className={`base-card ${selectedBase?.id === base.id ? 'selected' : ''}`} onClick={() => setSelectedBase(base)}>
                  <div style={{ fontSize: '.72rem', letterSpacing: '.08em', fontWeight: 700, color: 'var(--mid)', marginBottom: 12, textTransform: 'uppercase' }}>{base.type}</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 2 }}>{base.name}</div>
                  <div style={{ color: 'var(--mid)', fontSize: '.85rem', marginBottom: 12 }}>Length: {base.size}</div>
                  <p style={{ color: 'var(--mid)', fontSize: '.88rem', lineHeight: 1.5, marginBottom: 16 }}>{base.desc}</p>
                  <div style={{ fontWeight: 800, fontSize: '1.4rem' }}>${base.price}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" disabled={!selectedBase} onClick={() => setStep(2)}>
            Continue - Choose Add-Ons →
          </button>
        </div>
      )}

      {step === 2 && selectedBase && (
        <div style={{ animation: 'fadeUp .5s ease both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, marginBottom: 6 }}>
                Clip on your accessories
              </h2>
              {selectedBase.freeSlots > 0
                ? <p style={{ color: 'var(--warm-strong)', fontWeight: 600, fontSize: '.95rem' }}>✓ First {selectedBase.freeSlots} accessories are FREE with your harness. Additional ones are $12.99 each.</p>
                : <p style={{ color: 'var(--mid)', fontSize: '.95rem' }}>Each accessory clips onto your leash - $12.99 each.</p>}
            </div>
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--mist)', borderRadius: 14, padding: '14px 20px', minWidth: 200 }}>
              <div style={{ fontSize: '.75rem', color: 'var(--mid)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>Running Total</div>
              <div style={{ fontWeight: 800, fontSize: '1.7rem' }}>${total.toFixed(2)}</div>
              <div style={{ color: 'var(--mid)', fontSize: '.76rem' }}>Shipping included</div>
              {savings > 0 && <div style={{ color: 'var(--warm-strong)', fontSize: '.8rem', fontWeight: 600 }}>You save ${savings.toFixed(2)}</div>}
            </div>
          </div>

          <div className="addon-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 40 }}>
            {ADDONS.map((addon, i) => {
              const isSelected = selectedAddons.find((item) => item.id === addon.id);
              const slotIndex = isSelected ? selectedAddons.findIndex((item) => item.id === addon.id) : -1;
              const isFree = slotIndex >= 0 && slotIndex < selectedBase.freeSlots;
              return (
                <div key={addon.id} className={`addon-chip ${isSelected ? 'selected' : ''}`} onClick={() => toggleAddon(addon)} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px', position: 'relative', animation: `popIn .3s ${i * 0.04}s both` }}>
                  {isFree && (
                    <div style={{ position: 'absolute', top: 10, right: 10, background: 'var(--warm-strong)', color: 'white', fontSize: '.6rem', fontWeight: 700, padding: '2px 7px', borderRadius: 20, letterSpacing: '.05em' }}>FREE</div>
                  )}
                  <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: 2, color: isSelected ? 'white' : 'var(--ink)' }}>{addon.name}</div>
                  <div style={{ fontSize: '.78rem', color: isSelected ? 'rgba(255,255,255,.6)' : 'var(--mid)', marginBottom: 8 }}>{addon.desc}</div>
                  <div style={{ fontWeight: 700, fontSize: '.9rem', color: isFree ? 'var(--warm-strong)' : isSelected ? 'white' : 'var(--ink)' }}>
                    {isFree ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: isSelected ? 'rgba(255,255,255,.4)' : '#aaa', fontWeight: 400, marginRight: 4 }}>$12.99</span>
                        FREE
                      </>
                    ) : '$12.99'}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedBase.freeSlots > 0 && (
            <div style={{ background: 'var(--warm-surface)', border: '1.5px solid var(--warm-border)', borderRadius: 14, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--warm-strong)' }}>FREE SLOTS</span>
              {Array.from({ length: selectedBase.freeSlots }).map((_, i) => {
                const addon = selectedAddons[i];
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: addon ? 'var(--warm-soft)' : 'white', border: `1.5px dashed ${addon ? 'var(--terracotta)' : 'var(--warm-border)'}`, borderRadius: 10, padding: '6px 14px', fontSize: '.85rem' }}>
                    {addon ? <span style={{ fontWeight: 600, color: 'var(--warm-strong)' }}>{addon.name}</span> : <span style={{ color: 'var(--warm-empty)' }}>Empty slot {i + 1}</span>}
                  </div>
                );
              })}
              {selectedAddons.length > selectedBase.freeSlots && (
                <span style={{ fontSize: '.8rem', color: 'var(--warm-strong)', fontStyle: 'italic' }}>+{selectedAddons.length - selectedBase.freeSlots} more at $12.99 each</span>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn-primary" onClick={() => setStep(3)}>Review My Kit →</button>
          </div>
        </div>
      )}

      {step === 3 && selectedBase && (
        <div style={{ animation: 'fadeUp .5s ease both' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, marginBottom: 6 }}>Your Karmy Kit</h2>
          <p style={{ color: 'var(--mid)', marginBottom: 36, fontSize: '.95rem' }}>Here's your full order breakdown - everything you're getting, and what you're paying.</p>

          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28 }}>
            <div className="summary-card">
              <h3 style={{ fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 20, color: 'var(--mid)' }}>Order Breakdown</h3>

              <div className="price-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{selectedBase.name}</div>
                    <div style={{ color: 'var(--mid)', fontSize: '.8rem' }}>Size: {selectedBase.size}</div>
                  </div>
                </div>
                <span style={{ fontWeight: 800 }}>${selectedBase.price.toFixed(2)}</span>
              </div>

              {selectedAddons.length > 0 && (
                <>
                  <div style={{ fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--mid)', fontWeight: 600, padding: '14px 0 8px' }}>Clip-On Accessories</div>
                  {selectedAddons.map((addon, i) => {
                    const isFree = i < (selectedBase.freeSlots || 0);
                    return (
                      <div key={addon.id} className="price-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 500 }}>{addon.name}</span>
                          {isFree && <span className="pill pill-green" style={{ fontSize: '.62rem', padding: '2px 8px' }}>FREE</span>}
                        </div>
                        {isFree ? (
                          <div style={{ textAlign: 'right' }}>
                            <span className="strikethrough">$12.99</span>
                            <br />
                            <span className="free-tag">$0.00</span>
                          </div>
                        ) : <span style={{ fontWeight: 700 }}>$12.99</span>}
                      </div>
                    );
                  })}
                </>
              )}

              {savings > 0 && (
                <div style={{ background: 'var(--warm-surface)', borderRadius: 10, padding: '12px 16px', margin: '16px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--warm-strong)', fontWeight: 600, fontSize: '.9rem' }}>You saved</span>
                  <span style={{ color: 'var(--warm-strong)', fontWeight: 800 }}>-${savings.toFixed(2)}</span>
                </div>
              )}

              <div className="price-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700 }}>Shipping</span>
                </div>
                <span className="free-tag">Included</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '2px solid var(--ink)', marginTop: 4 }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Total (incl. shipping)</span>
                <span style={{ fontWeight: 800, fontSize: '1.6rem' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <div className="summary-card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontWeight: 700, fontSize: '.85rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--mid)', marginBottom: 16 }}>Kit Summary</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ink)', color: 'white', borderRadius: 10, padding: '8px 12px', fontSize: '.85rem', fontWeight: 600 }}>
                    {selectedBase.name} {selectedBase.size}
                  </div>
                  {selectedAddons.map((addon) => (
                    <div key={addon.id} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--mist)', borderRadius: 10, padding: '8px 12px', fontSize: '.85rem' }}>
                      {addon.name}
                    </div>
                  ))}
                  {selectedAddons.length === 0 && <p style={{ color: 'var(--mid)', fontSize: '.85rem' }}>No add-ons selected</p>}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  className="btn-lime"
                  style={{ width: '100%', textAlign: 'center' }}
                  onClick={() => addCustomKit({ base: selectedBase, addons: selectedAddons, total })}
                >
                  Add to Cart - ${total.toFixed(2)}
                </button>
                <p style={{ color: 'var(--mid)', fontSize: '.78rem', textAlign: 'center' }}>Shipping already included in your total.</p>
                <button className="btn-ghost" style={{ width: '100%' }} onClick={() => setStep(2)}>← Edit Add-Ons</button>
                <button className="btn-ghost" style={{ width: '100%', borderColor: 'transparent', color: 'var(--mid)', fontSize: '.82rem' }} onClick={reset}>Start over</button>
              </div>

              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Shipping included on every kit', '30-day returns - no questions', 'Vet-approved materials'].map((txt) => (
                  <div key={txt} style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--mid)', fontSize: '.82rem' }}>
                    {txt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default BuildKitBuilder;
