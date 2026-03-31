import { useState } from 'react';

const BASES = [
  {
    id: 'harness-s',
    type: 'harness',
    name: 'Clip & Go Harness',
    size: 'S / M',
    price: 54.99,
    freeSlots: 2,
    addonValue: 12.99,
    color: '#1A1A2E',
    badge: 'Best Value',
    desc: 'Adjustable mesh harness with 4 D-ring clip points. Includes 2 accessories of your choice - free.',
    emoji: '🦺',
  },
  {
    id: 'harness-l',
    type: 'harness',
    name: 'Clip & Go Harness',
    size: 'L / XL',
    price: 59.99,
    freeSlots: 2,
    addonValue: 12.99,
    color: '#1A1A2E',
    badge: 'Best Value',
    desc: 'Heavy-duty harness with padded chest plate and 4 clip points. Includes 2 accessories free.',
    emoji: '🦺',
  },
  {
    id: 'leash-std',
    type: 'leash',
    name: 'Clip & Go Leash',
    size: '5 ft',
    price: 24.99,
    freeSlots: 0,
    addonValue: 0,
    color: '#2D2D2D',
    badge: null,
    desc: 'Durable nylon bungee leash with 3 clip attachment loops. Add accessories at checkout.',
    emoji: '🔗',
  },
  {
    id: 'leash-long',
    type: 'leash',
    name: 'Clip & Go Leash',
    size: '8 ft',
    price: 29.99,
    freeSlots: 0,
    addonValue: 0,
    color: '#2D2D2D',
    badge: null,
    desc: 'Extended training leash with 5 clip loops. Perfect for parks and trails.',
    emoji: '🔗',
  },
];

const ADDONS = [
  { id: 'light', name: 'SafeBeam LED', price: 12.99, emoji: '💡', desc: '360° clip-on safety light' },
  { id: 'treat', name: 'TreatPod', price: 12.99, emoji: '🦴', desc: 'Magnetic snap treat capsule' },
  { id: 'water', name: 'HydroClip Bottle', price: 12.99, emoji: '💧', desc: 'Collapsible 10oz water bottle' },
  { id: 'bag', name: 'BagDispenser', price: 12.99, emoji: '🗑️', desc: 'Built-in waste bag holder' },
  { id: 'tag', name: 'SmartTag Clip', price: 12.99, emoji: '🏷️', desc: 'ID + AirTag compatible slot' },
  { id: 'bell', name: 'TrailBell', price: 12.99, emoji: '🔔', desc: 'Bear bell for mountain hikes' },
  { id: 'mirror', name: 'PocketBag Mini', price: 12.99, emoji: '👜', desc: 'Zip pouch for keys & cards' },
  { id: 'reflector', name: 'ReflectBand', price: 12.99, emoji: '🌟', desc: 'Reflective high-vis strap' },
];

function calcTotal(base, addons) {
  if (!base) return 0;
  const extraAddons = Math.max(0, addons.length - base.freeSlots);
  return base.price + extraAddons * 12.99;
}

