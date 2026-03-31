import React from 'react';
import { render, act, screen } from '@testing-library/react';
import { CartProvider, useCart } from '../../context/cartContext';

// Consume cart context in a simple test component
function CartConsumer({ onMount }) {
  const cart = useCart();
  React.useEffect(() => {
    onMount(cart);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function renderCart(onMount) {
  render(
    <CartProvider>
      <CartConsumer onMount={onMount} />
    </CartProvider>
  );
}

const STORAGE_KEY = 'karmy-cart-v1';

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// localStorage persistence
// ---------------------------------------------------------------------------
describe('readStoredItems (initialization from localStorage)', () => {
  it('starts with an empty cart when localStorage is empty', () => {
    let cart;
    renderCart((c) => { cart = c; });
    expect(cart.items).toEqual([]);
  });

  it('restores items from localStorage on mount', () => {
    const stored = [{ type: 'product', id: 'p1', name: 'Dog Food', price: 10, quantity: 2, meta: {} }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    let cart;
    renderCart((c) => { cart = c; });
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].id).toBe('p1');
  });

  it('starts with an empty cart when localStorage contains invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json');

    let cart;
    renderCart((c) => { cart = c; });
    expect(cart.items).toEqual([]);
  });

  it('starts with an empty cart when localStorage contains a non-array value', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'p1' }));

    let cart;
    renderCart((c) => { cart = c; });
    expect(cart.items).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// addProduct
// ---------------------------------------------------------------------------
describe('addProduct', () => {
  it('adds a new product to the cart', () => {
    let cart;
    renderCart((c) => { cart = c; });

    act(() => {
      cart.addProduct({ id: 'p1', name: 'Dog Food', price: 10, badge: 'Sale', species: 'dog', category: 'food' });
    });

    // Re-capture after re-render
    act(() => {
      cart = useCartSnapshot();
    });
  });

  function useCartSnapshot() {
    // Use a helper render to get the latest cart value
    let latest;
    render(
      <CartProvider>
        <CartConsumer onMount={(c) => { latest = c; }} />
      </CartProvider>
    );
    return latest;
  }
});

// ---------------------------------------------------------------------------
// Full integration tests using a ref-based consumer
// ---------------------------------------------------------------------------
function CartRef() {
  const cart = useCart();
  CartRef.latest = cart;
  return null;
}

function renderCartWithRef() {
  const { rerender } = render(
    <CartProvider>
      <CartRef />
    </CartProvider>
  );
  return { rerender };
}

