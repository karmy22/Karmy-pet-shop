const { slugify } = require('../../utils/slugify');

describe('slugify', () => {
  it('converts text to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('cat food')).toBe('cat-food');
  });

  it('trims leading and trailing whitespace', () => {
    expect(slugify('  dog treats  ')).toBe('dog-treats');
  });

  it('collapses multiple spaces into a single hyphen', () => {
    expect(slugify('dog   food   treats')).toBe('dog-food-treats');
  });

  it('removes special characters', () => {
    expect(slugify('cat & dog!')).toBe('cat-dog');
  });

  it('removes punctuation', () => {
    expect(slugify("bird's food")).toBe('birds-food');
  });

  it('collapses multiple consecutive hyphens', () => {
    expect(slugify('fish -- tank')).toBe('fish-tank');
  });

  it('returns an empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });

  it('returns an empty string for null input', () => {
    expect(slugify(null)).toBe('');
  });

  it('returns an empty string for undefined input', () => {
    expect(slugify(undefined)).toBe('');
  });

  it('handles numeric input', () => {
    expect(slugify(42)).toBe('42');
  });

  it('preserves existing hyphens', () => {
    expect(slugify('small-animals')).toBe('small-animals');
  });

  it('preserves digits in the slug', () => {
    expect(slugify('Product 123')).toBe('product-123');
  });

  it('handles a string that is already a valid slug', () => {
    expect(slugify('already-a-slug')).toBe('already-a-slug');
  });

  it('strips characters that are not alphanumeric, spaces, or hyphens', () => {
    expect(slugify('Hello@World#2024')).toBe('helloworld2024');
  });
});
