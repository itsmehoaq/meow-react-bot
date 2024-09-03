import { Client, Intents } from "discord.js";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "config.json");
let config;
try {
  const configData = fs.readFileSync(configPath, "utf8");
  config = JSON.parse(configData);
} catch (err) {
  console.error("Error reading config.json:", err);
  process.exit(1);
}

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

let userReactions = {};
const reactionsFilePath = path.join(process.cwd(), "userReactions.json");

try {
  const data = fs.readFileSync(reactionsFilePath, "utf8");
  userReactions = JSON.parse(data);
} catch (err) {
  console.error("Error reading userReactions.json:", err);
}

function saveUserReactions() {
  fs.writeFileSync(reactionsFilePath, JSON.stringify(userReactions, null, 2));
}

client.once("ready", () => {
  console.log("Bot is online!");
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (userReactions.hasOwnProperty(message.author.id)) {
    const reactionEmojis = userReactions[message.author.id];
    reactionEmojis.forEach((emoji) => {
      message.react(emoji).catch(console.error);
    });
  }
});

client.login(config.botToken);
