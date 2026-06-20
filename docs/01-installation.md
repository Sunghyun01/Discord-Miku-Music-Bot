# 01. 설치 및 실행 🛠️

> 처음 실행할 때 필요한 준비를 한 번에 정리한 문서예요.

---

## 1. 패키지 설치

```bash
npm install
```

---

## 2. 환경변수 파일 생성

Windows 기준:

```bash
copy .env.example .env
```

macOS / Linux 기준:

```bash
cp .env.example .env
```

---

## 3. `.env` 예시

```env
DISCORD_TOKEN=디스코드_봇_토큰
CLIENT_ID=디스코드_애플리케이션_CLIENT_ID
GUILD_ID=테스트_서버_ID

OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=exaone3.5:7.8b

DASHBOARD_ENABLED=true
DASHBOARD_PORT=3000
```

> AI 모델은 **EXAONE 3.5** 기준으로 작성했어요 🩵

---

## 4. yt-dlp 설치

YouTube 오디오 URL 추출을 위해 Python `yt-dlp`가 필요합니다.

```bash
py -m pip install -U yt-dlp
```

설치 확인:

```bash
py -m yt_dlp --version
```

---

## 5. Ollama + EXAONE 3.5 준비

Ollama 설치 후 모델을 다운로드합니다.

```bash
ollama pull exaone3.5:7.8b
```

모델 확인:

```bash
ollama list
```

`.env`에 아래처럼 설정합니다.

```env
OLLAMA_MODEL=exaone3.5:7.8b
```

---

## 6. Discord Developer Portal 설정

AI 멘션 채팅을 사용하려면 아래 옵션을 켜야 합니다.

```text
Discord Developer Portal
→ Applications
→ Bot
→ Privileged Gateway Intents
→ Message Content Intent ON
```

권장 권한:

```text
View Channels
Send Messages
Read Message History
Connect
Speak
Use Slash Commands
```

---

## 7. 명령어 등록

슬래시 명령어를 등록합니다.

```bash
npm run deploy
```

> 명령어를 추가하거나 수정했다면 반드시 다시 실행해야 해요.

---

## 8. 봇 실행

```bash
npm start
```

정상 실행되면 콘솔에 로그인 메시지가 출력됩니다.

---

## 9. 추천 테스트 순서

```text
1. /play 하츠네미쿠 tell your world
2. /queue
3. /nowplaying
4. /search 하츠네미쿠 melt
5. /djment on
6. /rate
7. /rate comment:음수모드 매운맛으로
8. /autodj on mood:보컬로이드 새벽 감성
9. http://localhost:3000 접속
```
