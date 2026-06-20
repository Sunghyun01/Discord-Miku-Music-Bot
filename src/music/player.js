import { DisTube } from "distube";
import { DirectLinkPlugin } from "@distube/direct-link";
import ffmpegPath from "ffmpeg-static";

export function createPlayer(client) {
  if (!ffmpegPath) {
    throw new Error("ffmpeg-static 경로를 찾지 못했습니다.");
  }

  return new DisTube(client, {
    emitNewSongOnly: true,
    ffmpeg: { path: ffmpegPath },
    plugins: [new DirectLinkPlugin()]
  });
}
