const Category = require('../models/Category');

async function listCategories(request, response) {
  const species = request.query.species;
  const includeHidden = request.query.includeHidden === 'true';

  const query = {};
  if (species) {
    query.species = { $in: [species, 'both'] };
  }
  if (!includeHidden) {
    query.isActive = true;
  }

  const categories = await Category.find(query).sort({ name: 1 });
  response.json({ categories });
}

module.exports = {
  listCategories,
};
