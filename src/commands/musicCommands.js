import {
  ActivityType,
  MessageFlags
} from "discord.js";

import { MAX_QUEUE_DISPLAY } from "../config.js";
import { msg } from "../messages.js";
import {
  getCachedAudioUrl,
  isFailedRecently,
  markFailedQuery,
  resolveYoutubeQuery
} from "../music/youtube.js";
import {
  getDisplayTitle,
  saveTrackMeta
} from "../music/trackStore.js";

function setIdleActivity(client) {
  client.user?.setActivity("음악 대기 중이에요 🎧", {
    type: ActivityType.Listening
  });
}

function setPlayingActivity(client, title) {
  client.user?.setActivity(`🎵 ${title}`, {
    type: ActivityType.Listening
  });
}

export async function handleMusicCommand(interaction, distube, client) {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.guild) return;

  const command = interaction.commandName;

  if (command === "play") {
    return handlePlay(interaction, distube);
  }

  if (command === "skip") {
    return handleSkip(interaction, distube, client);
  }

  if (command === "stop") {
    return handleStop(interaction, distube, client);
  }

  if (command === "queue") {
    return handleQueue(interaction, distube);
  }
}

async function handlePlay(interaction, distube) {
  const query = interaction.options.getString("query", true).trim();

  const member = await interaction.guild.members.fetch(interaction.user.id);
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({
      content: msg.noVoice,
      flags: MessageFlags.Ephemeral
    });
  }

  if (!query) {
    return interaction.reply({
      content: msg.emptyQuery,
      flags: MessageFlags.Ephemeral
    });
  }

  await interaction.deferReply();

  try {
    if (isFailedRecently(query)) {
      return interaction.editReply(msg.failedRecently(query));
    }

    const resolved = await resolveYoutubeQuery(query);

    if (!resolved) {
      return interaction.editReply(msg.searchFailed(query));
    }

    let audioUrl;

    try {
      audioUrl = await getCachedAudioUrl(resolved.youtubeUrl);
    } catch (error) {
      console.error("오디오 URL 추출 실패:", error.message);
      markFailedQuery(query);

      return interaction.editReply(msg.audioExtractFailed(query));
    }

    const meta = {
      title: resolved.title || query,
      youtubeUrl: resolved.youtubeUrl,
      query,
      duration: resolved.duration,
      author: resolved.author,
      thumbnail: resolved.thumbnail
    };

    saveTrackMeta(audioUrl, meta);

    await distube.play(voiceChannel, audioUrl, {
      textChannel: interaction.channel,
      member,
      metadata: meta
    });

    return interaction.editReply(msg.playRequested(meta.title));
  } catch (error) {
    console.error("play 처리 오류:", error);

    markFailedQuery(query);

    return interaction.editReply(msg.playFailed(query));
  }
}

async function handleSkip(interaction, distube, client) {
  const queue = distube.getQueue(interaction.guildId);

  if (!queue) {
    return interaction.reply({
      content: msg.noPlaying,
      flags: MessageFlags.Ephemeral
    });
  }

  try {
    if (queue.songs.length <= 1) {
      queue.stop();
      setIdleActivity(client);

      return interaction.reply(msg.skippedAndStopped);
    }

    await queue.skip();

    return interaction.reply(msg.skipped);
  } catch (error) {
    console.error("스킵 오류:", error);

    if (error.errorCode === "NO_UP_NEXT") {
      queue.stop();
      setIdleActivity(client);

      return interaction.reply(msg.skippedAndStopped);
    }

    return interaction.reply({
      content: msg.error(error.message),
      flags: MessageFlags.Ephemeral
    });
  }
}

async function handleStop(interaction, distube, client) {
  const queue = distube.getQueue(interaction.guildId);

  if (!queue) {
    return interaction.reply({
      content: msg.noPlaying,
      flags: MessageFlags.Ephemeral
    });
  }

  queue.stop();
  setIdleActivity(client);

  return interaction.reply(msg.stopped);
}

async function handleQueue(interaction, distube) {
  const queue = distube.getQueue(interaction.guildId);

  if (!queue || !queue.songs.length) {
    return interaction.reply({
      content: msg.emptyQueue,
      flags: MessageFlags.Ephemeral
    });
  }

  const songs = queue.songs
    .slice(0, MAX_QUEUE_DISPLAY)
    .map((song, index) => {
      const title = getDisplayTitle(song);

      if (index === 0) {
        return `🎤 지금 재생 중: **${title}**`;
      }

      return `\`${index}.\` 🎵 **${title}**`;
    })
    .join("\n");

  const hiddenCount = queue.songs.length - MAX_QUEUE_DISPLAY;
  const moreText = hiddenCount > 0 ? msg.queueMore(hiddenCount) : "";

  return interaction.reply(`${msg.queueTitle}\n\n${songs}${moreText}`);
}

export function registerPlayerEvents(distube, client) {
  distube
    .on("playSong", (queue, song) => {
      const title = getDisplayTitle(song);

      queue.textChannel?.send(msg.nowPlaying(title));
      setPlayingActivity(client, title);
    })
    .on("addSong", (queue, song) => {
      const title = getDisplayTitle(song);

      queue.textChannel?.send(msg.addedSong(title));
    })
    .on("finish", queue => {
      queue.textChannel?.send(msg.finish);
      setIdleActivity(client);
    })
    .on("error", (error, queue) => {
      console.error("DisTube 오류:", error);

      const textChannel = queue?.textChannel;

      if (textChannel) {
        textChannel.send(msg.distubeError(error.message));
      }

      setIdleActivity(client);
    });
}
