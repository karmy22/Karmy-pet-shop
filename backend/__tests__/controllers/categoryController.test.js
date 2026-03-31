jest.mock('../../models/Category');

const Category = require('../../models/Category');
const { listCategories } = require('../../controllers/categoryController');

function buildResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('listCategories', () => {
  beforeEach(() => {
    Category.find.mockReset();
  });

  it('returns all active categories when no query parameters are given', async () => {
    const fakeCategories = [{ name: 'Food', slug: 'food' }];
    Category.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeCategories) });

    const req = { query: {} };
    const res = buildResponse();

    await listCategories(req, res);

    expect(Category.find).toHaveBeenCalledWith({ isActive: true });
    expect(res.json).toHaveBeenCalledWith({ categories: fakeCategories });
  });

  it('filters by species when species query parameter is provided', async () => {
    const fakeCategories = [{ name: 'Dog Food', slug: 'dog-food' }];
    Category.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeCategories) });

    const req = { query: { species: 'dog' } };
    const res = buildResponse();

    await listCategories(req, res);

    expect(Category.find).toHaveBeenCalledWith({
      species: { $in: ['dog', 'both'] },
      isActive: true,
    });
    expect(res.json).toHaveBeenCalledWith({ categories: fakeCategories });
  });

  it('includes hidden categories when includeHidden is "true"', async () => {
    const fakeCategories = [{ name: 'Hidden', isActive: false }];
    Category.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeCategories) });

    const req = { query: { includeHidden: 'true' } };
    const res = buildResponse();

    await listCategories(req, res);

    expect(Category.find).toHaveBeenCalledWith({});
    expect(res.json).toHaveBeenCalledWith({ categories: fakeCategories });
  });

  it('combines species filter with includeHidden', async () => {
    Category.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

    const req = { query: { species: 'cat', includeHidden: 'true' } };
    const res = buildResponse();

    await listCategories(req, res);

    expect(Category.find).toHaveBeenCalledWith({ species: { $in: ['cat', 'both'] } });
  });

  it('does not include hidden categories when includeHidden is not "true"', async () => {
    Category.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

    const req = { query: { includeHidden: 'false' } };
    const res = buildResponse();

    await listCategories(req, res);

    expect(Category.find).toHaveBeenCalledWith({ isActive: true });
  });
});
