import { MessageFlags, EmbedBuilder } from "discord.js";

import { msg } from "../messages.js";
import { addPlaylistTrack, createPlaylist, deletePlaylist, getPlaylist, listPlaylists, removePlaylistTrack } from "../data/playlistsStore.js";
import { metaFromSong } from "../music/trackStore.js";
import { resolveYoutubeQuery } from "../music/youtube.js";
import { queueTrack } from "../music/playService.js";

export async function handlePlaylistCommand(interaction, distube) {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "playlist") return false;
  const sub = interaction.options.getSubcommand();
  if (sub === "create") return playlistCreate(interaction);
  if (sub === "delete") return playlistDelete(interaction);
  if (sub === "add") return playlistAdd(interaction, distube);
  if (sub === "list") return playlistList(interaction);
  if (sub === "show") return playlistShow(interaction);
  if (sub === "play") return playlistPlay(interaction, distube);
  if (sub === "remove") return playlistRemove(interaction);
  return false;
}

async function playlistCreate(interaction) {
  const name = interaction.options.getString("name", true).trim();
  await createPlaylist(interaction.guildId, name);
  return interaction.reply(msg.playlistCreated(name));
}

async function playlistDelete(interaction) {
  const name = interaction.options.getString("name", true).trim();
  await deletePlaylist(interaction.guildId, name);
  return interaction.reply(msg.playlistDeleted(name));
}

async function playlistAdd(interaction, distube) {
  const name = interaction.options.getString("name", true).trim();
  const query = interaction.options.getString("query")?.trim();
  await interaction.deferReply();

  let meta;
  if (query) {
    const resolved = await resolveYoutubeQuery(query);
    if (!resolved) return interaction.editReply(msg.searchFailed(query));
    meta = resolved;
  } else {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue || !queue.songs.length) return interaction.editReply(msg.noPlaying);
    meta = metaFromSong(queue.songs[0]);
  }

  await addPlaylistTrack(interaction.guildId, name, meta);
  return interaction.editReply(msg.playlistAdded(name, meta.title));
}

async function playlistList(interaction) {
  const playlists = await listPlaylists(interaction.guildId);
  if (!playlists.length) return interaction.reply({ content: "아직 플레이리스트가 없어요~ 📚", flags: MessageFlags.Ephemeral });
  const description = playlists.map(item => `📚 **${item.name}** - ${item.count}곡`).join("\n");
  return interaction.reply({ embeds: [new EmbedBuilder().setColor(0x39c5bb).setTitle("미쿠 플레이리스트").setDescription(description)] });
}

async function playlistShow(interaction) {
  const name = interaction.options.getString("name", true).trim();
  const list = await getPlaylist(interaction.guildId, name);
  if (!list) return interaction.reply({ content: msg.playlistNotFound(name), flags: MessageFlags.Ephemeral });
  if (!list.length) return interaction.reply({ content: msg.playlistEmpty(name), flags: MessageFlags.Ephemeral });
  const description = list.slice(0, 30).map((item, index) => `\`${index + 1}.\` **${item.title}**`).join("\n");
  return interaction.reply({ embeds: [new EmbedBuilder().setColor(0x39c5bb).setTitle(`📚 ${name}`).setDescription(description)] });
}

async function playlistPlay(interaction, distube) {
  const name = interaction.options.getString("name", true).trim();
  const list = await getPlaylist(interaction.guildId, name);
  if (!list) return interaction.reply({ content: msg.playlistNotFound(name), flags: MessageFlags.Ephemeral });
  if (!list.length) return interaction.reply({ content: msg.playlistEmpty(name), flags: MessageFlags.Ephemeral });

  const member = await interaction.guild.members.fetch(interaction.user.id);
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) return interaction.reply({ content: msg.noVoice, flags: MessageFlags.Ephemeral });

  await interaction.deferReply();
  for (const item of list) {
    await queueTrack({ distube, voiceChannel, textChannel: interaction.channel, member, query: item, requesterId: interaction.user.id });
  }
  return interaction.editReply(`**${name}** 플레이리스트 ${list.length}곡을 큐에 넣었어요~ 🎧`);
}

async function playlistRemove(interaction) {
  const name = interaction.options.getString("name", true).trim();
  const index = interaction.options.getInteger("index", true) - 1;
  const removed = await removePlaylistTrack(interaction.guildId, name, index);
  if (!removed) return interaction.reply({ content: "그 번호의 곡을 못 찾았어요~ 🥲", flags: MessageFlags.Ephemeral });
  return interaction.reply(`**${name}**에서 **${removed.title}** 곡을 뺐어요~ 🧹`);
}
