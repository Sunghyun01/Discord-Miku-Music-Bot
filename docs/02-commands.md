# 02. 명령어 모음 🎮

> 미쿠봇에서 사용할 수 있는 슬래시 명령어 전체 정리예요.

---

## 🎵 음악

```text
/play query:검색어 또는 URL
/search query:검색어
/skip
/stop
/queue
/nowplaying
```

| 명령어 | 설명 |
|---|---|
| `/play` | 검색어 또는 URL로 바로 재생 |
| `/search` | 검색 결과를 보여주고 선택 재생 |
| `/skip` | 현재 곡 스킵 |
| `/stop` | 재생 중지 및 큐 비우기 |
| `/queue` | 현재 대기열 보기 |
| `/nowplaying` | 현재 재생 중인 곡 보기 |

---

## 🎙️ AI DJ 멘트

```text
/djment mode:on
/djment mode:off
/djment mode:status
```

| 명령어 | 설명 |
|---|---|
| `/djment on` | 곡 시작 시 AI DJ 멘트 켜기 |
| `/djment off` | AI DJ 멘트 끄기 |
| `/djment status` | 현재 상태 확인 |

---

## ⭐ AI 별점

```text
/rate
/rate comment:새벽 감성으로 평가해줘
/rate comment:음수모드 매운맛으로
```

| 명령어 | 설명 |
|---|---|
| `/rate` | 현재곡 별점 평가 |
| `/rate comment:...` | 감상 힌트를 포함한 별점 평가 |
| `/rate comment:음수모드...` | 예능용 음수 별점 평가 |

---

## 📌 즐겨찾기

```text
/favorite add
/favorite add query:검색어 또는 URL
/favorite list
/favorite play index:번호
/favorite remove index:번호
```

| 명령어 | 설명 |
|---|---|
| `/favorite add` | 현재 재생곡 즐겨찾기 추가 |
| `/favorite add query:...` | 검색어 또는 URL로 즐겨찾기 추가 |
| `/favorite list` | 즐겨찾기 목록 보기 |
| `/favorite play` | 즐겨찾기 번호로 재생 |
| `/favorite remove` | 즐겨찾기 삭제 |

---

## 📂 플레이리스트

```text
/playlist create name:플레이리스트명
/playlist add name:플레이리스트명
/playlist add name:플레이리스트명 query:검색어 또는 URL
/playlist list
/playlist show name:플레이리스트명
/playlist play name:플레이리스트명
/playlist remove name:플레이리스트명 index:번호
/playlist delete name:플레이리스트명
```

| 명령어 | 설명 |
|---|---|
| `/playlist create` | 플레이리스트 생성 |
| `/playlist add` | 현재곡 또는 검색곡 추가 |
| `/playlist list` | 플레이리스트 목록 보기 |
| `/playlist show` | 특정 플레이리스트 곡 목록 보기 |
| `/playlist play` | 플레이리스트 전체 재생 |
| `/playlist remove` | 플레이리스트 내 곡 삭제 |
| `/playlist delete` | 플레이리스트 삭제 |

---

## 🤖 AI 추천곡

```text
/recommend prompt:원하는 분위기
```

예시:

```text
/recommend prompt:오늘 좀 우울한데 새벽 감성으로 추천해줘
/recommend prompt:코딩할 때 들을 신나는 노래
/recommend prompt:하츠네미쿠 느낌의 보컬로이드
```

---

## 🔐 AI 채널 설정

```text
/ai-channel set channel:#채널명
/ai-channel off
/ai-channel status
```

| 명령어 | 설명 |
|---|---|
| `/ai-channel set` | AI 채팅 허용 채널 지정 |
| `/ai-channel off` | 채널 제한 해제 |
| `/ai-channel status` | 현재 설정 확인 |

---

## 📻 자동 DJ

```text
/autodj on
/autodj on mood:원하는 분위기
/autodj off
/autodj status
```

| 명령어 | 설명 |
|---|---|
| `/autodj on` | 자동 DJ 켜기 |
| `/autodj on mood:...` | 분위기와 함께 자동 DJ 켜기 |
| `/autodj off` | 자동 DJ 끄기 |
| `/autodj status` | 자동 DJ 상태 확인 |
