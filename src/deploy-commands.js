import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const commands = [
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("미쿠가 유튜브 URL 또는 검색어로 노래를 불러줘요.")
    .addStringOption(option =>
      option
        .setName("query")
        .setDescription("유튜브 URL 또는 검색어")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("skip")
    .setDescription("미쿠가 다음 곡으로 넘어가요."),

  new SlashCommandBuilder()
    .setName("stop")
    .setDescription("미쿠가 노래를 멈추고 큐를 비워요."),

  new SlashCommandBuilder()
    .setName("queue")
    .setDescription("미쿠의 현재 노래 큐를 보여줘요.")
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log("슬래시 명령어 등록 중...");

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );

  console.log("슬래시 명령어 등록 완료");
} catch (error) {
  console.error("슬래시 명령어 등록 실패:", error);
}
