const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b";

function extractJson(text) {
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
        return null;
    }

    try {
        return JSON.parse(match[0]);
    } catch {
        return null;
    }
}

function isComedyNegativeMode(userComment = "") {
    const triggers = [
        "별로야",
        "구려",
        "미쿠독설"
    ];

    return triggers.some(trigger => userComment.includes(trigger));
}

function clampRating(value, comedyMode) {
    const rating = Number(value);

    if (Number.isNaN(rating)) {
        return comedyMode ? -3.0 : 4.0;
    }

    const min = comedyMode ? -10.0 : 1.0;
    const max = 5.0;

    return Math.max(min, Math.min(max, rating));
}

export async function rateTrackWithAi(trackMeta, userComment = "") {
    const title = trackMeta?.title || "제목 정보 없음";
    const author = trackMeta?.author || "알 수 없는 아티스트";
    const comedyMode = isComedyNegativeMode(userComment);

    const ratingRule = comedyMode
        ? `
이번 평가는 음수 별점 모드야.
별점은 -10.0부터 5.0 사이로 줄 수 있어.
재미를 위해 혹평해도 되지만, 사람이나 특정 집단을 공격하지 말고 곡에 대한 장난스러운 평가만 해.
너무 심한 욕설은 쓰지 마.
음수 별점을 줄 때는 왜 음수인지 웃기고 짧게 설명해.
`
        : `
일반 평가 모드야.
별점은 1.0부터 5.0 사이로만 줘.
가볍고 다정하게 평가해.
`;

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            stream: false,
            messages: [
                {
                    role: "system",
                    content: `
너는 디스코드 음악봇 안의 귀여운 버추얼 아이돌 음악 리뷰어야.
곡 제목, 아티스트, 사용자의 감상 힌트를 기반으로 별점과 짧은 감상평을 작성해.

중요:
- 실제 음원을 직접 들은 것처럼 과장하지 마.
- 제목과 제공된 정보 기준의 가벼운 추천/감상이라고 표현해.
- 반드시 JSON만 출력해.
- JSON 외의 설명 문장은 출력하지 마.
- 한국어로 작성해.
- 사용자가 요청한 평가 톤을 반영해.

${ratingRule}

출력 형식:
{
  "rating": -3.5,
  "summary": "짧은 감상평",
  "mikuComment": "귀여운 미쿠 말투 코멘트"
}
`
                },
                {
                    role: "user",
                    content: `
곡 제목: ${title}
아티스트 또는 채널: ${author}
사용자 감상 힌트: ${userComment || "없음"}

위 규칙에 맞춰 별점과 감상평을 작성해.
`
                }
            ],
            options: {
                temperature: comedyMode ? 0.75 : 0.45,
                top_p: comedyMode ? 0.9 : 0.75,
                num_ctx: 2048,
                num_predict: 220,
                repeat_penalty: 1.1
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama 별점 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.message?.content?.trim() || "";
    const parsed = extractJson(raw);

    if (!parsed) {
        return {
            rating: comedyMode ? -3.0 : 4.0,
            summary: comedyMode
                ? "제목 분위기만 봐도 예능 심사위원 버튼이 눌린 곡이에요."
                : "제목 분위기 기준으로 무난하게 듣기 좋은 곡이에요.",
            mikuComment: comedyMode
                ? "마스터... 미쿠가 웃으면서 별점을 깎아봤어요 🫠"
                : "마스터, 미쿠 기준으론 반짝임이 느껴지는 곡이에요 🩵",
            comedyMode
        };
    }

    return {
        rating: clampRating(parsed.rating, comedyMode),
        summary: parsed.summary || "가볍게 듣기 좋은 곡이에요.",
        mikuComment:
            parsed.mikuComment ||
            (comedyMode
                ? "마스터... 이건 미쿠가 살짝 매운 별점을 줘봤어요 🫠"
                : "미쿠가 보기엔 꽤 매력적인 곡이에요 🩵"),
        comedyMode
    };
}