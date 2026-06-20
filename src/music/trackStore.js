const trackMetaByUrl = new Map();

export function saveTrackMeta(audioUrl, meta) {
  if (!audioUrl || !meta) return;
  trackMetaByUrl.set(audioUrl, { ...meta });
}

export function getTrackMeta(song) {
  if (!song) return null;
  if (song.metadata?.title) return song.metadata;

  const metaByUrl = trackMetaByUrl.get(song.url);
  if (metaByUrl?.title) return metaByUrl;

  if (song.name && !song.name.toLowerCase().includes("videoplayback")) {
    return { title: song.name, youtubeUrl: song.url };
  }

  return { title: "제목 정보 없음", youtubeUrl: song.url };
}

export function getDisplayTitle(song) {
  return getTrackMeta(song)?.title || "제목 정보 없음";
}

export function metaFromSong(song) {
  const meta = getTrackMeta(song);
  return {
    title: meta?.title || getDisplayTitle(song),
    youtubeUrl: meta?.youtubeUrl || song?.url,
    duration: meta?.duration || null,
    author: meta?.author || null,
    thumbnail: meta?.thumbnail || null
  };
}
