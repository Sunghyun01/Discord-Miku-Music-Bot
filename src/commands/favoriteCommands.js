import { MessageFlags, EmbedBuilder } from "discord.js";

import { msg } from "../messages.js";
import { addFavorite, getUserFavorites, removeFavorite } from "../data/favoritesStore.js";
import { metaFromSong } from "../music/trackStore.js";
import { resolveYoutubeQuery } from "../music/youtube.js";
import { queueTrack } from "../music/playService.js";

export async function handleFavoriteCommand(interaction, distube) {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "favorite") return false;

  const sub = interaction.options.getSubcommand();
  if (sub === "add") return favoriteAdd(interaction, distube);
  if (sub === "list") return favoriteList(interaction);
  if (sub === "play") return favoritePlay(interaction, distube);
  if (sub === "remove") return favoriteRemove(interaction);
  return false;
}

async function favoriteAdd(interaction, distube) {
  const query = interaction.options.getString("query")?.trim();
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

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

  await addFavorite(interaction.guildId, interaction.user.id, meta);
  return interaction.editReply(msg.favoriteAdded(meta.title));
}

async function favoriteList(interaction) {
  const list = await getUserFavorites(interaction.guildId, interaction.user.id);
  if (!list.length) return interaction.reply({ content: msg.favoriteEmpty, flags: MessageFlags.Ephemeral });

  const description = list.slice(0, 20).map((item, index) => `\`${index + 1}.\` **${item.title}**`).join("\n");
  const embed = new EmbedBuilder().setColor(0x39c5bb).setTitle("⭐ 미쿠 별빛 보관함").setDescription(description);
  return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}

async function favoritePlay(interaction, distube) {
  const index = interaction.options.getInteger("index", true) - 1;
  const list = await getUserFavorites(interaction.guildId, interaction.user.id);
  const item = list[index];
  if (!item) return interaction.reply({ content: "그 번호의 즐겨찾기를 못 찾았어요~ 🥲", flags: MessageFlags.Ephemeral });

  const member = await interaction.guild.members.fetch(interaction.user.id);
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) return interaction.reply({ content: msg.noVoice, flags: MessageFlags.Ephemeral });

  await interaction.deferReply();
  const meta = await queueTrack({ distube, voiceChannel, textChannel: interaction.channel, member, query: item, requesterId: interaction.user.id });
  return interaction.editReply(msg.playRequested(meta.title));
}

async function favoriteRemove(interaction) {
  const index = interaction.options.getInteger("index", true) - 1;
  const removed = await removeFavorite(interaction.guildId, interaction.user.id, index);
  if (!removed) return interaction.reply({ content: "그 번호의 즐겨찾기를 못 찾았어요~ 🥲", flags: MessageFlags.Ephemeral });
  return interaction.reply({ content: msg.favoriteRemoved(removed.title), flags: MessageFlags.Ephemeral });
}