describe('addProduct (integration)', () => {
  it('adds a new product and updates itemCount and subtotal', () => {
    renderCartWithRef();

    act(() => {
      CartRef.latest.addProduct({ id: 'p1', name: 'Dog Food', price: 12, quantity: 1 });
    });

    expect(CartRef.latest.items).toHaveLength(1);
    expect(CartRef.latest.items[0]).toMatchObject({ type: 'product', id: 'p1', name: 'Dog Food', price: 12, quantity: 1 });
    expect(CartRef.latest.itemCount).toBe(1);
    expect(CartRef.latest.subtotal).toBe(12);
  });

  it('increments quantity when the same product is added again', () => {
    renderCartWithRef();

    act(() => {
      CartRef.latest.addProduct({ id: 'p1', name: 'Dog Food', price: 12 });
    });
    act(() => {
      CartRef.latest.addProduct({ id: 'p1', name: 'Dog Food', price: 12 });
    });

    expect(CartRef.latest.items).toHaveLength(1);
    expect(CartRef.latest.items[0].quantity).toBe(2);
    expect(CartRef.latest.itemCount).toBe(2);
    expect(CartRef.latest.subtotal).toBe(24);
  });

  it('adds multiple distinct products as separate cart items', () => {
    renderCartWithRef();

    act(() => {
      CartRef.latest.addProduct({ id: 'p1', name: 'Dog Food', price: 10 });
      CartRef.latest.addProduct({ id: 'p2', name: 'Cat Toy', price: 5 });
    });

    expect(CartRef.latest.items).toHaveLength(2);
    expect(CartRef.latest.itemCount).toBe(2);
    expect(CartRef.latest.subtotal).toBe(15);
  });

  it('stores product meta (badge, species, category)', () => {
    renderCartWithRef();

    act(() => {
      CartRef.latest.addProduct({ id: 'p1', name: 'Toy', price: 5, badge: 'New', species: 'cat', category: 'toys' });
    });

    expect(CartRef.latest.items[0].meta).toEqual({ badge: 'New', species: 'cat', category: 'toys' });
  });

  it('persists cart items to localStorage', () => {
    renderCartWithRef();

    act(() => {
      CartRef.latest.addProduct({ id: 'p1', name: 'Dog Food', price: 10 });
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('p1');
  });
});

// ---------------------------------------------------------------------------
// addCustomKit
// ---------------------------------------------------------------------------
describe('addCustomKit', () => {
  beforeEach(() => renderCartWithRef());

  it('adds a new custom kit to the cart', () => {
    act(() => {
      CartRef.latest.addCustomKit({
        base: { id: 'b1', name: 'Starter Box', size: 'Medium' },
        addons: [{ id: 'a1', name: 'Chew Toy' }, { id: 'a2', name: 'Leash' }],
        total: 30,
      });
    });

    expect(CartRef.latest.items).toHaveLength(1);
    const kit = CartRef.latest.items[0];
    expect(kit.type).toBe('kit');
    expect(kit.id).toBe('b1-a1-a2');
    expect(kit.name).toBe('Starter Box (Medium)');
    expect(kit.price).toBe(30);
    expect(kit.quantity).toBe(1);
    expect(kit.meta.addonsLabel).toBe('Chew Toy, Leash');
  });

  it('uses "No add-ons" label when addons array is empty', () => {
    act(() => {
      CartRef.latest.addCustomKit({
        base: { id: 'b1', name: 'Base Box', size: 'Small' },
        addons: [],
        total: 20,
      });
    });

    const kit = CartRef.latest.items[0];
    expect(kit.id).toBe('b1-base');
    expect(kit.meta.addonsLabel).toBe('No add-ons');
  });

  it('increments kit quantity when the same kit is added again', () => {
    const kitPayload = {
      base: { id: 'b1', name: 'Box', size: 'L' },
      addons: [{ id: 'a1', name: 'Toy' }],
      total: 25,
    };

    act(() => {
      CartRef.latest.addCustomKit(kitPayload);
      CartRef.latest.addCustomKit(kitPayload);
    });

    expect(CartRef.latest.items).toHaveLength(1);
    expect(CartRef.latest.items[0].quantity).toBe(2);
  });

  it('treats kits with different add-on combinations as distinct items', () => {
    act(() => {
      CartRef.latest.addCustomKit({
        base: { id: 'b1', name: 'Box', size: 'M' },
        addons: [{ id: 'a1', name: 'Toy' }],
        total: 20,
      });
      CartRef.latest.addCustomKit({
        base: { id: 'b1', name: 'Box', size: 'M' },
        addons: [{ id: 'a2', name: 'Leash' }],
        total: 22,
      });
    });

    expect(CartRef.latest.items).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// removeItem
// ---------------------------------------------------------------------------
describe('removeItem', () => {
  beforeEach(() => {
    renderCartWithRef();
    act(() => {
      CartRef.latest.addProduct({ id: 'p1', name: 'Dog Food', price: 10 });
      CartRef.latest.addProduct({ id: 'p2', name: 'Cat Toy', price: 5 });
    });
  });

  it('removes the specified item by id and type', () => {
    act(() => {
      CartRef.latest.removeItem('p1', 'product');
    });

    expect(CartRef.latest.items).toHaveLength(1);
    expect(CartRef.latest.items[0].id).toBe('p2');
  });

  it('does not remove items with the same id but different type', () => {
    act(() => {
      CartRef.latest.removeItem('p1', 'kit');
    });

    expect(CartRef.latest.items).toHaveLength(2);
  });

  it('does nothing when the item id does not exist', () => {
    act(() => {
      CartRef.latest.removeItem('nonexistent', 'product');
    });

    expect(CartRef.latest.items).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// changeQuantity
// ---------------------------------------------------------------------------
describe('changeQuantity', () => {
  beforeEach(() => {
    renderCartWithRef();
    act(() => {
      CartRef.latest.addProduct({ id: 'p1', name: 'Dog Food', price: 10 });
      CartRef.latest.addProduct({ id: 'p2', name: 'Cat Toy', price: 5 });
    });
  });

  it('increments quantity by delta', () => {
    act(() => {
      CartRef.latest.changeQuantity('p1', 'product', 2);
    });

    expect(CartRef.latest.items.find((i) => i.id === 'p1').quantity).toBe(3);
  });

  it('decrements quantity by delta', () => {
    // First add a second unit so decrement leaves quantity at 1
    act(() => {
      CartRef.latest.addProduct({ id: 'p1', name: 'Dog Food', price: 10 });
    });
    act(() => {
      CartRef.latest.changeQuantity('p1', 'product', -1);
    });

    expect(CartRef.latest.items.find((i) => i.id === 'p1').quantity).toBe(1);
  });

  it('removes item when quantity would become 0', () => {
    act(() => {
      CartRef.latest.changeQuantity('p1', 'product', -1);
    });

    expect(CartRef.latest.items.find((i) => i.id === 'p1')).toBeUndefined();
    expect(CartRef.latest.items).toHaveLength(1);
  });

  it('does not allow negative quantities', () => {
    act(() => {
      CartRef.latest.changeQuantity('p1', 'product', -100);
    });

    expect(CartRef.latest.items.find((i) => i.id === 'p1')).toBeUndefined();
  });

  it('does not change other items', () => {
    act(() => {
      CartRef.latest.changeQuantity('p1', 'product', 1);
    });

    expect(CartRef.latest.items.find((i) => i.id === 'p2').quantity).toBe(1);
  });

  it('updates itemCount and subtotal correctly after change', () => {
    act(() => {
      CartRef.latest.changeQuantity('p1', 'product', 1); // p1 quantity → 2
    });

    expect(CartRef.latest.itemCount).toBe(3); // p1:2 + p2:1
    expect(CartRef.latest.subtotal).toBe(25); // 10*2 + 5*1
  });
});

// ---------------------------------------------------------------------------
// clearCart
// ---------------------------------------------------------------------------
describe('clearCart', () => {
  it('empties the cart and resets itemCount and subtotal to zero', () => {
    renderCartWithRef();

    act(() => {
      CartRef.latest.addProduct({ id: 'p1', name: 'Dog Food', price: 10 });
      CartRef.latest.addProduct({ id: 'p2', name: 'Cat Toy', price: 5 });
    });

    act(() => {
      CartRef.latest.clearCart();
    });

    expect(CartRef.latest.items).toEqual([]);
    expect(CartRef.latest.itemCount).toBe(0);
    expect(CartRef.latest.subtotal).toBe(0);
  });

  it('clears localStorage when cart is cleared', () => {
    renderCartWithRef();

    act(() => {
      CartRef.latest.addProduct({ id: 'p1', name: 'Dog Food', price: 10 });
    });

    act(() => {
      CartRef.latest.clearCart();
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// useCart outside provider
// ---------------------------------------------------------------------------
describe('useCart', () => {
  it('throws an error when used outside CartProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    function BareConsumer() {
      useCart();
      return null;
    }

    expect(() => render(<BareConsumer />)).toThrow('useCart must be used inside <CartProvider>');

    consoleError.mockRestore();
  });
});
