import express from "express";
import { Client, Intents, Message } from "discord.js";
import * as dotenv from "dotenv";
import { NoneResponse, Network, DiscordData } from "./Networks";
import { TypeGuards } from "./Utils";
import { CommandList } from "./Commands";

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
            if (TypeGuards.isCallbackableButtonInteraction(command)) {
                await command.callback(interaction);
            }
        }
    }
});

// client.on("messageCreate", async (message: Message) => {
//     if (message.author.id == client.user?.id || message.author.bot) {
//         return;
//     }
//     if (message.channel.id == process.env.INTRODUCTION_CHANNEL_ID) {
//         const role = message.guild?.roles.cache.find((r) => r.id == process.env.ACTIVE_MEMBER_ROLE_ID!);
//         if (role && message.member && !message.member.roles.cache.has(role.id)) {
//             message.member.roles.add(role);
//             const request = new DiscordData(message.member.id, message.member.displayName);
//             console.log(request);
//             Network.post<DiscordData, NoneResponse>(process.env.NAME_LIST_API!, request);
//         }
//     }
// });

// client.on("guildMemberUpdate", async (oldMember, newMember) => {
//     if (oldMember.displayName == newMember.displayName) {
//         return;
//     }
//     const request = new DiscordData(oldMember.id, newMember.displayName);
//     await Network.post<DiscordData, NoneResponse>(process.env.NAME_LIST_API!, request);
// });

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);