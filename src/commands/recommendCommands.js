import { MessageFlags } from "discord.js";

import { msg } from "../messages.js";
import { generateRecommendationQueries } from "../../ai/recommendationClient.js";
import { resolveYoutubeQuery } from "../music/youtube.js";
import { getRecentTracks } from "../music/playbackState.js";
import { createRecommendationSession } from "../music/recommendationSessions.js";
import { createRecommendButtons, createRecommendEmbed } from "../../ui/recommendEmbeds.js";

export async function handleRecommendCommand(interaction) {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "recommend") return false;

  const prompt = interaction.options.getString("prompt", true).trim();
  await interaction.deferReply();

  try {
    const queries = await generateRecommendationQueries(prompt, getRecentTracks(interaction.guildId));
    const recommendations = [];

    for (const query of queries) {
      const resolved = await resolveYoutubeQuery(query);
      if (resolved) recommendations.push(resolved);
      if (recommendations.length >= 5) break;
    }

    if (!recommendations.length) return interaction.editReply(msg.recommendEmpty);

    const sessionId = createRecommendationSession(interaction.guildId, interaction.user.id, recommendations);
    return interaction.editReply({
      embeds: [createRecommendEmbed(recommendations)],
      components: [createRecommendButtons(sessionId, recommendations)]
    });
  } catch (error) {
    console.error("추천곡 처리 오류:", error);
    return interaction.editReply(msg.error(error.message));
  }
}
