import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} from "discord.js";

import { MAX_QUEUE_DISPLAY } from "../src/config.js";
import { getDisplayTitle, getTrackMeta } from "../src/music/trackStore.js";

export const musicButtonIds = {
    skip: "music_skip",
    stop: "music_stop",
    queue: "music_queue",
    nowPlaying: "music_nowplaying",
    favorite: "music_favorite"
};

export function createMusicControlRow() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(musicButtonIds.skip).setLabel("스킵").setEmoji("⏭️").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(musicButtonIds.stop).setLabel("정지").setEmoji("⏹️").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(musicButtonIds.queue).setLabel("큐").setEmoji("📜").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(musicButtonIds.nowPlaying).setLabel("현재곡").setEmoji("🎤").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(musicButtonIds.favorite).setLabel("저장").setEmoji("⭐").setStyle(ButtonStyle.Success)
    );
}

export function createNowPlayingEmbed(queue) {
    const song = queue?.songs?.[0];
    const meta = getTrackMeta(song);
    const title = getDisplayTitle(song);
    const remaining = Math.max((queue?.songs?.length || 1) - 1, 0);

    const embed = new EmbedBuilder()
        .setColor(0x39c5bb)
        .setTitle("🎤 미쿠 온 스테이지!")
        .setDescription(`지금 부르는 곡은 **${title}** 이에요~ 🩵`)
        .addFields(
            { name: "대기열", value: `${remaining}곡`, inline: true },
            { name: "재생 상태", value: "재생 중", inline: true }
        )
        .setFooter({ text: "Miku Music Bot" })
        .setTimestamp(new Date());

    if (meta?.author) embed.addFields({ name: "채널", value: String(meta.author), inline: true });
    if (meta?.duration) embed.addFields({ name: "길이", value: String(meta.duration), inline: true });
    if (meta?.thumbnail) embed.setThumbnail(meta.thumbnail);
    if (meta?.youtubeUrl) embed.setURL(meta.youtubeUrl);

    return embed;
}

export function createQueueEmbed(queue) {
    const songs = queue.songs.slice(0, MAX_QUEUE_DISPLAY);
    const description = songs.map((song, index) => {
        const title = getDisplayTitle(song);
        if (index === 0) return `🎤 지금 재생 중: **${title}**`;
        return `\`${index}.\` 🎵 **${title}**`;
    }).join("\n");

    const hiddenCount = queue.songs.length - MAX_QUEUE_DISPLAY;

    return new EmbedBuilder()
        .setColor(0x39c5bb)
        .setTitle("🎼 미쿠의 현재 큐예요~")
        .setDescription(`${description}${hiddenCount > 0 ? `\n…그리고 **${hiddenCount}곡** 더 기다리는 중이에요~ 🩵` : ""}`)
        .setFooter({ text: `총 ${queue.songs.length}곡` })
        .setTimestamp(new Date());
}
