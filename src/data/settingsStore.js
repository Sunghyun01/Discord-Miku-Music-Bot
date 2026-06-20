import { guildFile } from "./paths.js";
import { readJson, writeJson } from "./jsonStore.js";

const defaultSettings = {
  aiChannelId: null,
  autoDj: {
    enabled: false,
    mood: "미쿠 추천",
    maxAutoPlayCount: 10,
    currentAutoPlayCount: 0
  },
  dashboard: {
    enabled: true
  }
};

function settingsPath(guildId) {
  return guildFile(guildId, "settings.json");
}

export async function getGuildSettings(guildId) {
  const settings = await readJson(settingsPath(guildId), defaultSettings);
  return {
    ...structuredClone(defaultSettings),
    ...settings,
    autoDj: {
      ...defaultSettings.autoDj,
      ...(settings.autoDj || {})
    }
  };
}

export async function saveGuildSettings(guildId, settings) {
  await writeJson(settingsPath(guildId), settings);
  return settings;
}

export async function updateGuildSettings(guildId, updater) {
  const settings = await getGuildSettings(guildId);
  const next = await updater(settings);
  return saveGuildSettings(guildId, next ?? settings);
}

export async function setAiChannel(guildId, channelId) {
  return updateGuildSettings(guildId, settings => {
    settings.aiChannelId = channelId;
    return settings;
  });
}

export async function isAiAllowedInChannel(guildId, channelId) {
  const settings = await getGuildSettings(guildId);
  return !settings.aiChannelId || settings.aiChannelId === channelId;
}

export async function setAutoDj(guildId, enabled, mood = null) {
  return updateGuildSettings(guildId, settings => {
    settings.autoDj.enabled = enabled;
    if (mood !== null && mood !== undefined && String(mood).trim()) {
      settings.autoDj.mood = String(mood).trim();
    }
    if (!enabled) {
      settings.autoDj.currentAutoPlayCount = 0;
    }
    return settings;
  });
}

export async function incrementAutoDjCount(guildId) {
  return updateGuildSettings(guildId, settings => {
    settings.autoDj.currentAutoPlayCount += 1;
    return settings;
  });
}

export async function resetAutoDjCount(guildId) {
  return updateGuildSettings(guildId, settings => {
    settings.autoDj.currentAutoPlayCount = 0;
    return settings;
  });
}
