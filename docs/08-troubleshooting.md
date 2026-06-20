# 08. 문제 해결 🧯

> 개발 중 자주 만나는 오류와 해결 방법을 정리했어요.

---

## `ActivityType is not defined`

오류 예시:

```text
ReferenceError: ActivityType is not defined
```

원인:

```text
musicCommands.js에서 ActivityType을 쓰는데 import가 빠진 경우
```

해결:

```js
import {
  ActivityType,
  ActionRowBuilder,
  EmbedBuilder,
  MessageFlags,
  StringSelectMenuBuilder
} from "discord.js";
```

---

## `FFMPEG_NOT_INSTALLED`

해결:

```bash
npm i ffmpeg-static
```

`player.js` 또는 DisTube 설정에서 ffmpeg 경로를 지정합니다.

```js
import ffmpegPath from "ffmpeg-static";

const distube = new DisTube(client, {
  ffmpeg: {
    path: ffmpegPath
  }
});
```

---

## `Cannot find module 'opusscript'`

해결:

```bash
npm i opusscript
```

---

## 노래 검색은 되는데 재생이 안 됨

가능한 원인:

```text
- yt-dlp 미설치
- yt-dlp 버전 오래됨
- YouTube 추출 실패
- Direct Link 플러그인 누락
```

확인:

```bash
py -m yt_dlp --version
```

업데이트:

```bash
py -m pip install -U yt-dlp
```

---

## `/skip` 했는데 `NO_UP_NEXT` 오류

큐에 다음 곡이 없는데 스킵을 시도하면 발생합니다.

해결 방식:

```text
다음 곡이 있으면 skip
다음 곡이 없으면 stop 처리
```

---

## AI 답변이 안 옴

확인할 것:

```bash
ollama list
```

`.env` 확인:

```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=exaone3.5:7.8b
```

Ollama 모델이 없다면:

```bash
ollama pull exaone3.5:7.8b
```

---

## AI 멘션 채팅이 반응하지 않음

Discord Developer Portal에서 아래 옵션을 켰는지 확인합니다.

```text
Applications
→ Bot
→ Privileged Gateway Intents
→ Message Content Intent ON
```

또한 코드에서 아래 Intent가 있어야 합니다.

```js
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent
```

---

## `/rate`에서 미쿠 코멘트가 안 보임

`handleRate()`의 임베드 필드에 아래 항목이 들어가 있는지 확인합니다.

```js
{
  name: "미쿠 코멘트",
  value: result.mikuComment
}
```

음수모드에서도 `mikuComment`를 리턴해야 합니다.

---

## 대시보드가 안 열림

`.env` 확인:

```env
DASHBOARD_ENABLED=true
DASHBOARD_PORT=3000
```

접속 주소:

```text
http://localhost:3000
```

포트 충돌이 있으면 `DASHBOARD_PORT`를 바꿔보세요.
