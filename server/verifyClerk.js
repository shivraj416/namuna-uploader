const { Clerk } = require("@clerk/clerk-sdk-node");

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// ✅ Middleware to validate Bearer token
module.exports = async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("No Authorization header");

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) throw new Error("No token provided");

    const session = await clerk.sessions.verifyToken(token);
    req.user = session.user; // optional: attach user to request
    next();
  } catch (err) {
    console.error("Clerk auth error:", err);
    return res.status(401).json({ error: "Unauthenticated" });
  }
};
