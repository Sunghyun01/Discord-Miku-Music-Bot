import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Events,
  ActivityType,
  MessageFlags
} from "discord.js";
import { handleMentionChat } from "../commands/mentionChat.js";
import { msg } from "./messages.js";
import { createPlayer } from "./music/player.js";
import {
  handleMusicCommand,
  registerPlayerEvents
} from "./commands/musicCommands.js";

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
});

client.on(Events.MessageCreate, async message => {
  try {
    await handleMentionChat(message, client);
  } catch (error) {
    console.error("멘션 채팅 처리 오류:", error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  try {
    await handleMusicCommand(interaction, distube, client);
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

registerPlayerEvents(distube, client);

client.login(process.env.DISCORD_TOKEN);
