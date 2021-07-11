/*
    ------using packages------ 
        discord.js v12.5.3
        require-all v3.0.0
        node-fetch v2.6.1
    --------------------------    
*/

const fs = require("fs");
const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client();
const commands = require('require-all')(__dirname + '/Commands');
const Roll = require("./Utils/Roll");
const Network = require("./Utils/Network");
const Form = require("./Utils/Form");

http.createServer(function (req, res) {
    Roll.update();
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
            Network.URL = json.GAS;
            Roll.update();
            Form.reboot(client);
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
            const help = new commands.Help.modules();
            help.execute(message, [new commands.RandomTeamChat.modules(), new commands.RandomTeamVoice.modules(), new commands.Recruit.modules(), new commands.Who.modules()]);
            return;
        }
        if (command.startsWith("rtc")) {
            const rtc = new commands.RandomTeamChat.modules();
            rtc.execute(message, parameters);
            return;
        }
        if (command.startsWith("rtv")) {
            const rtv = new commands.RandomTeamVoice.modules();
            rtv.execute(message, parameters);
            return;
        }
        if (command.startsWith("recruit")) {
            const recruit = new commands.Recruit.modules();
            recruit.execute(message, parameters);
            return;
        }
        if (command.startsWith("who")) {
            const who = new commands.Who.modules();
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