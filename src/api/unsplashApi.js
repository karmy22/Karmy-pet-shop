// Unsplash API client — https://github.com/unsplash/datasets
// Free tier: 50 requests/hour (demo). Register at https://unsplash.com/developers
// Dataset field reference: photo_id, photo_image_url, photographer_username, etc.
// Image URL format from the dataset: https://images.unsplash.com/photo-{id}?w=800&q=80

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function buildBackendUrl(path, params = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function backendUnsplashRequest(path, params = {}) {
  const response = await fetch(buildBackendUrl(path, params));
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || data.errors?.[0] || `Unsplash request failed: ${response.status}`);
  }
  return response.json();
}

// Normalize an Unsplash API photo object to match the dataset field names
// (photo_id, photo_image_url, photographer_username, etc.)
function normalizePhoto(photo) {
  return {
    photo_id: photo.id,
    photo_url: photo.links?.html || '',
    photo_image_url: photo.urls?.regular || photo.urls?.full || '',
    photo_image_url_small: photo.urls?.small || '',
    photo_image_url_thumb: photo.urls?.thumb || '',
    photo_description: photo.description || '',
    ai_description: photo.alt_description || '',
    photo_width: photo.width,
    photo_height: photo.height,
    photo_aspect_ratio: photo.width && photo.height ? photo.width / photo.height : null,
    blur_hash: photo.blur_hash || '',
    photographer_username: photo.user?.username || '',
    photographer_first_name: photo.user?.name?.split(' ')[0] || '',
    photographer_last_name: photo.user?.name?.split(' ').slice(1).join(' ') || '',
    photographer_profile_url: photo.user?.links?.html || '',
    stats_downloads: photo.downloads || 0,
    stats_views: photo.views || 0,
    photo_color: photo.color || '',
    photo_submitted_at: photo.created_at || '',
  };
}

/**
 * Search for photos by keyword.
 * @param {string} query - Search term (e.g. "dog harness", "cat toys")
 * @param {object} options - { perPage, page, orientation }
 * @returns {Promise<{ photos: object[], total: number, totalPages: number }>}
 */
export async function searchUnsplashPhotos(query, options = {}) {
  const { perPage = 10, page = 1, orientation } = options;
  const data = await backendUnsplashRequest('/api/public/unsplash/search', {
    query,
    per_page: perPage,
    page,
    ...(orientation ? { orientation } : {}),
  });
  return {
    photos: (data.results || []).map(normalizePhoto),
    total: data.total || 0,
    totalPages: data.total_pages || 0,
  };
}

/**
 * Get a random photo by keyword.
 * @param {string} query - Search term
 * @param {object} options - { count, orientation }
 * @returns {Promise<object|object[]>} Single normalized photo or array if count > 1
 */
export async function getRandomUnsplashPhoto(query, options = {}) {
  const { count = 1, orientation } = options;
  const data = await backendUnsplashRequest('/api/public/unsplash/random', {
    query,
    count,
    ...(orientation ? { orientation } : {}),
  });
  if (count === 1) {
    return normalizePhoto(Array.isArray(data) ? data[0] : data);
  }
  return (Array.isArray(data) ? data : [data]).map(normalizePhoto);
}

/**
 * Get a single photo by its Unsplash photo_id.
 * @param {string} photoId - Unsplash photo ID
 * @returns {Promise<object>} Normalized photo
 */
export async function getUnsplashPhoto(photoId) {
  const data = await backendUnsplashRequest(`/api/public/unsplash/photos/${photoId}`);
  return normalizePhoto(data);
}

/**
 * Build a direct Unsplash CDN image URL from a photo_id (no API key needed).
 * Matches the photo_image_url format used in the Unsplash dataset TSV files.
 * @param {string} photoId - Unsplash photo ID
 * @param {object} params - { w, h, q, fit, auto } — Imgix params supported by Unsplash CDN
 * @returns {string} CDN image URL
 */
export function buildUnsplashImageUrl(photoId, params = {}) {
  const { w = 800, q = 80, fit = 'crop', auto = 'format' } = params;
  const url = new URL(`https://images.unsplash.com/photo-${photoId}`);
  url.searchParams.set('w', w);
  url.searchParams.set('q', q);
  url.searchParams.set('fit', fit);
  url.searchParams.set('auto', auto);
  return url.toString();
}

/**
 * Format an attribution string as required by the Unsplash license.
 * @param {object} photo - Normalized photo object
 * @returns {string}
 */
export function unsplashAttribution(photo) {
  const name = [photo.photographer_first_name, photo.photographer_last_name].filter(Boolean).join(' ')
    || photo.photographer_username
    || 'Unknown';
  return `Photo by ${name} on Unsplash`;
}
