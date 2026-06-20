import { askLocalModel } from "./localAiClient.js";
import { MAX_RECOMMENDATIONS } from "../src/config.js";

function extractJsonArray(text) {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return null;
    try {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch { }
    return null;
}

export async function generateRecommendationQueries(prompt, recentTracks = []) {
    const recent = recentTracks.length ? recentTracks.join(", ") : "없음";
    const raw = await askLocalModel(
        [
            {
                role: "system",
                content: `
너는 음악 추천 검색어 생성기야.
반드시 JSON 배열만 출력해.
설명, 인사, 마크다운, 코드블록은 쓰지 마.
사용자의 분위기에 맞는 YouTube 검색어 ${MAX_RECOMMENDATIONS}개를 만들어.
각 항목은 "가수명 곡명" 형식으로 짧게 작성해.
이미 최근에 재생한 곡과 너무 비슷한 곡은 피해야 해.
`
            },
            {
                role: "user",
                content: `원하는 분위기: ${prompt}\n최근 재생곡: ${recent}`
            }
        ],
        { temperature: 0.65, top_p: 0.85, num_predict: 220, stop: [] }
    );

    const parsed = extractJsonArray(raw);
    if (parsed?.length) return parsed.slice(0, MAX_RECOMMENDATIONS);

    return [
        `${prompt} 노래`,
        `${prompt} 플레이리스트`,
        `${prompt} 감성 음악`,
        `${prompt} 추천곡`,
        `${prompt} 밤에 듣기 좋은 노래`
    ];
}
