import { guildFile } from "./paths.js";
import { readJson, writeJson } from "./jsonStore.js";

const defaultPlaylists = { playlists: {} };

function playlistsPath(guildId) {
  return guildFile(guildId, "playlists.json");
}

export async function getPlaylistsData(guildId) {
  return readJson(playlistsPath(guildId), defaultPlaylists);
}

export async function getPlaylist(guildId, name) {
  const data = await getPlaylistsData(guildId);
  return data.playlists[name] || null;
}

export async function listPlaylists(guildId) {
  const data = await getPlaylistsData(guildId);
  return Object.entries(data.playlists).map(([name, tracks]) => ({
    name,
    count: tracks.length
  }));
}

export async function createPlaylist(guildId, name) {
  const data = await getPlaylistsData(guildId);
  if (!data.playlists[name]) data.playlists[name] = [];
  await writeJson(playlistsPath(guildId), data);
  return data.playlists[name];
}

export async function deletePlaylist(guildId, name) {
  const data = await getPlaylistsData(guildId);
  delete data.playlists[name];
  await writeJson(playlistsPath(guildId), data);
}

export async function addPlaylistTrack(guildId, name, track) {
  const data = await getPlaylistsData(guildId);
  if (!data.playlists[name]) data.playlists[name] = [];
  data.playlists[name].push({
    title: track.title,
    youtubeUrl: track.youtubeUrl,
    duration: track.duration || null,
    author: track.author || null,
    thumbnail: track.thumbnail || null,
    addedAt: new Date().toISOString()
  });
  await writeJson(playlistsPath(guildId), data);
  return data.playlists[name];
}

export async function removePlaylistTrack(guildId, name, index) {
  const data = await getPlaylistsData(guildId);
  const list = data.playlists[name] || [];
  const [removed] = list.splice(index, 1);
  data.playlists[name] = list;
  await writeJson(playlistsPath(guildId), data);
  return removed || null;
}
