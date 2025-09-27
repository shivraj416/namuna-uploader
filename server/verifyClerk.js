const { Clerk } = require("@clerk/clerk-sdk-node");

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// ✅ Middleware to validate Bearer token from frontend
module.exports = async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // ✅ Correct method for newer SDKs
    const session = await clerk.sessions.verifySessionToken(token);
    if (!session) throw new Error("Invalid session token");

    req.user = session.user; // optional: attach user info
    next();
  } catch (err) {
    console.error("Clerk auth error:", err);
    return res.status(401).json({ error: "Unauthenticated" });
  }
};
