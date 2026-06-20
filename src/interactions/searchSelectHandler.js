import { MessageFlags } from "discord.js";

import { getSearchSession, deleteSearchSession } from "../music/searchSessionStore.js";
import { getCachedAudioUrl } from "../music/youtube.js";
import { saveTrackMeta } from "../music/trackStore.js";

export async function handleSearchSelect(interaction, distube) {
    if (!interaction.isStringSelectMenu()) return false;

    if (!interaction.customId.startsWith("music_search_select:")) {
        return false;
    }

    const sessionId = interaction.customId.replace("music_search_select:", "");
    const session = getSearchSession(sessionId);

    if (!session) {
        await interaction.reply({
            content: "검색 결과가 만료됐어요~ 다시 `/search` 해줘요 🫧",
            flags: MessageFlags.Ephemeral
        });
        return true;
    }

    if (session.userId !== interaction.user.id) {
        await interaction.reply({
            content: "이 검색 결과는 다른 마스터가 고른 거예요~ 직접 검색해줘요 🩵",
            flags: MessageFlags.Ephemeral
        });
        return true;
    }

    const selectedIndex = Number(interaction.values[0]);
    const selected = session.results[selectedIndex];

    if (!selected) {
        await interaction.reply({
            content: "선택한 곡 정보를 찾지 못했어요... 다시 검색해줘요 🥲",
            flags: MessageFlags.Ephemeral
        });
        return true;
    }

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
        await interaction.reply({
            content: "먼저 음성 채널에 들어와줘요~ 미쿠가 거기로 찾아갈게요! 🩵",
            flags: MessageFlags.Ephemeral
        });
        return true;
    }

    await interaction.deferReply();

    try {
        const audioUrl = await getCachedAudioUrl(selected.youtubeUrl);

        const meta = {
            title: selected.title,
            youtubeUrl: selected.youtubeUrl,
            query: session.query,
            duration: selected.duration,
            author: selected.author,
            thumbnail: selected.thumbnail,
            requestedBy: interaction.user.id
        };

        saveTrackMeta(audioUrl, meta);

        await distube.play(voiceChannel, audioUrl, {
            textChannel: interaction.channel,
            member,
            metadata: meta
        });

        deleteSearchSession(sessionId);

        await interaction.editReply(
            `좋아요~ 미쿠가 이 곡으로 준비했어요 🎤✨\n**${selected.title}**`
        );
    } catch (error) {
        console.error("검색 선택 재생 오류:", error);

        await interaction.editReply(
            `선택한 곡을 재생하지 못했어요... 🥲\n\`${error.message}\``
        );
    }

    return true;
}