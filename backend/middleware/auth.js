const { auth } = require('../firebaseAdmin');

async function requireAuth(request, response, next) {
  try {
    const authHeader = request.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return response.status(401).json({ error: 'Missing bearer token' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    request.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
    };

    return next();
  } catch (error) {
    return response.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(request, response, next) {
  const configuredEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const userEmail = (request.user?.email || '').toLowerCase();
  if (!userEmail || !configuredEmails.includes(userEmail)) {
    return response.status(403).json({ error: 'Admin access required' });
  }

  request.user.isAdmin = true;
  return next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};
