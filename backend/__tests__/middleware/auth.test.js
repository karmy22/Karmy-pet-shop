jest.mock('../../firebaseAdmin', () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

const { requireAuth, requireAdmin } = require('../../middleware/auth');
const { auth } = require('../../firebaseAdmin');

function buildResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('requireAuth', () => {
  beforeEach(() => {
    auth.verifyIdToken.mockReset();
  });

  it('returns 401 when Authorization header is absent', async () => {
    const req = { headers: {} };
    const res = buildResponse();
    const next = jest.fn();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing bearer token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header is not a Bearer token', async () => {
    const req = { headers: { authorization: 'Basic sometoken' } };
    const res = buildResponse();
    const next = jest.fn();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing bearer token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches user to request and calls next() for a valid token', async () => {
    auth.verifyIdToken.mockResolvedValue({
      uid: 'user-123',
      email: 'user@example.com',
      name: 'Test User',
    });

    const req = { headers: { authorization: 'Bearer valid-token' } };
    const res = buildResponse();
    const next = jest.fn();

    await requireAuth(req, res, next);

    expect(auth.verifyIdToken).toHaveBeenCalledWith('valid-token');
    expect(req.user).toEqual({ uid: 'user-123', email: 'user@example.com', name: 'Test User' });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('falls back to null for missing email and name in the decoded token', async () => {
    auth.verifyIdToken.mockResolvedValue({ uid: 'anon-456' });

    const req = { headers: { authorization: 'Bearer token-without-profile' } };
    const res = buildResponse();
    const next = jest.fn();

    await requireAuth(req, res, next);

    expect(req.user).toEqual({ uid: 'anon-456', email: null, name: null });
    expect(next).toHaveBeenCalled();
  });

  it('returns 401 when Firebase rejects the token', async () => {
    auth.verifyIdToken.mockRejectedValue(new Error('Token expired'));

    const req = { headers: { authorization: 'Bearer expired-token' } };
    const res = buildResponse();
    const next = jest.fn();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });
});

describe('requireAdmin', () => {
  const originalEnv = process.env.ADMIN_EMAILS;

  beforeEach(() => {
    process.env.ADMIN_EMAILS = 'admin@example.com,superadmin@example.com';
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.ADMIN_EMAILS;
    } else {
      process.env.ADMIN_EMAILS = originalEnv;
    }
  });

  it('calls next() and sets isAdmin when email matches', () => {
    const req = { user: { email: 'admin@example.com' } };
    const res = buildResponse();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.isAdmin).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('is case-insensitive for admin email matching', () => {
    const req = { user: { email: 'ADMIN@EXAMPLE.COM' } };
    const res = buildResponse();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.isAdmin).toBe(true);
  });

  it('returns 403 when user email is not in the admin list', () => {
    const req = { user: { email: 'regular@example.com' } };
    const res = buildResponse();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when user has no email', () => {
    const req = { user: { email: null } };
    const res = buildResponse();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when ADMIN_EMAILS env variable is empty', () => {
    process.env.ADMIN_EMAILS = '';
    const req = { user: { email: 'admin@example.com' } };
    const res = buildResponse();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('handles whitespace around configured admin emails', () => {
    process.env.ADMIN_EMAILS = '  admin@example.com  ,  other@example.com  ';
    const req = { user: { email: 'admin@example.com' } };
    const res = buildResponse();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
