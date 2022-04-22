import express from "express";
import { Client, Intents, Message, VoiceState } from "discord.js";
import * as dotenv from "dotenv";
import { NoneResponse, Network, DiscordData } from "./Networks";
import { VCC } from "./Utils";
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
    if (!interaction.isCommand()) {
        return;
    }
    const command = CommandList.find((command) => {
        return command.name === interaction.commandName
    });
    if (command) {
        await command.execute(interaction);
    }
});

client.on("messageCreate", async (message: Message) => {
    if (message.author.id == client.user?.id || message.author.bot) {
        return;
    }
    if (message.channel.id == process.env.INTRODUCTION_CHANNEL_ID) {
        const role = message.guild?.roles.cache.find((r) => r.id == process.env.ACTIVE_MEMBER_ROLE_ID!);
        if (role && message.member && !message.member.roles.cache.has(role.id)) {
            message.member.roles.add(role);
            const request = new DiscordData(message.member.id, message.member.displayName);
            console.log(request);
            Network.post<DiscordData, NoneResponse>(process.env.NAME_LIST_API!, request);
        }
    }
});

client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
    if (oldState.member?.id == client.user?.id || newState.member?.id == client.user?.id) {
        return;
    }
    if (VCC.isLeavedVC(oldState, newState)) {
        const vcc = new VCC(oldState);
        await vcc.leave(oldState.member!);
    } else if (VCC.isConnectedVC(oldState, newState)) {
        const vcc = new VCC(newState);
        if (!vcc.channel) {
            await vcc.create();
        }
        await vcc.join(newState.member!);
    } else if (VCC.isSwitchedVC(oldState, newState)) {
        const oldVCC = new VCC(oldState);
        const newVCC = new VCC(newState);
        await oldVCC.leave(oldState.member!);
        if (!newVCC.channel) {
            await newVCC.create();
        }
        await newVCC.join(newState.member!);
    }
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (oldMember.displayName == newMember.displayName) {
        return;
    }
    const request = new DiscordData(oldMember.id, newMember.displayName);
    await Network.post<DiscordData, NoneResponse>(process.env.NAME_LIST_API!, request);
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);