const LOGO_PATH = '/logo.png';

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const total = calcTotal(selectedBase, selectedAddons);
  const freeCount = selectedBase ? Math.min(selectedAddons.length, selectedBase.freeSlots) : 0;
  const savings = selectedBase ? freeCount * selectedBase.addonValue : 0;

  const reset = () => {
    setStep(1);
    setSelectedBase(null);
    setSelectedAddons([]);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: 'var(--cream)', minHeight: '100vh', color: 'var(--ink)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --teal: #4A7C8A;
          --terracotta: #E89B5F;
          --peach: #F4C291;
          --cream: #F9F7EF;
          --ink: #4A7C8A;
          --mist: #E6E1D3;
          --mid: #6E8890;
          --surface: #FFFCF4;
          --surface-soft: #F6F1E4;
          --white: #FFFFFF;
        }
        body {
          background: radial-gradient(circle at 20% 0%, rgba(244,194,145,.35), rgba(244,194,145,0) 38%), var(--cream);
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
        .fade-up { animation: fadeUp .55s ease both; }
        .fade-up-2 { animation: fadeUp .55s .12s ease both; }
        .fade-up-3 { animation: fadeUp .55s .24s ease both; }
        .base-card {
          border: 2px solid var(--mist);
          border-radius: 20px;
          padding: 28px 24px;
          cursor: pointer;
          background: var(--white);
          transition: border-color .2s, box-shadow .2s, transform .18s;
          position: relative;
        }
        .base-card:hover { border-color: var(--teal); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(74,124,138,.18); }
        .base-card.selected { border-color: var(--ink); box-shadow: 0 0 0 1px var(--ink); }
        .addon-chip {
          border: 1.5px solid var(--mist);
          border-radius: 14px;
          padding: 14px 16px;
          cursor: pointer;
          background: var(--white);
          transition: all .2s;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .addon-chip:hover { border-color: var(--teal); transform: translateY(-2px); }
        .addon-chip.selected { border-color: var(--ink); background: var(--ink); color: white; }
        .pill { display: inline-flex; align-items: center; gap: 5px; background: var(--terracotta); color: var(--white); font-size: .7rem; font-weight: 600; letter-spacing: .06em; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; }
        .pill-outline { background: transparent; border: 1.5px solid currentColor; }
        .pill-green { background: #FFECD9; color: #C9712F; }
        .step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .75rem; font-weight: 700; transition: all .3s; }
        .step-dot.done { background: var(--ink); color: white; }
        .step-dot.active { background: var(--peach); color: var(--ink); }
        .step-dot.idle { background: var(--mist); color: var(--mid); }
        .btn-primary { background: var(--ink); color: white; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 1rem; padding: 15px 32px; cursor: pointer; transition: background .2s, transform .12s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary:hover { background: #396570; transform: translateY(-1px); }
        .btn-primary:disabled { background: #ccc; cursor: not-allowed; transform: none; }
        .btn-lime { background: var(--terracotta); color: var(--white); border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 1.05rem; padding: 16px 36px; cursor: pointer; transition: filter .2s, transform .12s; }
        .btn-lime:hover { filter: brightness(.92); transform: translateY(-1px); }
        .btn-ghost { background: transparent; border: 1.5px solid #ddd; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: .9rem; color: var(--mid); padding: 10px 22px; cursor: pointer; transition: border-color .2s; }
        .btn-ghost:hover { border-color: var(--teal); color: var(--ink); }
        .price-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--mist); }
        .strikethrough { text-decoration: line-through; color: var(--mid); font-size: .85rem; }
        .free-tag { color: #C9712F; font-weight: 700; font-size: .9rem; }
        .summary-card { background: var(--surface); border-radius: 20px; padding: 28px; border: 1.5px solid var(--mist); }
        .brand-logo { width: 54px; height: 54px; object-fit: contain; border-radius: 12px; background: var(--surface); border: 1px solid var(--mist); }
        .hero-logo { width: min(240px, 45vw); height: auto; display: block; margin-bottom: 20px; filter: drop-shadow(0 12px 22px rgba(74,124,138,.17)); }
        .hero-surface { border-radius: 26px; border: 1px solid var(--mist); background: linear-gradient(160deg, rgba(255,255,255,.75), rgba(249,247,239,.9)); box-shadow: 0 16px 42px rgba(74,124,138,.13); padding: 36px; }
        .section-soft { background: transparent; }
        .trust-row { background: linear-gradient(180deg, rgba(74,124,138,.1), rgba(74,124,138,.04)); border-top: 1px solid var(--mist); border-bottom: 1px solid var(--mist); }
        .site-footer { background: var(--surface-soft); border-top: 1px solid var(--mist); }
        @media (max-width: 700px) {
          .two-col { grid-template-columns: 1fr !important; }
          .addon-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-surface { padding: 24px 18px; }
          .brand-text { display: none; }
        }
      `}</style>

      <nav style={{ background: 'rgba(249,247,239,.94)', backdropFilter: 'blur(4px)', borderBottom: '1px solid var(--mist)', padding: '8px 6%', minHeight: 74, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img className="brand-logo" src={LOGO_PATH} alt="Karmy Pet Shop logo" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          <span className="brand-text" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.01em' }}>
            Kar<span style={{ color: 'var(--terracotta)' }}>my</span>
          </span>
        </span>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Shop', 'Build Your Kit', 'About', 'FAQ'].map((l) => (
            <span
              key={l}
              style={{ color: 'var(--mid)', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer', transition: 'color .2s' }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--ink)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--mid)';
              }}
            >
              {l}
            </span>
          ))}
        </div>
        <div style={{ background: 'var(--ink)', borderRadius: 8, padding: '8px 18px', fontSize: '.85rem', fontWeight: 700, cursor: 'pointer', color: 'var(--white)' }}>Cart (0)</div>
      </nav>

      <section style={{ background: 'transparent', padding: '52px 6% 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -80, top: -80, width: 480, height: 480, borderRadius: '50%', background: 'rgba(232,155,95,.11)' }} />
        <div style={{ position: 'absolute', right: 80, bottom: -120, width: 300, height: 300, borderRadius: '50%', background: 'rgba(74,124,138,.09)' }} />
        <div className="hero-surface" style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <img className="hero-logo fade-up" src={LOGO_PATH} alt="Karmy Pet Shop logo" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          <div className="pill fade-up" style={{ marginBottom: 20 }}>🐾 Clip &amp; Go System</div>
          <h1 className="fade-up-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink)', fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: 20 }}>
            Build the kit
            <br />
            your dog deserves.
          </h1>
          <p className="fade-up-3" style={{ color: 'var(--mid)', fontSize: '1.1rem', fontWeight: 400, lineHeight: 1.7, maxWidth: 600, marginBottom: 36 }}>
            Choose a harness or leash, then snap on the accessories you want. Every harness comes with{' '}
            <strong style={{ color: 'var(--terracotta)' }}>2 accessories free</strong> - mix, match, and customize.
          </p>
          <div className="fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className="btn-lime"
              onClick={() => {
                const builder = document.getElementById('builder');
                if (builder) builder.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start Building →
            </button>
            <div style={{ display: 'flex', gap: 20, marginLeft: 8 }}>
              {[['🦺', 'Harness from $54.99'], ['🔗', 'Leash from $24.99'], ['➕', 'Add-ons $12.99']].map(([ico, txt]) => (
                <div key={txt} style={{ color: 'var(--mid)', fontSize: '.82rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>{ico}</span>
                  {txt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft" style={{ padding: '40px 6% 56px', borderBottom: '1px solid var(--mist)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40 }}>
          {[
            { n: '1', title: 'Pick your base', body: 'Start with a harness or leash - the foundation of your kit.', accent: 'var(--peach)' },
            { n: '2', title: 'Choose add-ons', body: 'Snap on lights, treats, water, tags and more. Harness = 2 free.', accent: 'var(--terracotta)' },
            { n: '3', title: 'See your total', body: "Live pricing shows exactly what's free and what you're paying.", accent: 'var(--peach)' },
            { n: '4', title: 'Ships to your door', body: 'Drop-shipped fast. Every order arrives ready to clip & go.', accent: 'var(--terracotta)' },
          ].map((s) => (
            <div key={s.n}>
              <div style={{ width: 40, height: 40, background: s.accent, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', marginBottom: 14 }}>{s.n}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
              <p style={{ color: 'var(--mid)', fontSize: '.9rem', lineHeight: 1.6 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

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
            <p style={{ color: 'var(--mid)', marginBottom: 36, fontSize: '.95rem' }}>Harnesses include 2 clip-on accessories free. Leashes are mix-and-match at a flat add-on rate.</p>

            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>Harnesses</span>
                <span className="pill">2 Add-Ons Free</span>
              </div>
              <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {BASES.filter((b) => b.type === 'harness').map((b) => (
                  <div key={b.id} className={`base-card ${selectedBase?.id === b.id ? 'selected' : ''}`} onClick={() => setSelectedBase(b)}>
                    {b.badge && <div className="pill" style={{ position: 'absolute', top: 16, right: 16, fontSize: '.65rem' }}>{b.badge}</div>}
                    <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>{b.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 2 }}>{b.name}</div>
                    <div style={{ color: 'var(--mid)', fontSize: '.85rem', marginBottom: 12 }}>Size: {b.size}</div>
                    <p style={{ color: '#555', fontSize: '.88rem', lineHeight: 1.5, marginBottom: 16 }}>{b.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span style={{ fontWeight: 800, fontSize: '1.4rem' }}>${b.price}</span>
                      <span style={{ fontSize: '.8rem', color: '#C9712F', fontWeight: 600 }}>+ 2 accessories free</span>
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
                {BASES.filter((b) => b.type === 'leash').map((b) => (
                  <div key={b.id} className={`base-card ${selectedBase?.id === b.id ? 'selected' : ''}`} onClick={() => setSelectedBase(b)}>
                    <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>{b.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 2 }}>{b.name}</div>
                    <div style={{ color: 'var(--mid)', fontSize: '.85rem', marginBottom: 12 }}>Length: {b.size}</div>
                    <p style={{ color: '#555', fontSize: '.88rem', lineHeight: 1.5, marginBottom: 16 }}>{b.desc}</p>
                    <div style={{ fontWeight: 800, fontSize: '1.4rem' }}>${b.price}</div>
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
                  ? <p style={{ color: '#C9712F', fontWeight: 600, fontSize: '.95rem' }}>✓ First {selectedBase.freeSlots} accessories are FREE with your harness. Additional ones are $12.99 each.</p>
                  : <p style={{ color: 'var(--mid)', fontSize: '.95rem' }}>Each accessory clips onto your leash - $12.99 each.</p>}
              </div>
              <div style={{ background: 'var(--surface)', border: '1.5px solid var(--mist)', borderRadius: 14, padding: '14px 20px', minWidth: 200 }}>
                <div style={{ fontSize: '.75rem', color: 'var(--mid)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>Running Total</div>
                <div style={{ fontWeight: 800, fontSize: '1.7rem' }}>${total.toFixed(2)}</div>
                {savings > 0 && <div style={{ color: '#C9712F', fontSize: '.8rem', fontWeight: 600 }}>You save ${savings.toFixed(2)}</div>}
              </div>
            </div>

            <div className="addon-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 40 }}>
              {ADDONS.map((addon, i) => {
                const isSelected = selectedAddons.find((a) => a.id === addon.id);
                const slotIndex = isSelected ? selectedAddons.findIndex((a) => a.id === addon.id) : -1;
                const isFree = slotIndex >= 0 && slotIndex < selectedBase.freeSlots;
                return (
                  <div key={addon.id} className={`addon-chip ${isSelected ? 'selected' : ''}`} onClick={() => toggleAddon(addon)} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px', position: 'relative', animation: `popIn .3s ${i * 0.04}s both` }}>
                    {isFree && (
                      <div style={{ position: 'absolute', top: 10, right: 10, background: '#C9712F', color: 'white', fontSize: '.6rem', fontWeight: 700, padding: '2px 7px', borderRadius: 20, letterSpacing: '.05em' }}>FREE</div>
                    )}
                    <span style={{ fontSize: '1.8rem', marginBottom: 8 }}>{addon.emoji}</span>
                    <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: 2, color: isSelected ? 'white' : 'var(--ink)' }}>{addon.name}</div>
                    <div style={{ fontSize: '.78rem', color: isSelected ? 'rgba(255,255,255,.6)' : 'var(--mid)', marginBottom: 8 }}>{addon.desc}</div>
                    <div style={{ fontWeight: 700, fontSize: '.9rem', color: isFree ? '#C9712F' : isSelected ? 'white' : 'var(--ink)' }}>
                      {isFree
                        ? (
                          <>
                            <span style={{ textDecoration: 'line-through', color: isSelected ? 'rgba(255,255,255,.4)' : '#aaa', fontWeight: 400, marginRight: 4 }}>$12.99</span>
                            FREE
                          </>
                        )
                        : '$12.99'}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedBase.freeSlots > 0 && (
              <div style={{ background: '#FFF1E4', border: '1.5px solid #F1C9A5', borderRadius: 14, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '.85rem', fontWeight: 700, color: '#C9712F' }}>FREE SLOTS</span>
                {[0, 1].map((i) => {
                  const a = selectedAddons[i];
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: a ? '#FFE5CE' : 'white', border: `1.5px dashed ${a ? '#E89B5F' : '#F1C9A5'}`, borderRadius: 10, padding: '6px 14px', fontSize: '.85rem' }}>
                      {a
                        ? (
                          <>
                            <span>{a.emoji}</span>
                            <span style={{ fontWeight: 600, color: '#C9712F' }}>{a.name}</span>
                          </>
                        )
                        : <span style={{ color: '#D8A67A' }}>Empty slot {i + 1}</span>}
                    </div>
                  );
                })}
                {selectedAddons.length > 2 && (
                  <span style={{ fontSize: '.8rem', color: '#C9712F', fontStyle: 'italic' }}>+{selectedAddons.length - 2} more at $12.99 each</span>
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
                    <span style={{ fontSize: '1.4rem' }}>{selectedBase.emoji}</span>
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
                            <span>{addon.emoji}</span>
                            <span style={{ fontWeight: 500 }}>{addon.name}</span>
                            {isFree && <span className="pill pill-green" style={{ fontSize: '.62rem', padding: '2px 8px' }}>FREE</span>}
                          </div>
                          {isFree
                            ? (
                              <div style={{ textAlign: 'right' }}>
                                <span className="strikethrough">$12.99</span>
                                <br />
                                <span className="free-tag">$0.00</span>
                              </div>
                            )
                            : <span style={{ fontWeight: 700 }}>$12.99</span>}
                        </div>
                      );
                    })}
                  </>
                )}

                {savings > 0 && (
                  <div style={{ background: '#FFF1E4', borderRadius: 10, padding: '12px 16px', margin: '16px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#C9712F', fontWeight: 600, fontSize: '.9rem' }}>🎉 You saved</span>
                    <span style={{ color: '#C9712F', fontWeight: 800 }}>-${savings.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '2px solid var(--ink)', marginTop: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: '1.6rem' }}>${total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <div className="summary-card" style={{ marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '.85rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--mid)', marginBottom: 16 }}>Kit Summary</h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ink)', color: 'white', borderRadius: 10, padding: '8px 12px', fontSize: '.85rem', fontWeight: 600 }}>
                      {selectedBase.emoji}
                      {' '}
                      {selectedBase.name}
                      {' '}
                      {selectedBase.size}
                    </div>
                    {selectedAddons.map((a) => (
                      <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--mist)', borderRadius: 10, padding: '8px 12px', fontSize: '.85rem' }}>
                        {a.emoji}
                        {' '}
                        {a.name}
                      </div>
                    ))}
                    {selectedAddons.length === 0 && <p style={{ color: 'var(--mid)', fontSize: '.85rem' }}>No add-ons selected</p>}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button className="btn-lime" style={{ width: '100%', textAlign: 'center' }}>
                    Add to Cart - ${total.toFixed(2)}
                  </button>
                  <button className="btn-ghost" style={{ width: '100%' }} onClick={() => setStep(2)}>← Edit Add-Ons</button>
                  <button className="btn-ghost" style={{ width: '100%', borderColor: 'transparent', color: 'var(--mid)', fontSize: '.82rem' }} onClick={reset}>Start over</button>
                </div>

                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['🚚', 'Free shipping on orders $40+'], ['🔄', '30-day returns - no questions'], ['✅', 'Vet-approved materials']].map(([ico, txt]) => (
                    <div key={txt} style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--mid)', fontSize: '.82rem' }}>
                      <span>{ico}</span>
                      {txt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="trust-row" style={{ padding: '36px 6%' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
          {[['⚡', 'Ships in 1-3 days'], ['🐾', 'Vet approved'], ['🔒', 'Secure checkout'], ['💬', 'Real support']].map(([ico, txt]) => (
            <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)', fontSize: '.88rem' }}>
              <span style={{ fontSize: '1.1rem' }}>{ico}</span>
              {txt}
            </div>
          ))}
        </div>
      </section>

      <footer className="site-footer" style={{ padding: '28px 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img className="brand-logo" src={LOGO_PATH} alt="Karmy Pet Shop logo" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)' }}>
          Kar
          <span style={{ color: 'var(--terracotta)' }}>my</span>
          </span>
        </span>
        <span style={{ color: 'var(--mid)', fontSize: '.8rem' }}>© 2026 Karmy. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <span key={l} style={{ color: 'var(--mid)', fontSize: '.8rem', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
