import express from "express";
import { Client, Intents, VoiceState } from "discord.js";
import * as dotenv from "dotenv";
import { TypeGuards, VCC } from "./utils";
import { CommandList } from "./commands";

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

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);