import http, { IncomingMessage, ServerResponse } from "http";
import querystring from "querystring";
import { Client, Message, MessageEmbed, Permissions, VoiceState } from "discord.js";
import { Command, CommandList } from './Commands';
import * as dotenv from "dotenv";
import { Form, FormTaskDatabase, Member, MemberDatabase, Network } from "./Utils";

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
    for (const data of await Network.get({})) {
        const member = Member.parse(data);
        if (member.tag) {
            MemberDatabase.instance.update({ tag: data.tag }, member, { upsert: true });
        }
    }
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
        command.onComplite(out);
    }
});

client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
    if (oldState.channel || newState.channel) {
        if (oldState.channel && oldState.member && !newState.channel) {
            console.log("leave" + oldState.channel.name);
            const role = oldState.guild.roles.cache.find((role) =>
                role.name == oldState.channel!.name + "_vcc");
            if (role) {
                oldState.member.roles.remove(role);
            }
        } else if (!oldState.channel && newState.channel && newState.member) {
            console.log("join" + newState.channel.name);
            const role = newState.guild.roles.cache.find((role) =>
                role.name == newState.channel!.name + "_vcc")
                ?? await newState.guild.roles.create({
                    data: {
                        name: newState.channel.name + "_vcc",
                    }
                });
            newState.member.roles.add(role);
            if (!newState.guild.channels.cache.find((channel) => channel.name == newState.channel!.name + "_vcc")) {
                newState.guild.channels.create(newState.channel.name + "_vcc", {
                    permissionOverwrites: [
                        { id: newState.guild.roles.everyone, deny: Permissions.FLAGS.VIEW_CHANNEL },
                        { id: role, allow: Permissions.FLAGS.VIEW_CHANNEL },
                    ]
                })
            }
        } else {
            console.log("move" + oldState.channel?.name + "to" + newState.channel?.name);
        }
    }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);