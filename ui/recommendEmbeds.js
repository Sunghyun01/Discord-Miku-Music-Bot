import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from "discord.js";

export function createRecommendEmbed(recommendations) {
  const description = recommendations.map((item, index) => (
    `\`${index + 1}.\` **${item.title}**${item.author ? `\n　${item.author}` : ""}`
  )).join("\n\n");

  return new EmbedBuilder()
    .setColor(0x39c5bb)
    .setTitle("🎧 미쿠의 추천곡이에요~")
    .setDescription(description || "추천곡을 찾지 못했어요 🥲")
    .setFooter({ text: "버튼을 누르면 바로 큐에 추가돼요" })
    .setTimestamp(new Date());
}

export function createRecommendButtons(sessionId, recommendations) {
  const row = new ActionRowBuilder();
  recommendations.slice(0, 5).forEach((_, index) => {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`recplay:${sessionId}:${index}`)
        .setLabel(`${index + 1}번 재생`)
        .setEmoji("🎵")
        .setStyle(ButtonStyle.Primary)
    );
  });
  return row;
}
