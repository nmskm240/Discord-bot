import * as fs from 'fs';
import http, { IncomingMessage, ServerResponse } from "http";
import querystring from "querystring";
import { Client, Message, MessageEmbed } from "discord.js";
import { Command, CommandList } from './Commands';

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

client.on("ready", () => {
    fs.readFile("./Data/Links.json", "utf8", (err: any, data: any) => {
        if (data) {
            // const json = JSON.parse(data);
            // utils.Network.URL = json.GAS;
            // utils.Form.reboot(client);
        }
    });
    CommandList.init();
    console.log("Bot準備完了");
    client.user?.setPresence({ activity: { name: ".nit help" }, status: "online" });
});

client.on("message", async (message: Message) => {
    if (message.author.id == client.user?.id || message.author.bot) {
        return;
    }
    const command: Command | null = Command.parse(message);
    if(command) {
        const embed: MessageEmbed = await command.execute();
        message.channel.send(embed);
    }
});

// if (process.env.DISCORD_BOT_TOKEN == undefined) {
//     console.log("DISCORD_BOT_TOKENが設定されていません。");
//     process.exit(0);
// }

// client.login(process.env.DISCORD_BOT_TOKEN);
client.login("ODgyMDg1MjAwNjMxMzMyODY0.YS2P3A.3LqIsBR9PPB9IkKJ42sbhQnA1S4");