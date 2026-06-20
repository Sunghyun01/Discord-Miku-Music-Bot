# <img src="./img/logo.png"  width="30" height="30"/> Discord Miku Music Bot 

![image](./img/background.png)

## 설치

```bash
npm install
```

Python yt-dlp 설치:

```bash
py -m pip install -U yt-dlp
py -m yt_dlp --version
```

`.env.example` 파일을 `.env`로 복사한 뒤 값을 입력하세요.

```bash
copy .env.example .env
```

## 슬래시 명령어 등록

```bash
npm run deploy
```

## 실행

```bash
npm start
```

## 명령어

- `/play 검색어 또는 유튜브 URL`
- `/skip`
- `/stop`
- `/queue`

## 참고
YouTube 재생은 yt-dlp CLI로 실제 오디오 URL을 추출한 뒤, DisTube DirectLinkPlugin으로 재생하는 구조입니다.


## Ollama Local LLM 설치 (AI)
```
irm https://ollama.com/install.ps1 | iex
ollama pull qwen2.5:7b
```
@미쿠 언급 이후 문장 입력!

## 초대링크
https://discord.com/oauth2/authorize?client_id=536860675310354443&permissions=8&integration_type=0&scope=bot