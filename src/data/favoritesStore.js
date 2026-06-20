import { guildFile } from "./paths.js";
import { readJson, writeJson } from "./jsonStore.js";

const defaultFavorites = { users: {} };

function favoritesPath(guildId) {
  return guildFile(guildId, "favorites.json");
}

export async function getFavoritesData(guildId) {
  return readJson(favoritesPath(guildId), defaultFavorites);
}

export async function getUserFavorites(guildId, userId) {
  const data = await getFavoritesData(guildId);
  return data.users[userId] || [];
}

export async function addFavorite(guildId, userId, track) {
  const data = await getFavoritesData(guildId);
  if (!data.users[userId]) data.users[userId] = [];

  const exists = data.users[userId].some(item => item.youtubeUrl === track.youtubeUrl);
  if (!exists) {
    data.users[userId].push({
      title: track.title,
      youtubeUrl: track.youtubeUrl,
      duration: track.duration || null,
      author: track.author || null,
      thumbnail: track.thumbnail || null,
      addedAt: new Date().toISOString()
    });
  }

  await writeJson(favoritesPath(guildId), data);
  return data.users[userId];
}

export async function removeFavorite(guildId, userId, index) {
  const data = await getFavoritesData(guildId);
  const list = data.users[userId] || [];
  const [removed] = list.splice(index, 1);
  data.users[userId] = list;
  await writeJson(favoritesPath(guildId), data);
  return removed || null;
}
