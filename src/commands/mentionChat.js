import { askLocalMiku } from "../../ai/localAiClient.js";
import { getGuildSettings, isAiAllowedInChannel } from "../data/settingsStore.js";
import { msg } from "../messages.js";

const MENTION_COOLDOWN_MS = 1000 * 10;
const cooldownMap = new Map();

function isOnCooldown(userId) {
    const lastUsedAt = cooldownMap.get(userId) || 0;
    const now = Date.now();
    if (now - lastUsedAt < MENTION_COOLDOWN_MS) return true;
    cooldownMap.set(userId, now);
    return false;
}

function cleanMentionMessage(message, clientUserId) {
    return message.content.replace(new RegExp(`<@!?${clientUserId}>`, "g"), "").trim();
}

export async function handleMentionChat(message, client) {
    if (message.author.bot) return false;
    if (!message.guild) return false;
    if (!message.mentions.has(client.user)) return false;

    const allowed = await isAiAllowedInChannel(message.guild.id, message.channel.id);
    if (!allowed) {
        const settings = await getGuildSettings(message.guild.id);
        await message.reply(msg.aiChannelBlocked(`<#${settings.aiChannelId}>`));
        return true;
    }

    const userText = cleanMentionMessage(message, client.user.id);
    if (!userText) {
        await message.reply("미쿠를 불렀나요~? 무슨 이야기 하고 싶어요, 마스터? 🩵");
        return true;
    }

    if (isOnCooldown(message.author.id)) {
        await message.reply("미쿠가 숨 고르는 중이에요~ 잠깐만 기다려줘요 🎤💦");
        return true;
    }

    try {
        await message.channel.sendTyping();
        const answer = await askLocalMiku(message.author.id, userText);
        await message.reply(`🩵 **미쿠**\n${answer}`);
    } catch (error) {
        console.error("로컬 AI 멘션 대화 오류:", error);
        await message.reply("미쿠의 로컬 AI 회로가 잠깐 삐끗했어요... Ollama가 켜져 있는지 확인해줘요 🥲");
    }
    return true;
}
