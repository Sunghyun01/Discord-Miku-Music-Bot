# 03. 음악 기능 🎵

> 미쿠봇의 기본 음악 재생 기능과 검색 선택 메뉴를 정리한 문서예요.

---

## `/play` 바로 재생

검색어 또는 URL을 입력하면 미쿠가 바로 곡을 찾아 재생합니다.

```text
/play query:하츠네미쿠 tell your world
/play query:https://www.youtube.com/watch?v=...
```

동작 흐름:

```text
검색어 입력
→ yt-search로 YouTube 검색
→ yt-dlp로 오디오 URL 추출
→ DisTube로 재생
```

---

## `/search` 검색 선택 메뉴

`/play`는 첫 번째 검색 결과를 바로 재생하지만, `/search`는 검색 결과를 보여주고 사용자가 직접 선택할 수 있습니다.

```text
/search query:하츠네미쿠 melt
```

예시:

```text
🔎 미쿠가 찾은 노래들이에요~

1. Hatsune Miku - Melt
2. Melt covered by ...
3. Vocaloid Melt Live ...
```

아래 선택 메뉴에서 원하는 곡을 고르면 바로 재생됩니다.

> 이상한 검색 결과가 재생되는 문제를 줄이는 데 좋아요 🩵

---

## Now Playing 임베드

현재 재생 중인 곡은 임베드 형태로 표시됩니다.

표시 정보 예시:

```text
🎤 미쿠 온 스테이지!

제목: Tell Your World
요청자: @user
상태: 재생 중
대기열: 3곡
```

---

## 버튼 컨트롤

Now Playing 메시지에는 버튼이 함께 표시됩니다.

| 버튼 | 기능 |
|---|---|
| ⏭️ 스킵 | 현재 곡 스킵 |
| ⏹️ 정지 | 재생 중지 및 큐 비우기 |
| 📜 큐 보기 | 현재 큐 확인 |
| 🎤 현재곡 | 현재곡 정보 새로고침 |

---

## 큐 확인

```text
/queue
```

예시:

```text
🎼 미쿠의 현재 큐예요~

🎤 지금 재생 중: Tell Your World
1. Melt
2. World is Mine
3. Romeo and Cinderella
```

---

## 현재곡 확인

```text
/nowplaying
```

현재 재생 중인 곡을 다시 확인할 수 있습니다.
