require('dotenv').config();

const { connectDatabase, mongoose } = require('../db');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  { slug: 'clothes', name: 'Clothes', species: 'both', description: 'Jackets, sweaters, rainwear, and cozy layers.' },
  { slug: 'harnesses', name: 'Harnesses', species: 'both', description: 'Daily walk harnesses and trail-ready fits.' },
  { slug: 'leashes', name: 'Leashes', species: 'both', description: 'Training leads, bungee leashes, and hands-free styles.' },
  { slug: 'toys', name: 'Toys', species: 'both', description: 'Chew toys, fetch toys, enrichment, and chase favorites.' },
  { slug: 'hiking-accessories', name: 'Hiking Accessories', species: 'dog', description: 'Trail gear, water carry, safety lights, and outdoor add-ons.' },
  { slug: 'gadgets', name: 'Gadgets', species: 'both', description: 'Trackers, lights, travel gear, and smart walk tools.' },
  { slug: 'beds', name: 'Beds', species: 'both', description: 'Orthopedic loungers, travel mats, and calming beds.' },
  { slug: 'training-pads', name: 'Training Pads', species: 'both', description: 'Potty training and odor-control essentials.' },
  { slug: 'trees', name: 'Trees', species: 'cat', description: 'Cat trees, scratch towers, and climbing furniture.' },
];

const products = [
  { slug: 'dog-rain-shell', name: 'Storm Scout Rain Shell', species: 'dog', categorySlug: 'clothes', price: 42.0, badges: ['Waterproof'], description: 'Lightweight rain jacket with reflective trim for wet walks and campground mornings.' },
  { slug: 'dog-hike-harness', name: 'Summit Trek Harness', species: 'dog', categorySlug: 'harnesses', price: 54.99, badges: ['Best Seller'], description: 'Padded all-day harness designed for hikes, training, and everyday control.' },
  { slug: 'dog-trail-leash', name: 'Canyon Bungee Leash', species: 'dog', categorySlug: 'leashes', price: 29.99, badges: ['Trail Ready'], description: 'Shock-absorbing lead with soft grip handle and swivel hardware.' },
  { slug: 'dog-trail-kit', name: 'Ridgeline Adventure Kit', species: 'dog', categorySlug: 'hiking-accessories', price: 68.0, badges: ['Bundle'], seasonalCollection: 'spring-trail-essentials', description: 'Bottle clip, treat pod, safety light, and collapsible bowl for the trail.' },
  { slug: 'dog-gps-tag', name: 'Waypoint Smart Tag', species: 'dog', categorySlug: 'gadgets', price: 34.0, badges: ['New'], description: 'Compact tracking clip that attaches to collars and harnesses.' },
  { slug: 'dog-cloud-bed', name: 'Cloud Nap Lounger', species: 'dog', categorySlug: 'beds', price: 79.0, badges: ['Calming'], description: 'Supportive plush bed with removable washable cover.' },
  { slug: 'dog-training-pad-pro', name: 'Stay-Dry Training Pads', species: 'dog', categorySlug: 'training-pads', price: 22.0, badges: ['Odor Control'], description: 'Leak-lock pads built for puppy training and apartment living.' },
  { slug: 'cat-knit-wrap', name: 'Cozy Cat Knit Wrap', species: 'cat', categorySlug: 'clothes', price: 29.0, badges: ['Soft Fit'], description: 'Stretch-knit layer for comfort, recovery, or chilly evenings.' },
  { slug: 'cat-explore-harness', name: 'Whisker Walk Harness', species: 'cat', categorySlug: 'harnesses', price: 39.99, badges: ['Escape Resistant'], description: 'Secure vest-style harness for safe outdoor cat adventures.' },
  { slug: 'cat-feather-toy-set', name: 'Pounce Feather Set', species: 'cat', categorySlug: 'toys', price: 18.0, badges: ['Interactive'], description: 'Wand toy bundle with crinkle and feather attachments.' },
  { slug: 'cat-fountain', name: 'Ripple Smart Fountain', species: 'cat', categorySlug: 'gadgets', price: 46.0, badges: ['Filtered'], description: 'Quiet filtered fountain that encourages hydration throughout the day.' },
  { slug: 'cat-window-bed', name: 'Sunbeam Window Bed', species: 'cat', categorySlug: 'beds', price: 33.0, badges: ['Window Perch'], description: 'Space-saving elevated bed for sunny naps and neighborhood watching.' },
  { slug: 'cat-tree-loft', name: 'Skyline Cat Tree', species: 'cat', categorySlug: 'trees', price: 119.0, badges: ['Tall Tower'], description: 'Multi-level cat tree with scratch posts, lookout perch, and hideaway cave.' },
  { slug: 'summer-cooling-mat', name: 'Breeze Cooling Mat', species: 'dog', categorySlug: 'beds', price: 31.0, badges: ['Seasonal'], seasonalCollection: 'summer-cooling-kits', description: 'Pressure-activated cooling mat for warmer weather travel and naps.' },
  { slug: 'cat-cooling-pad', name: 'Cool Spot Lounge Pad', species: 'cat', categorySlug: 'beds', price: 26.0, badges: ['Seasonal'], seasonalCollection: 'summer-cooling-kits', description: 'Lightweight cool-touch pad sized for cats and small pets.' },
];

async function seedCatalog() {
  await connectDatabase();

  const categoryIdsBySlug = new Map();
  for (const category of categories) {
    const saved = await Category.findOneAndUpdate(
      { slug: category.slug },
      {
        $set: {
          name: category.name,
          description: category.description,
          species: category.species,
          isActive: true,
          seasonalVisible: true,
        },
        $setOnInsert: {
          slug: category.slug,
        },
      },
      {
        returnDocument: 'after',
        upsert: true,
      }
    );
    categoryIdsBySlug.set(category.slug, saved._id);
  }

  for (const product of products) {
    const categoryId = categoryIdsBySlug.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category mapping for ${product.slug}`);
    }

    await Product.findOneAndUpdate(
      { slug: product.slug },
      {
        $set: {
          name: product.name,
          description: product.description,
          species: product.species,
          category: categoryId,
          images: [],
          badges: product.badges || [],
          seasonalCollection: product.seasonalCollection || '',
          price: Number(product.price),
          stock: 100,
          isActive: true,
        },
        $setOnInsert: {
          slug: product.slug,
        },
      },
      {
        returnDocument: 'after',
        upsert: true,
      }
    );
  }

  console.log(`Seed complete: ${categories.length} categories, ${products.length} products`);
}

seedCatalog()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  });
