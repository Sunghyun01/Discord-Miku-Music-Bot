import {
    ActivityType,
    ActionRowBuilder,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder
} from "discord.js";
import { msg } from "../messages.js";
import { createMusicControlRow, createNowPlayingEmbed, createQueueEmbed } from "../../ui/musicEmbeds.js";
import { getDisplayTitle, metaFromSong } from "../music/trackStore.js";
import { rememberRecentTrack } from "../music/playbackState.js";
import { queueTrack } from "../music/playService.js";
import { addFavorite } from "../data/favoritesStore.js";
import { resetAutoDjCount } from "../data/settingsStore.js";
import { searchYoutubeVideos } from "../music/youtube.js";
import { saveSearchSession } from "../music/searchSessionStore.js";
import { createDjMent } from "../../ai/djMentClient.js";
import { rateTrackWithAi } from "../../ai/ratingClient.js";
import { saveRating } from "../data/ratingStore.js";
import {
    isDjMentEnabled,
    setDjMentEnabled
} from "../data/djMentStore.js";
import { getTrackMeta } from "../music/trackStore.js";

export function setIdleActivity(client) {
    client.user?.setActivity("음악 대기 중이에요 🎧", { type: ActivityType.Listening });
}

export function setPlayingActivity(client, title) {
    client.user?.setActivity(`🎵 ${title}`, { type: ActivityType.Listening });
}

export async function handleMusicCommand(interaction, distube, client) {
    if (!interaction.isChatInputCommand()) return false;
    if (!interaction.guild) return false;

    const command = interaction.commandName;
    if (command === "play") return handlePlay(interaction, distube);
    if (command === "skip") return handleSkip(interaction, distube, client);
    if (command === "stop") return handleStop(interaction, distube, client);
    if (command === "queue") return handleQueue(interaction, distube);
    if (command === "nowplaying") return handleNowPlaying(interaction, distube);
    if (command === "search") {
        return handleSearch(interaction);
    }

    if (command === "rate") {
        return handleRate(interaction, distube);
    }

    if (command === "djment") {
        return handleDjMent(interaction);
    }
    return false;
}

async function handlePlay(interaction, distube) {
    const query = interaction.options.getString("query", true).trim();
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) return interaction.reply({ content: msg.noVoice, flags: MessageFlags.Ephemeral });
    if (!query) return interaction.reply({ content: msg.emptyQuery, flags: MessageFlags.Ephemeral });

    await interaction.deferReply();

    try {
        const meta = await queueTrack({
            distube,
            voiceChannel,
            textChannel: interaction.channel,
            member,
            query,
            requesterId: interaction.user.id
        });

        if (!meta) return interaction.editReply(msg.searchFailed(query));
        await resetAutoDjCount(interaction.guildId);
        return interaction.editReply(msg.playRequested(meta.title));
    } catch (error) {
        console.error("play 처리 오류:", error);
        return interaction.editReply(msg.playFailed(query));
    }
}

async function handleSkip(interaction, distube, client) {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: msg.noPlaying, flags: MessageFlags.Ephemeral });

    try {
        if (queue.songs.length <= 1) {
            queue.stop();
            setIdleActivity(client);
            return interaction.reply(msg.skippedAndStopped);
        }
        await queue.skip();
        return interaction.reply(msg.skipped);
    } catch (error) {
        if (error.errorCode === "NO_UP_NEXT") {
            queue.stop();
            setIdleActivity(client);
            return interaction.reply(msg.skippedAndStopped);
        }
        return interaction.reply({ content: msg.error(error.message), flags: MessageFlags.Ephemeral });
    }
}

async function handleStop(interaction, distube, client) {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: msg.noPlaying, flags: MessageFlags.Ephemeral });
    queue.stop();
    setIdleActivity(client);
    return interaction.reply(msg.stopped);
}

async function handleQueue(interaction, distube) {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue || !queue.songs.length) {
        return interaction.reply({ content: msg.emptyQueue, flags: MessageFlags.Ephemeral });
    }
    return interaction.reply({ embeds: [createQueueEmbed(queue)] });
}

