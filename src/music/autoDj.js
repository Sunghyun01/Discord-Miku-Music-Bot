import { msg } from "../messages.js";
import { generateRecommendationQueries } from "../../ai/recommendationClient.js";
import { getGuildSettings, incrementAutoDjCount, resetAutoDjCount } from "../data/settingsStore.js";
import { getPlaybackContext, getRecentTracks } from "./playbackState.js";
import { queueTrack } from "./playService.js";

export async function handleAutoDjFinish(distube, client, guildId) {
    const settings = await getGuildSettings(guildId);
    const autoDj = settings.autoDj;

    if (!autoDj.enabled) return;

    if (autoDj.currentAutoPlayCount >= autoDj.maxAutoPlayCount) {
        await resetAutoDjCount(guildId);
        return;
    }

    const context = getPlaybackContext(guildId);
    if (!context) return;

    const guild = client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId).catch(() => null);
    if (!guild) return;

    const voiceChannel = guild.channels.cache.get(context.voiceChannelId);
    const textChannel = guild.channels.cache.get(context.textChannelId);
    const member = guild.members.me || await guild.members.fetchMe().catch(() => null);

    if (!voiceChannel || !member) return;

    try {
        const queries = await generateRecommendationQueries(autoDj.mood || "미쿠 추천", getRecentTracks(guildId));
        const query = queries[0];
        const meta = await queueTrack({
            distube,
            voiceChannel,
            textChannel,
            member,
            query,
            requesterId: "auto-dj"
        });

        if (meta) {
            await incrementAutoDjCount(guildId);
            textChannel?.send(msg.autoDjNext(meta.title));
        }
    } catch (error) {
        console.error("자동 DJ 실패:", error);
        textChannel?.send(msg.autoDjFailed);
    }
}
