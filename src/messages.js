export const msg = {
  ready: tag => `미쿠 온라인 완료예요~ 🎤✨ 로그인: ${tag}`,

  noVoice: "먼저 음성 채널에 들어와줘요~ 미쿠가 거기로 찾아갈게요! 🩵",
  emptyQuery: "검색어나 유튜브 URL을 알려줘야 노래를 찾을 수 있어요~ 🎧",
  emptyQueue: "지금 큐가 텅 비어있어요... 미쿠가 부를 노래를 넣어줘요! 🌙",
  noPlaying: "지금은 재생 중인 곡이 없어요~ 🫧",

  failedRecently: query => `방금 실패했던 노래라 잠깐 쉬어갈게요~ 🫧\n자동 제외: **${query}**`,
  searchFailed: query => `으으... 노래를 못 찾았어요 🥲\n검색 실패 또는 시간 초과로 자동 제외했어요: **${query}**`,
  audioExtractFailed: query => `노래 음원을 가져오지 못했어요... 🫠\n오디오 추출 실패 또는 시간 초과로 자동 제외했어요: **${query}**`,
  playFailed: query => `미쿠가 재생 준비하다가 넘어졌어요... 💦\n재생 처리 실패로 자동 제외했어요: **${query}**`,

  playRequested: title => `좋아요! 미쿠가 준비했어요~ 🎶\n**${title}**`,
  nowPlaying: title => `🎤✨ 미쿠 온 스테이지!\n지금 부르는 곡은 **${title}** 이에요~ 🩵`,
  addedSong: title => `큐에 쏙 넣어뒀어요~ 🎧\n다음에 불러줄 곡: **${title}**`,
  finish: "오늘의 큐가 끝났어요~ 들어줘서 고마워요! 🌙✨",
  skipped: "다음 곡으로 슝 넘어갈게요~ ⏭️✨",
  skippedAndStopped: "다음 곡이 없어서 여기서 멈출게요~ 큐도 깨끗하게 비웠어요! 🧹🩵",
  stopped: "재생을 멈추고 큐를 비웠어요~ 다음 노래도 기다릴게요! 🛑🎧",

  queueTitle: "🎼 미쿠의 현재 큐예요~",
  queueMore: count => `\n…그리고 **${count}곡** 더 기다리는 중이에요~ 🩵`,

  favoriteAdded: title => `별빛 보관함에 저장했어요~ ⭐\n**${title}**`,
  favoriteEmpty: "마스터의 즐겨찾기가 아직 비어있어요~ ⭐",
  favoriteRemoved: title => `즐겨찾기에서 살짝 빼뒀어요~ 🧹\n**${title}**`,

  playlistCreated: name => `플레이리스트 **${name}** 만들었어요~ 📚✨`,
  playlistDeleted: name => `플레이리스트 **${name}** 삭제했어요~ 🧹`,
  playlistAdded: (name, title) => `**${name}** 플레이리스트에 쏙 넣었어요~ 🎧\n**${title}**`,
  playlistNotFound: name => `**${name}** 플레이리스트를 못 찾았어요... 🥲`,
  playlistEmpty: name => `**${name}** 플레이리스트가 비어있어요~`,

  recommendWorking: "미쿠가 분위기에 맞는 노래를 고르는 중이에요~ 🎧✨",
  recommendEmpty: "추천곡을 잘 못 골랐어요... 다른 분위기로 말해줘요 🥲",
  recommendTitle: "🎧 미쿠의 추천곡이에요~",

  aiChannelSet: channel => `이제 AI 대화는 ${channel} 채널에서만 할게요~ 🩵`,
  aiChannelOff: "AI 대화 채널 제한을 풀었어요~ 어디서든 미쿠를 불러줘요 🎤",
  aiChannelStatusAll: "AI 대화는 모든 채널에서 허용되어 있어요~ 🩵",
  aiChannelStatusOne: channel => `AI 대화는 ${channel} 채널에서만 허용되어 있어요~`,
  aiChannelBlocked: channel => `미쿠 AI 대화는 ${channel} 채널에서만 가능해요~ 🩵`,

  autoDjOn: mood => `자동 DJ를 켰어요~ 분위기는 **${mood || "미쿠 추천"}** 으로 갈게요! 🎛️✨`,
  autoDjOff: "자동 DJ를 껐어요~ 조용히 대기할게요 🎧",
  autoDjStatusOn: mood => `자동 DJ가 켜져 있어요~ 분위기: **${mood || "미쿠 추천"}** 🎛️`,
  autoDjStatusOff: "자동 DJ는 꺼져 있어요~",
  autoDjNext: title => `큐가 비어서 미쿠가 다음 곡을 골랐어요~ 🎛️\n**${title}**`,
  autoDjFailed: "자동 DJ가 다음 곡을 고르지 못했어요... 잠깐 쉬어갈게요 🫧",

  error: errorMessage => `앗, 오류가 났어요... 💦\n\`${errorMessage}\``,
  distubeError: errorMessage => `재생 중에 문제가 생겼어요... 미안해요 🥲\n\`${errorMessage}\``
};
