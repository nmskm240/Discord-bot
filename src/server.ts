import express from "express";
import { Client, Intents } from "discord.js";
import * as dotenv from "dotenv";
import { TypeGuards } from "./utils";
import { CommandList } from "./commands";
import { AccessPoint, Discord, Member, Network, NoneResponse } from "./networks";

dotenv.config();
const options = {
    intents: Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES
        | Intents.FLAGS.GUILD_VOICE_STATES | Intents.FLAGS.GUILD_MEMBERS,
    presence: { activities: [{ name: "/help" }] }
};
const client = new Client(options);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Discord bot is active now!");
});
app.listen(process.env.PORT);

client.on("ready", async () => {
    const data = CommandList.map((command) => { return command.toCommandData(); })
    for (const guild of client.guilds.cache) {
        await client.application!.commands.set(data, guild[0]);
    }
    console.log("Bot ready");
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const command = CommandList.find((command) => {
            return command.name === interaction.commandName
        });
        if (command) {
            await command.execute(interaction);
        }
    }
    if (interaction.isButton()) {
        const id = interaction.customId;
        const data = id.split("/");
        if (data.at(0) == "nBot") {
            const commandName = data.at(1);
            const command = CommandList.find((command) => {
                return command.name === commandName;
            });
            if (TypeGuards.isButtonInteractionCallback(command)) {
                await command.callback(interaction);
            }
        }
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.id == client.user?.id || message.author.bot) {
        return;
    }
    if (message.channel.id == process.env.INTRODUCTION_CHANNEL_ID) {
        const role = message.guild?.roles.cache.find((r) => r.id == process.env.ACTIVE_MEMBER_ROLE_ID!);
        if (role && message.member && !message.member.roles.cache.has(role.id)) {
            message.member.roles.add(role);
            const discord = new Discord(message.member.id, message.member.displayName);
            const member = new Member(-1, "", discord, []);
            await Network.post<Member, NoneResponse>(AccessPoint.MEMBER_REGISTER, member);
        }
    }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);