/*
    using discord.js v12.5.3
*/

const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client();

const Team = require("./Team");
const Recruit = require("./Commands/Recruit");
const recruit = new Recruit();

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
            const embed = new discord.MessageEmbed()
                .setTitle("ヘルプ")
                .setColor("#00a2ff")
                .addField(".nit　rtc　1チームの人数　対象メンバー", "メンションで指定したメンバーでランダムなチームを作成する。\n" +
                    "・1チームの人数：[省略可]1チームの人数を指定する。省略時は3人。\n" +
                    "・対象メンバー：[複数指定可]チーム作成に含めるメンバーをメンションで指定する。\n")
                .addField(".nit　rtv　1チームの人数　除外メンバー", "コマンド入力者が参加しているVCの参加者でランダムなチームを作成する。\n" +
                    "・1チームの人数：[省略可]1チームの人数を指定する。省略時は3人。\n" +
                    "・除外メンバー：[省略可][複数指定可]メンションで指定したメンバーをチーム作成に含めない。\n")
                .addField(recruit.grammar, recruit.detail + "\n" + recruit.parameterDetail)
            message.channel.send(embed);
            return;
        }
        if (command.startsWith("rtc") || command.startsWith("rtv")) {
            let members;
            let size = 3;
            if (1 <= parameters.length) {
                let parsed = parseInt(parameters[0], 10);
                if (!isNaN(parsed) && 0 < parsed) {
                    size = parsed;
                }
            }
            if (command.startsWith("rtc")) {
                members = message.mentions.members.array();
            }
            else {
                const vc = message.member.voice.channel;
                if (vc) {
                    const exclusionMember = message.mentions.members.array();
                    members = vc.members.filter(m => exclusionMember.indexOf(m) == -1).array();
                }
                else {
                    message.channel.send("ボイスチャンネルの収得に失敗しました。\n");
                }
            }
            const embed = new discord.MessageEmbed()
                .setTitle("チーム分け結果")
            Team.random(members, size).forEach(team => {
                embed.addField(team.name, team.members);
            });
            message.channel.send(embed);
            return;
        }
        if (command.startsWith("recruit")) {
            if (parameters.length < 1) {
                message.channel.send("コマンド引数が足りません。\n");
                return;
            }
            const reactionFilter = (reaction, user) => reaction.emoji.name === "✅" || reaction.emoji.name === "❎" || reaction.emoji.name === "✖";
            let participant = new Team("参加者");
            const planner = message.author;
            const embed = recruit.execute(parameters);
            embed.AddField(participant.name, "なし");
            message.channel.send(embed)
                .then(m => m.react("✅"))
                .then(mReaction => mReaction.message.react("❎"))
                .then(mReaction => mReaction.message.react("✖"))
                .then(mReaction => {
                    const collector = mReaction.message
                        .createReactionCollector(reactionFilter, {
                            time: (recruit.termDate * 24 * 60 * 60 * 1000) + (recruit.termHour * 60 * 60 * 1000)
                        });
                    collector.on("collect", (reaction, user) => {
                        let embedField = Object.assign({}, embed.fields[0]);
                        if (reaction.emoji.name === "✅") {
                            participant.addMember(user);
                            if (participant.members.length == recruit.size) {
                                collector.stop();
                            }
                        }
                        else if (reaction.emoji.name === "❎") {
                            participant.removeMember(user);
                            const userReactions = reaction.message.reactions.cache.filter(reaction =>
                                reaction.users.cache.has(user.id) && (reaction.emoji.name === "✅" || reaction.emoji.name === "❎"));
                            try {
                                for (const reaction of userReactions.values()) {
                                    reaction.users.remove(user.id);
                                }
                            } catch (error) {
                                console.error('Failed to remove reactions.');
                            }
                        }
                        else {
                            if (user.id == planner.id) {
                                collector.stop();
                            }
                        }
                        embedField.value = participant.members.length == 0 ? "なし" : participant.members;
                        reaction.message.embeds[0].fields[0] = embedField;
                        reaction.message.edit(new discord.MessageEmbed(reaction.message.embeds[0]));
                    });
                    collector.on("end", collection => {
                        mReaction.message.embeds[0].title = "募集終了";
                        mReaction.message.embeds[0].color = "#000000";
                        mReaction.message.edit(new discord.MessageEmbed(mReaction.message.embeds[0]));
                    });
                });
            return;
        }
    }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);