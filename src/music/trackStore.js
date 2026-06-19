const trackMetaByUrl = new Map();

export function saveTrackMeta(audioUrl, meta) {
  if (!audioUrl || !meta) return;

  trackMetaByUrl.set(audioUrl, {
    title: meta.title,
    youtubeUrl: meta.youtubeUrl,
    query: meta.query,
    duration: meta.duration,
    author: meta.author,
    thumbnail: meta.thumbnail
  });
}

export function getTrackMeta(song) {
  if (!song) {
    return null;
  }

  if (song.metadata?.title) {
    return song.metadata;
  }

  const metaByUrl = trackMetaByUrl.get(song.url);

  if (metaByUrl?.title) {
    return metaByUrl;
  }

  if (song.name && !song.name.toLowerCase().includes("videoplayback")) {
    return {
      title: song.name
    };
  }

  return {
    title: "제목 정보 없음"
  };
}

export function getDisplayTitle(song) {
  return getTrackMeta(song)?.title || "제목 정보 없음";
}
