import { MessageFlags } from "discord.js";

import { msg } from "../messages.js";
import { createMusicControlRow, createNowPlayingEmbed, createQueueEmbed, musicButtonIds } from "../../ui/musicEmbeds.js";
import { setIdleActivity, favoriteCurrentSong } from "../commands/musicCommands.js";
import { getRecommendationSession } from "../music/recommendationSessions.js";
import { queueTrack } from "../music/playService.js";

export async function handleButtonInteraction(interaction, distube, client) {
  if (!interaction.isButton()) return false;

  if (Object.values(musicButtonIds).includes(interaction.customId)) {
    return handleMusicButton(interaction, distube, client);
  }

  if (interaction.customId.startsWith("recplay:")) {
    return handleRecommendPlayButton(interaction, distube);
  }

  return false;
}

async function handleMusicButton(interaction, distube, client) {
  const queue = distube.getQueue(interaction.guildId);

  if (interaction.customId === musicButtonIds.favorite) {
    return favoriteCurrentSong(interaction, distube);
  }

  if (!queue || !queue.songs.length) {
    await interaction.reply({ content: msg.noPlaying, flags: MessageFlags.Ephemeral });
    return true;
  }

  if (interaction.customId === musicButtonIds.skip) {
    if (queue.songs.length <= 1) {
      queue.stop();
      setIdleActivity(client);
      await interaction.reply(msg.skippedAndStopped);
    } else {
      await queue.skip();
      await interaction.reply(msg.skipped);
    }
    return true;
  }

  if (interaction.customId === musicButtonIds.stop) {
    queue.stop();
    setIdleActivity(client);
    await interaction.reply(msg.stopped);
    return true;
  }

  if (interaction.customId === musicButtonIds.queue) {
    await interaction.reply({ embeds: [createQueueEmbed(queue)], flags: MessageFlags.Ephemeral });
    return true;
  }

  if (interaction.customId === musicButtonIds.nowPlaying) {
    await interaction.reply({ embeds: [createNowPlayingEmbed(queue)], components: [createMusicControlRow()], flags: MessageFlags.Ephemeral });
    return true;
  }

  return true;
}

async function handleRecommendPlayButton(interaction, distube) {
  const [, sessionId, rawIndex] = interaction.customId.split(":");
  const session = getRecommendationSession(sessionId);
  const index = Number(rawIndex);

  if (!session || session.guildId !== interaction.guildId) {
    await interaction.reply({ content: "추천 목록이 만료됐어요~ 다시 추천받아줘요 🫧", flags: MessageFlags.Ephemeral });
    return true;
  }

  const item = session.recommendations[index];
  if (!item) {
    await interaction.reply({ content: "그 추천곡을 찾지 못했어요~", flags: MessageFlags.Ephemeral });
    return true;
  }

  const member = await interaction.guild.members.fetch(interaction.user.id);
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) {
    await interaction.reply({ content: msg.noVoice, flags: MessageFlags.Ephemeral });
    return true;
  }

  await interaction.deferReply();
  const meta = await queueTrack({ distube, voiceChannel, textChannel: interaction.channel, member, query: item, requesterId: interaction.user.id });
  await interaction.editReply(msg.playRequested(meta.title));
  return true;
}
