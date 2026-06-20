# 07. 데이터 저장 / Git 관리 💾

> 즐겨찾기, 플레이리스트, 설정, 별점 기록은 JSON 파일로 저장됩니다.

---

## 데이터 저장 구조

서버별 데이터는 아래 경로에 저장됩니다.

```text
data/guilds/{guildId}/
```

예시:

```text
data/guilds/123456789012345678/
├─ settings.json
├─ favorites.json
├─ playlists.json
├─ ratings.json
└─ autoDj.json
```

---

## 파일별 역할

| 파일 | 설명 |
|---|---|
| `settings.json` | 서버별 기본 설정 |
| `favorites.json` | 즐겨찾기 목록 |
| `playlists.json` | 플레이리스트 목록 |
| `ratings.json` | AI 별점 기록 |
| `autoDj.json` | 자동 DJ 설정 및 최근 기록 |

---

## Git에 서버 데이터 올리지 않기

실제 서버 데이터는 개인 정보나 서버 ID가 들어갈 수 있으므로 Git에 올리지 않는 것을 추천합니다.

`.gitignore`에 아래 내용을 추가하세요.

```gitignore
# Runtime guild data
data/guilds/*
!data/guilds/temp/
!data/guilds/temp/**
```

---

## temp 폴더 유지

Git은 빈 폴더를 추적하지 않으므로 `.gitkeep`을 추가합니다.

Windows 기준:

```bash
echo. > data/guilds/temp/.gitkeep
```

macOS / Linux 기준:

```bash
touch data/guilds/temp/.gitkeep
```

---

## 이미 Git에 올라간 데이터 제거

이미 `data/guilds` 하위 파일이 Git에 올라간 적 있다면 아래 명령어를 실행합니다.

```bash
git rm -r --cached data/guilds
git add .gitignore
git add data/guilds/temp/.gitkeep
git commit -m "chore: ignore guild runtime data"
```

---

## 추천 관리 방식

```text
개발용 샘플 데이터 → data/guilds/temp/
실제 서버 데이터 → data/guilds/{guildId}/
Git 추적 대상 → temp 폴더만
Git 무시 대상 → 실제 서버별 JSON 데이터
```
