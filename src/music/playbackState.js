import { MAX_RECENT_TRACKS } from "../../src/config.js";

const lastPlaybackContext = new Map();
const recentTracksByGuild = new Map();

export function savePlaybackContext(guildId, context) {
    lastPlaybackContext.set(String(guildId), {
        guildId: String(guildId),
        voiceChannelId: context.voiceChannelId,
        textChannelId: context.textChannelId,
        requesterId: context.requesterId || null,
        updatedAt: Date.now()
    });
}

export function getPlaybackContext(guildId) {
    return lastPlaybackContext.get(String(guildId)) || null;
}

export function rememberRecentTrack(guildId, title) {
    if (!title || title === "제목 정보 없음") return;
    const key = String(guildId);
    const list = recentTracksByGuild.get(key) || [];
    list.unshift(title);
    recentTracksByGuild.set(key, [...new Set(list)].slice(0, MAX_RECENT_TRACKS));
}

export function getRecentTracks(guildId) {
    return recentTracksByGuild.get(String(guildId)) || [];
}
