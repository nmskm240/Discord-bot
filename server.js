/*
    using discord.js v12.5.3
*/

const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client();

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
    client.user.setPresence({ game: { name: ".nit help" } });
});

client.on("message", message => {
    if (message.author.id == client.user.id || message.author.bot) {
        return;
    }
    if (message.content.startsWith(".nit")) {
        const commandAndParameter = message.content.split(" ");
        if (commandAndParameter[1].match(/help/)) {
            const embed = new discord.MessageEmbed()
                .setTitle("ヘルプ")
                .setColor("#00a2ff")
                .addField(".nit　rt　1チームの人数　除外メンバー", "コマンド入力者が参加しているVCの参加者でランダムなチームを作成する。\n" +
                    "・1チームの人数：[省略可]1チームの人数を指定する。省略時は3人。\n" +
                    "・除外メンバー：[省略可][複数指定可]メンションで指定したメンバーをチーム作成に含めない。\n")
                .addField(".nit　recruit　募集内容", "リアクションを使用して募集メッセージを作成する。\n" +
                    "・募集内容：募集する内容について自由に入力可能。\n")
            message.channel.send(embed);
            return;
        }
        if (commandAndParameter[1].match(/rt/)) {
            const vc = message.member.voice.channel;
            if (vc) {
                const exclusionMember = message.mentions.members.array();
                let members = vc.members.filter(m => exclusionMember.indexOf(m) == -1).array();
                let teams = [];
                let teamCount = 1;
                let teamNumber = 3;
                if (3 <= commandAndParameter.length) {
                    let parsed = parseInt(commandAndParameter[2], 10);
                    teamNumber = (isNaN(parsed)) ? 3 : parsed;
                }
                while (teamNumber <= members.length) {
                    let teamMember = [];
                    for (let i = 0; i < teamNumber; i++) {
                        let index = Math.floor(Math.random() * members.length);
                        teamMember.push(members[index]);
                        members.splice(index, 1);
                    }
                    teams.push({ name: "チーム" + teamCount, value: teamMember.map(m => m.user) });
                    teamCount++;
                }
                if (0 < members.length) {
                    teams.push({ name: "余ったメンバー", value: members.map(m => m.user) });
                }
                const embed = new discord.MessageEmbed()
                    .setTitle("チーム分け結果")
                teams.forEach(team => {
                    embed.addField(team.name, team.value);
                });
                message.channel.send(embed);
            }
            else {
                let text = "ボイスチャンネルの収得に失敗しました。\n";
                message.channel.send(text);
            }
            return;
        }
        if (commandAndParameter[1].match(/recruit/)) {
            if (3 != commandAndParameter.length) {
                return;
            }
            const reactionFilter = (reaction, user) => reaction.emoji.name === "✅" || reaction.emoji.name === "❎";
            const embed = new discord.MessageEmbed()
                .setAuthor(message.author.username)
                .setTitle("募集中")
                .setDescription(commandAndParameter[2] + "\n" + 
                    "✅：参加、❎：参加取消\n")
                .setColor("#00a2ff")
                .addField("参加者", "なし")
            message.channel.send(embed)
                .then(m => m.react("✅"))
                .then(mReaction => mReaction.message.react("❎"))
                .then(mReaction => {
                    const collector = mReaction.message
                        .createReactionCollector(reactionFilter, {
                            time: 15000
                        });
                    let participant = [];
                    collector.on("collect", (reaction, user) => {
                        let embedField = Object.assign({}, embed.fields[0]);
                        if (reaction.emoji.name === "✅") {
                            participant.push(user);
                        }
                        else if (reaction.emoji.name === "❎") {
                            let index = participant.indexOf(user);
                            if (index != -1) {
                                participant.splice(index, 1);
                            }
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
                        embedField.value = participant.length == 0 ? "なし" : participant;
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