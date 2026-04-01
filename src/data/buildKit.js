export const BASES = [
  {
    id: 'harness-s',
    type: 'harness',
    name: 'Clip & Go Harness',
    size: 'S / M',
    price: 54.99,
    freeSlots: 2,
    addonValue: 12.99,
    badge: 'Best Value',
    desc: 'Adjustable mesh harness with 4 D-ring clip points. Includes 2 accessories of your choice - free.',
  },
  {
    id: 'harness-l',
    type: 'harness',
    name: 'Clip & Go Harness',
    size: 'L / XL',
    price: 59.99,
    freeSlots: 2,
    addonValue: 12.99,
    badge: 'Best Value',
    desc: 'Heavy-duty harness with padded chest plate and 4 clip points. Includes 2 accessories free.',
  },
  {
    id: 'leash-std',
    type: 'leash',
    name: 'Clip & Go Leash',
    size: '5 ft',
    price: 24.99,
    freeSlots: 0,
    addonValue: 0,
    badge: null,
    desc: 'Durable nylon bungee leash with 3 clip attachment loops. Add accessories at checkout.',
  },
  {
    id: 'leash-long',
    type: 'leash',
    name: 'Clip & Go Leash',
    size: '8 ft',
    price: 29.99,
    freeSlots: 0,
    addonValue: 0,
    badge: null,
    desc: 'Extended training leash with 5 clip loops. Perfect for parks and trails.',
  },
];

export const ADDONS = [
  { id: 'light', name: 'SafeBeam LED', price: 12.99, desc: '360° clip-on safety light' },
  { id: 'treat', name: 'TreatPod', price: 12.99, desc: 'Magnetic snap treat capsule' },
  { id: 'water', name: 'HydroClip Bottle', price: 12.99, desc: 'Collapsible 10oz water bottle' },
  { id: 'bag', name: 'BagDispenser', price: 12.99, desc: 'Built-in waste bag holder' },
  { id: 'tag', name: 'SmartTag Clip', price: 12.99, desc: 'ID + AirTag compatible slot' },
  { id: 'bell', name: 'TrailBell', price: 12.99, desc: 'Bear bell for mountain hikes' },
  { id: 'mirror', name: 'PocketBag Mini', price: 12.99, desc: 'Zip pouch for keys & cards' },
  { id: 'reflector', name: 'ReflectBand', price: 12.99, desc: 'Reflective high-vis strap' },
];

export const SHIPPING_COST = 0;

export function calcTotal(base, addons) {
  if (!base) {
    return 0;
  }

  const extraAddons = Math.max(0, addons.length - base.freeSlots);
  return base.price + extraAddons * 12.99;
}