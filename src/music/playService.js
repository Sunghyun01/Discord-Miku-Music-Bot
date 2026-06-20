import { getCachedAudioUrl, markFailedQuery, resolveYoutubeQuery } from "./youtube.js";
import { saveTrackMeta } from "./trackStore.js";
import { savePlaybackContext } from "./playbackState.js";

export async function queueTrack({ distube, voiceChannel, textChannel, member, query, requesterId = null }) {
  const resolved = await resolveYoutubeQuery(query);
  if (!resolved) return null;

  let audioUrl;
  try {
    audioUrl = await getCachedAudioUrl(resolved.youtubeUrl);
  } catch (error) {
    console.error("오디오 URL 추출 실패:", error.message);
    markFailedQuery(typeof query === "string" ? query : resolved.query || resolved.youtubeUrl);
    throw error;
  }

  const meta = {
    title: resolved.title || (typeof query === "string" ? query : "제목 정보 없음"),
    youtubeUrl: resolved.youtubeUrl,
    query: resolved.query || query,
    duration: resolved.duration || null,
    author: resolved.author || null,
    thumbnail: resolved.thumbnail || null,
    requesterId
  };

  saveTrackMeta(audioUrl, meta);

  if (voiceChannel?.guild?.id) {
    savePlaybackContext(voiceChannel.guild.id, {
      voiceChannelId: voiceChannel.id,
      textChannelId: textChannel?.id,
      requesterId
    });
  }

  await distube.play(voiceChannel, audioUrl, {
    textChannel,
    member,
    metadata: meta
  });

  return meta;
}
