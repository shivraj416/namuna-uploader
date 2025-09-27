const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// ✅ Middleware to protect API routes
// If not signed in, it will throw 401 automatically
module.exports = ClerkExpressRequireAuth();
