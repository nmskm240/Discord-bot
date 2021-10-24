import http, { IncomingMessage, ServerResponse } from "http";
import querystring from "querystring";
import { Client, Message, MessageEmbed, VoiceState } from "discord.js";
import { Command, CommandList, IExecutedCallback } from './Commands';
import * as dotenv from "dotenv";
import { Form, FormTaskDatabase, Network, TypeGuird, VCC } from "./Utils";

dotenv.config();
const client = new Client();

http.createServer(function (req: IncomingMessage, res: ServerResponse) {
    if (req.method == "POST") {
        var data = "";
        req.on("data", function (chunk: any) {
            data += chunk;
        });
        req.on("end", function () {
            if (!data) {
                res.end("No post data");
                return;
            }
            var dataObject = querystring.parse(data);
            if (dataObject.type == "wake") {
                res.end();
                return;
            }
            res.end();
        });
    }
    else if (req.method == "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Discord Bot is active now\n");
    }
}).listen(3000);

client.on("ready", async () => {
    FormTaskDatabase.instance.init(client);
    Form.reboot();
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
        const embed: MessageEmbed = await command.execute();
        const out: Message = await message.channel.send(embed);
        if (TypeGuird.isIExecutedCallback(command)) {
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
    const tag = oldMember.user!.tag.slice(oldMember.user!.tag.length - 5);
    await Network.post({datas: [{ tag: tag, nickname: newMember.displayName }]});
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);