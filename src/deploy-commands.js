import "dotenv/config";
import {
    ChannelType,
    PermissionFlagsBits,
    REST,
    Routes,
    SlashCommandBuilder
} from "discord.js";

const commands = [
    new SlashCommandBuilder()
        .setName("play")
        .setDescription("미쿠가 유튜브 URL 또는 검색어로 노래를 불러줘요.")
        .addStringOption(option => option.setName("query").setDescription("유튜브 URL 또는 검색어").setRequired(true)),

    new SlashCommandBuilder().setName("skip").setDescription("미쿠가 다음 곡으로 넘어가요."),
    new SlashCommandBuilder().setName("stop").setDescription("미쿠가 노래를 멈추고 큐를 비워요."),
    new SlashCommandBuilder().setName("queue").setDescription("미쿠의 현재 노래 큐를 보여줘요."),
    new SlashCommandBuilder().setName("nowplaying").setDescription("지금 재생 중인 곡을 예쁘게 보여줘요."),

    new SlashCommandBuilder()
        .setName("favorite")
        .setDescription("즐겨찾기를 관리해요.")
        .addSubcommand(sub => sub.setName("add").setDescription("현재곡 또는 검색곡을 즐겨찾기에 저장해요.").addStringOption(o => o.setName("query").setDescription("비워두면 현재곡 저장")))
        .addSubcommand(sub => sub.setName("list").setDescription("내 즐겨찾기를 보여줘요."))
        .addSubcommand(sub => sub.setName("play").setDescription("즐겨찾기 번호를 재생해요.").addIntegerOption(o => o.setName("index").setDescription("번호").setRequired(true).setMinValue(1)))
        .addSubcommand(sub => sub.setName("remove").setDescription("즐겨찾기 번호를 삭제해요.").addIntegerOption(o => o.setName("index").setDescription("번호").setRequired(true).setMinValue(1))),

    new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("플레이리스트를 관리해요.")
        .addSubcommand(sub => sub.setName("create").setDescription("플레이리스트 생성").addStringOption(o => o.setName("name").setDescription("이름").setRequired(true)))
        .addSubcommand(sub => sub.setName("delete").setDescription("플레이리스트 삭제").addStringOption(o => o.setName("name").setDescription("이름").setRequired(true)))
        .addSubcommand(sub => sub.setName("add").setDescription("현재곡 또는 검색곡 추가").addStringOption(o => o.setName("name").setDescription("이름").setRequired(true)).addStringOption(o => o.setName("query").setDescription("비워두면 현재곡 추가")))
        .addSubcommand(sub => sub.setName("list").setDescription("플레이리스트 목록"))
        .addSubcommand(sub => sub.setName("show").setDescription("플레이리스트 곡 목록").addStringOption(o => o.setName("name").setDescription("이름").setRequired(true)))
        .addSubcommand(sub => sub.setName("play").setDescription("플레이리스트 재생").addStringOption(o => o.setName("name").setDescription("이름").setRequired(true)))
        .addSubcommand(sub => sub.setName("remove").setDescription("플레이리스트에서 곡 삭제").addStringOption(o => o.setName("name").setDescription("이름").setRequired(true)).addIntegerOption(o => o.setName("index").setDescription("번호").setRequired(true).setMinValue(1))),

    new SlashCommandBuilder()
        .setName("recommend")
        .setDescription("AI 미쿠가 분위기에 맞는 노래를 추천해요.")
        .addStringOption(option => option.setName("prompt").setDescription("원하는 분위기나 상황").setRequired(true)),

    new SlashCommandBuilder()
        .setName("ai-channel")
        .setDescription("AI 대화 허용 채널을 설정해요.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub => sub.setName("set").setDescription("AI 대화 채널 지정").addChannelOption(o => o.setName("channel").setDescription("채널").addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement).setRequired(true)))
        .addSubcommand(sub => sub.setName("off").setDescription("AI 채널 제한 해제"))
        .addSubcommand(sub => sub.setName("status").setDescription("AI 채널 설정 확인")),

    new SlashCommandBuilder()
        .setName("search")
        .setDescription("미쿠가 유튜브 검색 결과를 보여주고 고르게 해줘요.")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("검색어")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("rate")
        .setDescription("현재 재생 중인 곡을 미쿠가 별점으로 평가해요.")
        .addStringOption(option =>
            option
                .setName("comment")
                .setDescription("감상 힌트가 있으면 적어줘요.")
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName("djment")
        .setDescription("AI DJ 멘트를 켜거나 꺼요.")
        .addStringOption(option =>
            option
                .setName("mode")
                .setDescription("on, off, status 중 선택")
                .setRequired(true)
                .addChoices(
                    { name: "켜기", value: "on" },
                    { name: "끄기", value: "off" },
                    { name: "상태 확인", value: "status" }
                )
        ),

    new SlashCommandBuilder()
        .setName("autodj")
        .setDescription("자동 DJ를 설정해요.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub => sub.setName("on").setDescription("자동 DJ 켜기").addStringOption(o => o.setName("mood").setDescription("원하는 분위기")))
        .addSubcommand(sub => sub.setName("off").setDescription("자동 DJ 끄기"))
        .addSubcommand(sub => sub.setName("status").setDescription("자동 DJ 상태 확인"))
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

try {
    console.log("슬래시 명령어 등록 중...");
    const guildIds = (process.env.GUILD_IDS || process.env.GUILD_ID || "")
        .split(",")
        .map(id => id.trim())
        .filter(Boolean);

    if (!guildIds.length) {
        throw new Error(".env에 GUILD_IDS 또는 GUILD_ID가 없습니다.");
    }

    console.log("등록할 길드 목록:", guildIds);
    console.log("등록할 명령어 목록:", commands.map(command => command.name));

    for (const guildId of guildIds) {
        console.log(`슬래시 명령어 등록 중... guildId=${guildId}`);

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                guildId
            ),
            { body: commands }
        );

        console.log(`슬래시 명령어 등록 완료: guildId=${guildId}`);
    }
    console.log("슬래시 명령어 등록 완료");
} catch (error) {
    console.error("슬래시 명령어 등록 실패:", error);
}
