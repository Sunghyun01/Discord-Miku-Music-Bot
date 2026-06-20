import yts from "yt-search";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { AUDIO_CACHE_MS, FAILED_CACHE_MS, SEARCH_TIMEOUT_MS, YTDLP_TIMEOUT_MS } from "../../src/config.js";
import { isUrl, withTimeout } from "../utils/common.js";

const execFileAsync = promisify(execFile);
const failedQueryCache = new Map();
const audioCache = new Map();

export function isFailedRecently(query) {
  const failedAt = failedQueryCache.get(query);
  if (!failedAt) return false;
  if (Date.now() - failedAt > FAILED_CACHE_MS) {
    failedQueryCache.delete(query);
    return false;
  }
  return true;
}

export function markFailedQuery(query) {
  failedQueryCache.set(query, Date.now());
}

export async function resolveYoutubeQuery(query) {
  if (typeof query === "object" && query?.youtubeUrl) return query;

  if (isUrl(query)) {
    return { youtubeUrl: query, title: "YouTube URL 요청곡", query };
  }

  if (isFailedRecently(query)) return null;

  try {
    const result = await withTimeout(yts(query), SEARCH_TIMEOUT_MS, `검색 시간이 초과됐어: ${query}`);
    const video = result.videos?.[0];

    if (!video) {
      markFailedQuery(query);
      return null;
    }

    return {
      youtubeUrl: video.url,
      title: video.title,
      duration: video.timestamp,
      author: video.author?.name,
      thumbnail: video.thumbnail,
      query
    };
  } catch (error) {
    console.error("유튜브 검색 실패:", error.message);
    markFailedQuery(query);
    return null;
  }
}

export async function getCachedAudioUrl(youtubeUrl) {
  const cached = audioCache.get(youtubeUrl);
  if (cached && cached.expiresAt > Date.now()) return cached.url;

  const audioUrl = await getYtdlpAudioUrl(youtubeUrl);
  audioCache.set(youtubeUrl, { url: audioUrl, expiresAt: Date.now() + AUDIO_CACHE_MS });
  return audioUrl;
}

async function getYtdlpAudioUrl(youtubeUrl) {
  const { stdout, stderr } = await execFileAsync(
    "py",
    [
      "-m", "yt_dlp",
      "--no-warnings",
      "--extractor-args", "youtube:player_client=default",
      "-f", "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio",
      "-g", youtubeUrl
    ],
    { windowsHide: true, maxBuffer: 1024 * 1024 * 10, timeout: YTDLP_TIMEOUT_MS }
  );

  const urls = stdout.split(/\r?\n/).map(line => line.trim()).filter(line => line.startsWith("http"));
  if (!urls.length) {
    throw new Error(`yt-dlp 스트림 URL 추출 실패: ${stderr || stdout}`);
  }
  return urls[0];
}
