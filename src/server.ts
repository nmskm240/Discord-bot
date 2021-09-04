/*
    ------using packages------
        discord.js v12.5.3
        require-dir v1.2.0
        axios v0.21.1
    --------------------------
*/

import * as fs from 'fs';
import http from "http";
import querystring from "querystring";
import discord from "discord.js";
const client = new discord.Client();

http.createServer(function (req: any, res: any) {
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
    console.log("Bot準備完了");
    client.user?.setPresence({ activity: { name: ".nit help" }, status: "online" });
});

client.on("message", (message: any) => {
    if (message.author.id == client.user?.id || message.author.bot) {
        return;
    }
    if (message.content.startsWith(".nit")) {

    }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);