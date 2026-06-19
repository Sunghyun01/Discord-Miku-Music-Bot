export const msg = {
  ready: tag => `미쿠 온라인 완료예요~ 🎤✨ 로그인: ${tag}`,

  noVoice: "먼저 음성 채널에 들어와줘요~ 미쿠가 거기로 찾아갈게요! 🩵",
  emptyQuery: "검색어나 유튜브 URL을 알려줘야 노래를 찾을 수 있어요~ 🎧",
  emptyQueue: "지금 큐가 텅 비어있어요... 미쿠가 부를 노래를 넣어줘요! 🌙",

  failedRecently: query =>
    `방금 실패했던 노래라 잠깐 쉬어갈게요~ 🫧\n자동 제외: **${query}**`,

  searchFailed: query =>
    `으으... 노래를 못 찾았어요 🥲\n검색 실패 또는 시간 초과로 자동 제외했어요: **${query}**`,

  audioExtractFailed: query =>
    `노래 음원을 가져오지 못했어요... 🫠\n오디오 추출 실패 또는 시간 초과로 자동 제외했어요: **${query}**`,

  playFailed: query =>
    `미쿠가 재생 준비하다가 넘어졌어요... 💦\n재생 처리 실패로 자동 제외했어요: **${query}**`,

  playRequested: title =>
    `좋아요! 미쿠가 준비했어요~ 🎶\n**${title}**`,

  nowPlaying: title =>
    `🎤✨ 미쿠 온 스테이지!\n지금 부르는 곡은 **${title}** 이에요~ 🩵`,

  addedSong: title =>
    `큐에 쏙 넣어뒀어요~ 🎧\n다음에 불러줄 곡: **${title}**`,

  finish: "오늘의 큐가 끝났어요~ 들어줘서 고마워요! 🌙✨",

  noPlaying: "지금은 재생 중인 곡이 없어요~ 🫧",

  skipped: "다음 곡으로 슝 넘어갈게요~ ⏭️✨",

  skippedAndStopped:
    "다음 곡이 없어서 여기서 멈출게요~ 큐도 깨끗하게 비웠어요! 🧹🩵",

  stopped: "재생을 멈추고 큐를 비웠어요~ 다음 노래도 기다릴게요! 🛑🎧",

  queueTitle: "🎼 미쿠의 현재 큐예요~",
  queueMore: count => `\n…그리고 **${count}곡** 더 기다리는 중이에요~ 🩵`,

  error: errorMessage =>
    `앗, 오류가 났어요... 💦\n\`${errorMessage}\``,

  distubeError: errorMessage =>
    `재생 중에 문제가 생겼어요... 미안해요 🥲\n\`${errorMessage}\``
};
