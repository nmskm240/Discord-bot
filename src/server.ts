import express from "express";
import { Client, Message, VoiceState } from "discord.js";
import { Command, CommandList, IExecutedCallback } from './Commands';
import * as dotenv from "dotenv";
import { DiscordUpdate, Form, Network, NoneResponse, RoomData, TypeGuard, VCC } from "./Utils";

dotenv.config();
const client = new Client();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Discord bot is active now!");
});
app.post("/room", (req: express.Request<RoomData>, res: express.Response<NoneResponse>) => {
    res.status(200).send(new NoneResponse());
    console.log(req.body.inmates);
});
app.listen(process.env.PORT);

client.on("ready", async () => {
    Form.reboot(client);
    CommandList.init();
    console.log("Bot準備完了");
    client.user?.setPresence({ activity: { name: ".nit help" }, status: "online" });
});

client.on("message", async (message: Message) => {
    if (message.author.id == client.user?.id || message.author.bot) {
        return;
    }
    const command: Command | null = Command.parse(message);
    if (command) {
        await command.execute();
        const out = await command.send();
        if (out && TypeGuard.isIExecutedCallback(command)) {
            const callback = command as IExecutedCallback;
            callback.onCompleted(out);
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
    const request = new DiscordUpdate(oldMember.id, newMember.displayName);
    await Network.post<DiscordUpdate, NoneResponse>(process.env.NAME_LIST_API!, request);
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);