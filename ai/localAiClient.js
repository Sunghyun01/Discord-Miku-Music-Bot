import { mikuPersona } from "./persona.js";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b";

const chatMemory = new Map();
const MAX_MEMORY = 6;

function getUserMemory(userId) {
  if (!chatMemory.has(userId)) {
    chatMemory.set(userId, []);
  }

  return chatMemory.get(userId);
}

function pushMemory(userId, role, content) {
  const memory = getUserMemory(userId);

  memory.push({ role, content });

  while (memory.length > MAX_MEMORY) {
    memory.shift();
  }
}

function extractForeignTerms(text) {
  const matches = text.match(/[^\sㄱ-ㅎㅏ-ㅣ가-힣0-9.,!?~…'"“”‘’()[\]{}<>:;|\\/`@#%^&*_+=-]+/gu) || [];

  return matches
    .map(term => term.trim())
    .filter(Boolean);
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasDisallowedForeignLanguage(answer, userMessage) {
  let sanitizedAnswer = answer;

  const allowedTerms = extractForeignTerms(userMessage);

  for (const term of allowedTerms) {
    const pattern = new RegExp(escapeRegExp(term), "g");
    sanitizedAnswer = sanitizedAnswer.replace(pattern, "");
  }

  for (const char of Array.from(sanitizedAnswer)) {
    if (!/\p{Letter}/u.test(char)) {
      continue;
    }

    if (/\p{Script=Hangul}/u.test(char)) {
      continue;
    }

    return true;
  }

  return false;
}

function cleanBadPrefixes(text) {
  return text
    .replace(/^[-*\s]+/, "")
    .replace(
      /^(sir|understood|ok|okay|yes|sure|hello|sorry|master|producer)[!,.:\-\s]*/i,
      ""
    )
    .replace(
      /^(こんにちは|你好|ありがとう|はい|いいえ|主人|マスター)[!,.:\-\s]*/i,
      ""
    )
    .trim();
}

async function callOllama(messages, retryMode = false) {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      messages,
      options: {
        temperature: retryMode ? 0.25 : 0.45,
        top_p: retryMode ? 0.6 : 0.75,
        num_ctx: 3072,
        num_predict: 140,
        repeat_penalty: 1.12,

        // 자주 튀어나오는 외국어 시작 표현 방지
        stop: [
          "Sir",
          "sir",
          "Understood",
          "understood",
          "OK",
          "Ok",
          "okay",
          "Okay",
          "Sure",
          "sure",
          "Hello",
          "hello",
          "Sorry",
          "sorry",
          "こんにちは",
          "你好",
          "ありがとう",
          "はい",
          "いいえ"
        ]
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama 호출 실패: ${response.status}`);
  }

  const data = await response.json();

  return data.message?.content?.trim() || "";
}

async function rewriteToKoreanOnly(userMessage, badAnswer) {
  return callOllama(
    [
      {
        role: "system",
        content: `
너는 한국어 문장 교정기야.
반드시 한국어 중심으로 출력해.
사용자 질문에 직접 포함된 외국어 단어, 제품명, 고유명사, 코드, URL은 그대로 유지해도 돼.
하지만 사용자 질문에 없던 외국어 표현은 전부 제거해.
설명하지 말고 최종 답변만 출력해.
귀엽고 다정한 미쿠 말투로 1~3문장만 답해.
`
      },
      {
        role: "user",
        content: `
사용자 메시지:
${userMessage}

문제가 있는 기존 답변:
${badAnswer}

위 답변을 규칙에 맞게 다시 작성해.
`
      }
    ],
    true
  );
}

export async function askLocalMiku(userId, userMessage) {
  const memory = getUserMemory(userId);

  const messages = [
    {
      role: "system",
      content: mikuPersona
    },
    ...memory,
    {
      role: "user",
      content: userMessage
    }
  ];

  let answer = await callOllama(messages);
  answer = cleanBadPrefixes(answer);

  if (hasDisallowedForeignLanguage(answer, userMessage)) {
  console.log("허용되지 않은 외국어 감지, 1차 재작성:", answer);

  answer = await rewriteToKoreanOnly(userMessage, answer);
  answer = cleanBadPrefixes(answer);
}

if (hasDisallowedForeignLanguage(answer, userMessage)) {
  console.log("허용되지 않은 외국어 감지, 2차 재작성:", answer);

  answer = await rewriteToKoreanOnly(userMessage, answer);
  answer = cleanBadPrefixes(answer);
}

if (!answer || hasDisallowedForeignLanguage(answer, userMessage)) {
  answer = "마스터, 알겠어요~ 질문에 나온 단어만 살려서 한국어로 대답할게요 🩵";
}

  pushMemory(userId, "user", userMessage);
  pushMemory(userId, "assistant", answer);

  return answer;
}