import { ChannelType, MessageFlags, PermissionFlagsBits } from "discord.js";

import { msg } from "../messages.js";
import { getGuildSettings, setAiChannel, setAutoDj } from "../data/settingsStore.js";

function requireManageGuild(interaction) {
  return interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);
}

export async function handleSettingsCommand(interaction) {
  if (!interaction.isChatInputCommand()) return false;

  if (interaction.commandName === "ai-channel") return handleAiChannel(interaction);
  if (interaction.commandName === "autodj") return handleAutoDj(interaction);
  return false;
}

async function handleAiChannel(interaction) {
  if (!requireManageGuild(interaction)) {
    return interaction.reply({ content: "서버 관리 권한이 필요해요~ 🛡️", flags: MessageFlags.Ephemeral });
  }

  const sub = interaction.options.getSubcommand();
  if (sub === "set") {
    const channel = interaction.options.getChannel("channel", true);
    if (![ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(channel.type)) {
      return interaction.reply({ content: "텍스트 채널만 설정할 수 있어요~", flags: MessageFlags.Ephemeral });
    }
    await setAiChannel(interaction.guildId, channel.id);
    return interaction.reply(msg.aiChannelSet(channel));
  }

  if (sub === "off") {
    await setAiChannel(interaction.guildId, null);
    return interaction.reply(msg.aiChannelOff);
  }

  if (sub === "status") {
    const settings = await getGuildSettings(interaction.guildId);
    if (!settings.aiChannelId) return interaction.reply(msg.aiChannelStatusAll);
    return interaction.reply(msg.aiChannelStatusOne(`<#${settings.aiChannelId}>`));
  }
}

async function handleAutoDj(interaction) {
  if (!requireManageGuild(interaction)) {
    return interaction.reply({ content: "서버 관리 권한이 필요해요~ 🛡️", flags: MessageFlags.Ephemeral });
  }

  const sub = interaction.options.getSubcommand();
  if (sub === "on") {
    const mood = interaction.options.getString("mood")?.trim() || "미쿠 추천";
    await setAutoDj(interaction.guildId, true, mood);
    return interaction.reply(msg.autoDjOn(mood));
  }
  if (sub === "off") {
    await setAutoDj(interaction.guildId, false);
    return interaction.reply(msg.autoDjOff);
  }
  if (sub === "status") {
    const settings = await getGuildSettings(interaction.guildId);
    return interaction.reply(settings.autoDj.enabled ? msg.autoDjStatusOn(settings.autoDj.mood) : msg.autoDjStatusOff);
  }
}
