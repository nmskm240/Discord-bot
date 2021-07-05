/*
    using discord.js v12.5.3
*/

const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client();
const commands = require("./Commands");
const utils = require("./Utils");

http.createServer(function (req, res) {
    utils.Roll.update();
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
            console.log("post:" + dataObject.type);
            if (dataObject.type == "wake") {
                console.log("Woke up in post");
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
    console.log("Bot準備完了～");
    utils.Roll.update();
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
            help.execute(message, [new commands.RTC(), new commands.RTV(), new commands.Recruit(), new commands.Who()]);
            return;
        }
        if (command.startsWith("rtc")) {
            const rtc = new commands.RTC();
            rtc.execute(message, parameters);
            return;
        }
        if (command.startsWith("rtv")) {
            const rtv = new commands.RTV();
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
            who.execute(message, message.mentions.members.first());
            return;
        }
    }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);