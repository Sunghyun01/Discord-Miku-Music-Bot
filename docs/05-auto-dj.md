# 05. 자동 DJ 📻

> 큐가 끝났을 때 미쿠가 자동으로 다음 곡을 추천해서 이어 틀어주는 기능이에요.

---

## 자동 DJ 켜기

```text
/autodj on
```

분위기와 함께 켜기:

```text
/autodj on mood:하츠네미쿠 느낌의 신나는 보컬로이드
```

---

## 자동 DJ 끄기

```text
/autodj off
```

---

## 상태 확인

```text
/autodj status
```

예시:

```text
자동 DJ: 켜짐
분위기: 새벽 감성 보컬로이드
연속 자동 재생: 2/10
```

---

## 사용 흐름

```text
/autodj on mood:새벽 감성 J-POP
/play 하츠네미쿠 tell your world
```

이후 큐가 비면 자동 DJ가 아래처럼 동작합니다.

```text
큐 종료
→ 자동 DJ 설정 확인
→ 최근 재생곡과 mood 확인
→ EXAONE 3.5로 추천 검색어 생성
→ YouTube 검색
→ 다음 곡 자동 재생
```

---

## 추천 mood 예시

```text
새벽 감성
신나는 애니송
보컬로이드
코딩할 때 듣기 좋은 노래
우울할 때 듣는 잔잔한 노래
하츠네미쿠 느낌
퇴근길에 듣기 좋은 J-POP
```

---

## 주의사항

자동 DJ는 AI 추천과 YouTube 검색, yt-dlp 추출을 함께 사용합니다.

따라서 아래 상황에서는 실패할 수 있습니다.

```text
- Ollama가 실행 중이 아님
- EXAONE 모델이 설치되어 있지 않음
- YouTube 검색 결과가 부정확함
- yt-dlp 추출 실패
- 네트워크 문제
```

실패 시 우선 확인:

```bash
ollama list
py -m yt_dlp --version
```
