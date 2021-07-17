/*
    ------using packages------ 
        discord.js v12.5.3
        require-dir v1.2.0
        axios v0.21.1
    --------------------------    
*/

const fs = require("fs");
const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client();
const requireDir = require("require-dir");
const commands = requireDir("./Commands");
const utils = requireDir("./Utils");

http.createServer(function (req, res) {
    if (req.method == "POST") {
        var data = "";
        req.on("data", function (chunk) {
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

client.on("ready", message => {
    fs.readFile("./Data/Links.json", "utf8", (err, data) => {
        if (data) {
            const json = JSON.parse(data);
            utils.Network.URL = json.GAS;
            utils.Form.reboot(client);
        }
    });
    console.log("Bot準備完了");
    client.user.setPresence({ activity: { name: ".nit help" }, status: "online" });
});

client.on("message", message => {
    if (message.author.id == client.user.id || message.author.bot) {
        return;
    }
    if (message.content.startsWith(".nit")) {
        const commandAndParameter = message.content.split(" ");
        const command = commandAndParameter[1];
        const parameters = commandAndParameter.slice(2);
        if (command.startsWith("help")) {
            const help = new commands.Help();
            help.execute(message, parameters);
            return;
        }
        if (command.startsWith("rtc")) {
            const rtc = new commands.RandomTeamChat();
            rtc.execute(message, parameters);
            return;
        }
        if (command.startsWith("rtv")) {
            const rtv = new commands.RandomTeamVoice();
            rtv.execute(message, parameters);
            return;
        }
        if (command.startsWith("recruit")) {
            const recruit = new commands.Recruit();
            recruit.execute(message, parameters);
            return;
        }
        if (command.startsWith("who")) {
            const who = new commands.Who();
            who.execute(message, message.mentions.members);
            return;
        }
    }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);