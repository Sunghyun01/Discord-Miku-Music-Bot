# 09. 로드맵 🛣️

> 앞으로 추가하면 좋을 기능 아이디어예요.

---

## 1순위 추천

### 투표 스킵

```text
/voteskip
```

음성 채널에 여러 명이 있을 때 일정 비율 이상 동의하면 스킵합니다.

---

### 수면 타이머

```text
/sleep 30
/sleep 60
/sleep off
```

정해진 시간 뒤 자동으로 재생을 멈춥니다.

---

### 최근 재생 기록

```text
/history
/replay 3
```

최근 재생한 곡을 저장하고 다시 재생할 수 있습니다.

---

## AI 재미 기능

### 호감도 / 출석 시스템

```text
/daily
/affinity
/title
```

예시:

```text
마스터와 미쿠의 친밀도: 37
현재 칭호: 첫 번째 관객
```

---

### 캐릭터 모드

```text
/miku-mode cute
/miku-mode calm
/miku-mode tsundere
/miku-mode radio
```

모드별 말투를 바꿀 수 있습니다.

---

## 운영 기능

### 서버별 DJ 역할 권한

```text
/music-role set @DJ
/music-role off
```

특정 역할만 `/stop`, `/skip`, `/autodj`를 사용할 수 있게 합니다.

---

### 로그 채널

```text
/log-channel set #bot-log
```

기록 예시:

```text
누가 어떤 곡 재생
누가 스킵
AI 오류
yt-dlp 실패
자동 DJ 재생
```

---

## 대시보드 확장

```text
- 큐 편집
- 플레이리스트 직접 수정
- AI 프롬프트 수정
- 자동 DJ mood 변경
- 모델 변경
- 서버별 로그 조회
- 버튼으로 봇 재시작
```

---

## 추천 개발 순서

```text
1. 투표 스킵
2. 수면 타이머
3. 최근 재생 기록
4. 호감도 / 출석
5. 권한 설정
6. 로그 채널
7. 대시보드 확장
```
