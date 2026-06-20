import "dotenv/config";
import {
    ActivityType,
    Client,
    Events,
    GatewayIntentBits,
    MessageFlags
} from "discord.js";

import { msg } from "./messages.js";
import { createPlayer } from "./music/player.js";
import { handleAutoDjFinish } from "./music/autoDj.js";
import { handleMusicCommand, registerPlayerEvents } from "./commands/musicCommands.js";
import { handleFavoriteCommand } from "./commands/favoriteCommands.js";
import { handlePlaylistCommand } from "./commands/playlistCommands.js";
import { handleRecommendCommand } from "./commands/recommendCommands.js";
import { handleSettingsCommand } from "./commands/settingsCommands.js";
import { handleMentionChat } from "./commands/mentionChat.js";
import { handleButtonInteraction } from "./interactions/buttonHandler.js";
import { handleSearchSelect } from "./interactions/searchSelectHandler.js";
import { startDashboard } from "../web/server.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const distube = createPlayer(client);

client.once(Events.ClientReady, readyClient => {
    console.log(msg.ready(readyClient.user.tag));

    client.user.setActivity("음악 대기 중이에요 🎧", {
        type: ActivityType.Listening
    });

    startDashboard(client, distube);
});

client.on(Events.InteractionCreate, async interaction => {
    try {
        const handledSearchSelect = await handleSearchSelect(interaction, distube);

        if (handledSearchSelect) {
            return;
        }

        const handledButton = await handleButtonInteraction(interaction, distube, client);

        if (handledButton) {
            return;
        }

        const handledMusic = await handleMusicCommand(interaction, distube, client);

        if (handledMusic) {
            return;
        }

        const handledFavorite = await handleFavoriteCommand(interaction, distube);

        if (handledFavorite) {
            return;
        }

        const handledPlaylist = await handlePlaylistCommand(interaction, distube);

        if (handledPlaylist) {
            return;
        }

        const handledRecommend = await handleRecommendCommand(interaction);

        if (handledRecommend) {
            return;
        }

        const handledSettings = await handleSettingsCommand(interaction);

        if (handledSettings) {
            return;
        }
    } catch (error) {
        console.error("명령어 처리 오류:", error);

        const message = msg.error(error.message);

        if (interaction.deferred || interaction.replied) {
            return interaction.editReply(message);
        }

        return interaction.reply({
            content: message,
            flags: MessageFlags.Ephemeral
        });
    }
});

client.on(Events.MessageCreate, async message => {
    try {
        await handleMentionChat(message, client);
    } catch (error) {
        console.error("멘션 채팅 처리 오류:", error);
    }
});

registerPlayerEvents(distube, client, guildId =>
    handleAutoDjFinish(distube, client, guildId)
);

client.login(process.env.DISCORD_TOKEN);