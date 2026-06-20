import crypto from "node:crypto";

const sessions = new Map();
const SESSION_TTL_MS = 1000 * 60 * 10;

export function createRecommendationSession(guildId, userId, recommendations) {
  const id = crypto.randomBytes(4).toString("hex");
  sessions.set(id, {
    guildId,
    userId,
    recommendations,
    expiresAt: Date.now() + SESSION_TTL_MS
  });
  return id;
}

export function getRecommendationSession(id) {
  const session = sessions.get(id);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(id);
    return null;
  }
  return session;
}
