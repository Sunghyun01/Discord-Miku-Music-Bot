const searchSessions = new Map();
const SESSION_TTL_MS = 1000 * 60 * 10;

function createSessionId() {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function saveSearchSession({ userId, query, results }) {
    const sessionId = createSessionId();

    searchSessions.set(sessionId, {
        userId,
        query,
        results,
        createdAt: Date.now()
    });

    return sessionId;
}

export function getSearchSession(sessionId) {
    const session = searchSessions.get(sessionId);

    if (!session) {
        return null;
    }

    if (Date.now() - session.createdAt > SESSION_TTL_MS) {
        searchSessions.delete(sessionId);
        return null;
    }

    return session;
}

export function deleteSearchSession(sessionId) {
    searchSessions.delete(sessionId);
}