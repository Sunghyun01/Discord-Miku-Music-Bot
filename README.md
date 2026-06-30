#  <img src="./img/logo.png"  width="30" height="30"/>  Discord Miku Music Bot
<img src="./img/background.png">

> 음악을 틀어주고, AI DJ 멘트도 해주고, 별점까지 매겨주는  
> 귀여운 미쿠풍 디스코드 음악봇이에요 🩵✨

![Node.js](https://img.shields.io/badge/Node.js-24+-green?style=flat-square)
![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=flat-square)
![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-black?style=flat-square)
![EXAONE](https://img.shields.io/badge/AI%20Model-EXAONE%203.5-ff69b4?style=flat-square)

---

## 🩵 소개

**Discord Miku Music Bot**은 하츠네미쿠 느낌의 귀여운 말투를 가진 디스코드 음악봇입니다.

유튜브 검색어 또는 URL로 음악을 재생할 수 있고,  
로컬 LLM인 **EXAONE 3.5**를 사용해 AI 채팅, AI 추천곡, AI DJ 멘트, AI 별점 평가까지 지원합니다.

> API 비용 없이 로컬 Ollama 기반으로 동작하는  
> 나만의 미쿠풍 AI 음악봇이에요 🎧

---

## ✨ 핵심 기능

| 구분 | 기능 |
|---|---|
| 🎵 음악 | `/play`, `/search`, `/skip`, `/stop`, `/queue`, `/nowplaying` |
| 🎛️ 컨트롤 | Now Playing 임베드, 버튼 컨트롤 |
| 🤖 AI | EXAONE 3.5 기반 멘션 채팅, 추천곡, DJ 멘트, 별점 평가 |
| 📌 저장 | 즐겨찾기, 플레이리스트 JSON 저장 |
| 📻 자동화 | 자동 DJ, AI 채널 제한 |
| 🖥️ 관리 | 웹 관리자 대시보드 |

---

## 📚 문서 바로가기

| 문서 | 설명 |
|---|---|
| [01. 설치 및 실행](./docs/01-installation.md) | Node, env, yt-dlp, Ollama, 실행 방법 |
| [02. 명령어 모음](./docs/02-commands.md) | 전체 슬래시 명령어 정리 |
| [03. 음악 기능](./docs/03-music-features.md) | 재생, 검색 선택 메뉴, 버튼 컨트롤 |
| [04. AI 기능](./docs/04-ai-features.md) | EXAONE 3.5, AI 채팅, 추천곡, DJ 멘트, 별점 |
| [05. 자동 DJ](./docs/05-auto-dj.md) | 자동 추천 재생 설정 및 사용법 |
| [06. 관리자 대시보드](./docs/06-dashboard.md) | 웹 UI 실행 및 확인 가능 항목 |
| [07. 데이터 저장 / Git 관리](./docs/07-data-and-gitignore.md) | JSON 저장 구조와 `.gitignore` 설정 |
| [08. 문제 해결](./docs/08-troubleshooting.md) | 자주 나는 오류와 해결법 |
| [09. 로드맵](./docs/09-roadmap.md) | 앞으로 추가하면 좋은 기능 |

---

## 🚀 빠른 시작

```bash
npm install
copy .env.example .env
py -m pip install -U yt-dlp
ollama pull exaone3.5:7.8b
npm run deploy
npm start
```

대시보드 사용 시:

```text
http://localhost:3000
```

---
