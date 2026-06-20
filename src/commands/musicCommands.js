import { ActivityType, MessageFlags } from "discord.js";

import { msg } from "../messages.js";
import { createMusicControlRow, createNowPlayingEmbed, createQueueEmbed } from "../../ui/musicEmbeds.js";
import { getDisplayTitle, metaFromSong } from "../music/trackStore.js";
import { rememberRecentTrack } from "../music/playbackState.js";
import { queueTrack } from "../music/playService.js";
import { addFavorite } from "../data/favoritesStore.js";
import { resetAutoDjCount } from "../data/settingsStore.js";

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

async function handleNowPlaying(interaction, distube) {
  const queue = distube.getQueue(interaction.guildId);
  if (!queue || !queue.songs.length) {
    return interaction.reply({ content: msg.noPlaying, flags: MessageFlags.Ephemeral });
  }
  return interaction.reply({ embeds: [createNowPlayingEmbed(queue)], components: [createMusicControlRow()] });
}

export function registerPlayerEvents(distube, client, onFinishCallback = null) {
  distube
    .on("playSong", (queue, song) => {
      const title = getDisplayTitle(song);
      rememberRecentTrack(queue.id, title);
      queue.textChannel?.send({
        content: msg.nowPlaying(title),
        embeds: [createNowPlayingEmbed(queue)],
        components: [createMusicControlRow()]
      });
      setPlayingActivity(client, title);
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