async function handleSearch(interaction) {
    const query = interaction.options.getString("query", true).trim();

    if (!query) {
        return interaction.reply({
            content: "검색어를 입력해줘요~ 미쿠가 노래를 찾을 수가 없어요 🫧",
            flags: MessageFlags.Ephemeral
        });
    }

    await interaction.deferReply();

    const results = await searchYoutubeVideos(query, 5);

    if (!results.length) {
        return interaction.editReply(
            `검색 결과를 찾지 못했어요... 🥲\n검색어: **${query}**`
        );
    }

    const sessionId = saveSearchSession({
        userId: interaction.user.id,
        query,
        results
    });

    const description = results
        .map((item, index) => {
            const duration = item.duration ? ` \`${item.duration}\`` : "";
            const author = item.author ? ` - ${item.author}` : "";

            return `\`${index + 1}.\` **${item.title}**${author}${duration}`;
        })
        .join("\n");

    const embed = new EmbedBuilder()
        .setTitle("🔎 미쿠가 찾은 노래들이에요~")
        .setDescription(description)
        .setFooter({
            text: "아래 선택 메뉴에서 재생할 곡을 골라줘요."
        });

    const select = new StringSelectMenuBuilder()
        .setCustomId(`music_search_select:${sessionId}`)
        .setPlaceholder("재생할 곡을 선택해줘요 🎧")
        .addOptions(
            results.map((item, index) => ({
                label: item.title.slice(0, 100),
                description: `${item.author || "알 수 없는 채널"} ${item.duration || ""}`.slice(0, 100),
                value: String(index)
            }))
        );

    const row = new ActionRowBuilder().addComponents(select);

    return interaction.editReply({
        embeds: [embed],
        components: [row]
    });
}

function formatRatingDisplay(rating) {
    if (rating < 0) {
        const skullCount = Math.min(5, Math.max(1, Math.abs(Math.round(rating))));
        return `${"💀".repeat(skullCount)} \`${rating.toFixed(1)} / 5.0\``;
    }

    const stars = "⭐".repeat(Math.max(1, Math.min(5, Math.round(rating))));
    return `${stars} \`${rating.toFixed(1)} / 5.0\``;
}

function normalizeRateResult(result) {
    return {
        rating: Number.isFinite(Number(result.rating)) ? Number(result.rating) : 4.0,
        summary: result.summary || "가볍게 듣기 좋은 곡이에요.",
        mikuComment:
            result.mikuComment ||
            "마스터, 미쿠가 보기엔 이 곡도 나름의 반짝임이 있어요 🩵",
        comedyMode: Boolean(result.comedyMode)
    };
}

async function handleRate(interaction, distube) {
    const queue = distube.getQueue(interaction.guildId);

    if (!queue || !queue.songs.length) {
        return interaction.reply({
            content: "지금 평가할 노래가 없어요~ 먼저 노래를 틀어줘요 🎧",
            flags: MessageFlags.Ephemeral
        });
    }

    await interaction.deferReply();

    const song = queue.songs[0];
    const meta = getTrackMeta(song);
    const userComment = interaction.options.getString("comment", false) || "";

    try {
        const rawResult = await rateTrackWithAi(meta, userComment);
        const result = normalizeRateResult(rawResult);

        await saveRating(interaction.guildId, {
            title: meta.title,
            youtubeUrl: meta.youtubeUrl,
            author: meta.author,
            rating: result.rating,
            summary: result.summary,
            mikuComment: result.mikuComment,
            userComment,
            comedyMode: result.comedyMode,
            requestedBy: interaction.user.id
        });

        const ratingDisplay = formatRatingDisplay(result.rating);

        const embed = new EmbedBuilder()
            .setTitle(
                result.comedyMode
                    ? "🎭 미쿠의 매운맛 별점이에요~"
                    : "🎧 미쿠의 노래 별점이에요~"
            )
            .setDescription(`**${meta.title || "제목 정보 없음"}**`)
            .addFields(
                {
                    name: result.comedyMode ? "예능 별점" : "별점",
                    value: ratingDisplay
                },
                {
                    name: "감상평",
                    value: result.summary
                },
                {
                    name: "미쿠 코멘트",
                    value: result.mikuComment
                }
            )
            .setFooter({
                text: result.comedyMode
                    ? "매운맛 평가예요. 실제 음원 분석이 아니라 제목과 제공된 정보 기준의 AI 감상평이에요."
                    : "실제 음원 분석이 아니라 제목과 제공된 정보 기준의 AI 감상평이에요."
            });

        if (meta.thumbnail) {
            embed.setThumbnail(meta.thumbnail);
        }

        return interaction.editReply({
            embeds: [embed]
        });
    } catch (error) {
        console.error("AI 별점 오류:", error);

        return interaction.editReply(
            `미쿠가 별점을 매기다가 삐끗했어요... 🥲\n\`${error.message}\``
        );
    }
}

