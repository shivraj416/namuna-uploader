// OPTIONAL: template. You should replace with Clerk's official middleware
// and verification from server side when you move to production.
// For now it's an example stub that checks for Authorization header.

module.exports = async function requireAuth(req, res, next) {
  // Example: expect an Authorization: Bearer <Clerk-Session-Token>
  // In production use Clerk SDK to validate the token.
  const auth = req.headers['authorization'];
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized - token missing' });
  }
  // TODO: validate token using Clerk SDK and set req.user
  // e.g., clerkClient.sessions.verifyToken(token) ...
  next();
};
