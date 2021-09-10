import http, { IncomingMessage, ServerResponse } from "http";
import querystring from "querystring";
import { Client, Message, MessageEmbed } from "discord.js";
import { Command, CommandList } from './Commands';
import * as dotenv from "dotenv";
import { Network, Form } from "./Utils";
import { FormTaskDatabase } from "./Utils/FormTaskDatabase";

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

client.on("ready", () => {
    FormTaskDatabase.instance.init(client);
    Network.URL = process.env.GAS;
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
        command.onComplite(out);
    }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);