export const STORE_SPECIES = [
  {
    slug: 'dog',
    label: 'Shop Dogs',
    shortLabel: 'Dogs',
    description: 'Adventure-ready essentials, apparel, and everyday comfort for dogs.',
    categories: [
      { slug: 'clothes', label: 'Clothes', description: 'Jackets, sweaters, rainwear, and cozy layers.', visible: true },
      { slug: 'harnesses', label: 'Harnesses', description: 'Daily walk harnesses and trail-ready fits.', visible: true },
      { slug: 'leashes', label: 'Leashes', description: 'Training leads, bungee leashes, and hands-free styles.', visible: true },
      { slug: 'toys', label: 'Toys', description: 'Chew toys, fetch toys, enrichment, and tug play.', visible: true },
      { slug: 'hiking-accessories', label: 'Hiking Accessories', description: 'Trail gear, water carry, safety lights, and outdoor add-ons.', visible: true },
      { slug: 'gadgets', label: 'Gadgets', description: 'Trackers, lights, travel gear, and smart walk tools.', visible: true },
      { slug: 'beds', label: 'Beds', description: 'Orthopedic loungers, travel mats, and calming beds.', visible: true },
      { slug: 'training-pads', label: 'Training Pads', description: 'Potty training, home pads, and odor-control essentials.', visible: true },
    ],
  },
  {
    slug: 'cat',
    label: 'Shop Cats',
    shortLabel: 'Cats',
    description: 'Indoor comfort, climbing gear, play, and everyday cat essentials.',
    categories: [
      { slug: 'clothes', label: 'Clothes', description: 'Soft recovery wear, knits, and cold-weather layers.', visible: true },
      { slug: 'harnesses', label: 'Harnesses', description: 'Secure cat harnesses for safe outdoor exploration.', visible: true },
      { slug: 'leashes', label: 'Leashes', description: 'Lightweight leads for cat walks and supervised outdoor time.', visible: true },
      { slug: 'toys', label: 'Toys', description: 'Wands, kickers, puzzle toys, and chase favorites.', visible: true },
      { slug: 'gadgets', label: 'Gadgets', description: 'Fountains, trackers, feeders, and home-tech essentials.', visible: true },
      { slug: 'beds', label: 'Beds', description: 'Cave beds, window perches, and nap-friendly nests.', visible: true },
      { slug: 'trees', label: 'Trees', description: 'Cat trees, scratch towers, and climbing furniture.', visible: true },
      { slug: 'training-pads', label: 'Training Pads', description: 'Litter-adjacent cleanup, liners, and home hygiene helpers.', visible: true },
    ],
  },
];

export const SEASONAL_COLLECTIONS = [
  {
    slug: 'spring-trail-essentials',
    label: 'Spring Trail Essentials',
    description: 'Fresh-air gear for hikes, park days, and wet-weather outings.',
    species: ['dog', 'cat'],
    seasonKey: 'spring',
    isSeasonal: true,
    visible: true,
  },
  {
    slug: 'summer-cooling-kits',
    label: 'Summer Cooling Kits',
    description: 'Cooling mats, hydration extras, breathable wear, and travel comfort.',
    species: ['dog', 'cat'],
    seasonKey: 'summer',
    isSeasonal: true,
    visible: true,
  },
  {
    slug: 'holiday-gifting',
    label: 'Holiday Gifting',
    description: 'Gift bundles and festive picks you can switch on when the season arrives.',
    species: ['dog', 'cat'],
    seasonKey: 'winter',
    isSeasonal: true,
    visible: false,
  },
];

export function getSpeciesConfig(speciesSlug) {
  return STORE_SPECIES.find((species) => species.slug === speciesSlug);
}

export function getVisibleCategories(speciesSlug) {
  const species = getSpeciesConfig(speciesSlug);
  return species ? species.categories.filter((category) => category.visible) : [];
}

export function getCategoryConfig(speciesSlug, categorySlug) {
  return getVisibleCategories(speciesSlug).find((category) => category.slug === categorySlug);
}

export function getVisibleSeasonalCollections() {
  return SEASONAL_COLLECTIONS.filter((collection) => collection.visible);
}

export function getSeasonalCollection(collectionSlug) {
  return SEASONAL_COLLECTIONS.find((collection) => collection.slug === collectionSlug);
}
