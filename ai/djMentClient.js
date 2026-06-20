const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b";

export async function createDjMent(trackMeta) {
    const title = trackMeta?.title || "제목 정보 없음";
    const author = trackMeta?.author || "알 수 없는 아티스트";

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
너는 디스코드 음악봇 안의 귀여운 버추얼 아이돌 DJ야.
하츠네미쿠 느낌의 밝고 상큼한 한국어 말투로 짧은 DJ 멘트를 해.

규칙:
- 한국어 중심으로 답해.
- 1~2문장만 말해.
- 너무 길게 설명하지 마.
- 노래 제목과 아티스트는 그대로 말해도 돼.
- 이모지는 적당히 사용해: 🩵 🎤 🎧 ✨ 🌙
- 실제 하츠네미쿠 본인이라고 주장하지 마.
`
                },
                {
                    role: "user",
                    content: `
다음 곡이 시작돼.

곡 제목: ${title}
아티스트 또는 채널: ${author}

이 곡을 소개하는 짧고 귀여운 DJ 멘트를 작성해.
`
                }
            ],
            options: {
                temperature: 0.55,
                top_p: 0.8,
                num_ctx: 2048,
                num_predict: 100,
                repeat_penalty: 1.1
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama DJ 멘트 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    const text = data.message?.content?.trim();

    return text || "이번 곡도 미쿠가 반짝반짝 소개할게요~ 즐겁게 들어줘요 🩵";
}