async function handleDjMent(interaction) {
    const mode = interaction.options.getString("mode", true);
    const guildId = interaction.guildId;

    if (mode === "on") {
        await setDjMentEnabled(guildId, true);

        return interaction.reply(
            "AI DJ 멘트를 켰어요~ 이제 곡이 시작될 때 미쿠가 살짝 소개해줄게요 🎤✨"
        );
    }

    if (mode === "off") {
        await setDjMentEnabled(guildId, false);

        return interaction.reply(
            "AI DJ 멘트를 껐어요~ 이제 조용히 노래만 틀어줄게요 🎧"
        );
    }

    const enabled = await isDjMentEnabled(guildId);

    return interaction.reply(
        enabled
            ? "AI DJ 멘트는 지금 켜져 있어요~ 🎤🩵"
            : "AI DJ 멘트는 지금 꺼져 있어요~ 🫧"
    );
}

async function handleNowPlaying(interaction, distube) {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue || !queue.songs.length) {
        return interaction.reply({ content: msg.noPlaying, flags: MessageFlags.Ephemeral });
    }
    return interaction.reply({ embeds: [createNowPlayingEmbed(queue)], components: [createMusicControlRow()] });
}

export function registerPlayerEvents(distube, client, onFinishCallback = null) {
    distube
        .on("playSong", async (queue, song) => {
            const title = getDisplayTitle(song);
            const meta = getTrackMeta(song);

            queue.textChannel?.send(msg.nowPlaying(title));
            setPlayingActivity(client, title);

            try {
                const guildId = queue.textChannel?.guild?.id;

                if (!guildId) return;

                const enabled = await isDjMentEnabled(guildId);

                if (!enabled) return;

                const ment = await createDjMent(meta);

                queue.textChannel?.send(`🎙️ **미쿠 DJ 멘트**\n${ment}`);
            } catch (error) {
                console.error("AI DJ 멘트 오류:", error);
            }
        })
        .on("addSong", (queue, song) => {
            const title = getDisplayTitle(song);
            queue.textChannel?.send(msg.addedSong(title));
        })
        .on("finish", queue => {
            queue.textChannel?.send(msg.finish);
            setIdleActivity(client);
            if (onFinishCallback) {
                setTimeout(() => onFinishCallback(queue.id).catch(console.error), 1200);
            }
        })
        .on("error", (error, queue) => {
            console.error("DisTube 오류:", error);
            queue?.textChannel?.send(msg.distubeError(error.message));
            setIdleActivity(client);
        });
}

export async function favoriteCurrentSong(interaction, distube) {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue || !queue.songs.length) {
        return interaction.reply({ content: msg.noPlaying, flags: MessageFlags.Ephemeral });
    }
    const meta = metaFromSong(queue.songs[0]);
    await addFavorite(interaction.guildId, interaction.user.id, meta);
    return interaction.reply({ content: msg.favoriteAdded(meta.title), flags: MessageFlags.Ephemeral });
}
