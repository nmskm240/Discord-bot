/*
    using discord.js v12.5.3
*/

const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client();
const timeDiff = new Date(0, 0, 0, 9); //サーバとの間に9時間の時差がある為、日本時間への変換に使用

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
                .addField(".nit　recruit　募集タイトル　募集内容　募集期間", "リアクションを使用した募集フォームを作成する。\n" +
                    "作成されたフォームは募集期間を過ぎるか、コマンド入力者が✖のリアクションを行うまで有効になる。\n" +
                    "・募集タイトル：募集する内容について自由に入力可能。\n" +
                    "・募集内容：募集する内容について自由に入力可能。\n" +
                    "・募集期間：[省略可]募集を終了するまでの日数や時間を指定する。省略時は1日。\n" +
                    "　　2d12h と入力すると、募集開始から2日と12時間後に募集を終了する。")
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
                    teamNumber = (isNaN(parsed)) ? teamNumber : parsed;
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
            if (commandAndParameter.length < 4) {
                message.channel.send("コマンド引数が足りません。\n");
                return;
            }
            const term = new Date(0, 0, 0, 0);
            if (5 <= commandAndParameter.length) {
                const dIndex = commandAndParameter[4].indexOf("d");
                const hIndex = commandAndParameter[4].indexOf("h");
                if (dIndex != -1) {
                    let parsed = parseInt(commandAndParameter[4].substring(0, dIndex), 10);
                    term.setDate(isNaN(parsed) ? 1 : parsed);
                }
                else {
                    term.setDate(1);
                }
                if (hIndex != -1) {
                    let parsed = parseInt(commandAndParameter[4].substring(dIndex == -1 ? 0 : dIndex + 1, hIndex));
                    term.setHours(isNaN(parsed) ? 0 : parsed);
                }
            }
            else {
                term.setDate(1);
            }
            const reactionFilter = (reaction, user) => reaction.emoji.name === "✅" || reaction.emoji.name === "❎" || reaction.emoji.name === "✖";
            const limit = new Date();
            limit.setHours(limit.getHours() + timeDiff.getHours() + term.getHours());
            limit.setDate(limit.getDate() + term.getDate());
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const planner = message.author;
            const embed = new discord.MessageEmbed()
                .setAuthor("募集中")
                .setTitle(commandAndParameter[2])
                .setDescription("**" + commandAndParameter[3] + "**\n\n" +
                    "✅：参加、❎：参加取消\n" +
                    "募集終了：" + limit.toLocaleDateString('ja-JP-u-ca-japanese', options) + "　" + limit.toLocaleTimeString("jp-JP", { hour: '2-digit', minute: '2-digit' }))
                .setColor("#00a2ff")
                .addField("参加者", "なし")
            message.channel.send(embed)
                .then(m => m.react("✅"))
                .then(mReaction => mReaction.message.react("❎"))
                .then(mReaction => mReaction.message.react("✖"))
                .then(mReaction => {
                    const collector = mReaction.message
                        .createReactionCollector(reactionFilter, {
                            time: (term.getHours() * 60 * 60 * 1000) + (term.getMinutes() * 60 * 1000)
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
                        else {
                            if (user.id == planner.id) {
                                collector.stop();
                            }
                        }
                        embedField.value = participant.length == 0 ? "なし" : participant;
                        reaction.message.embeds[0].fields[0] = embedField;
                        reaction.message.edit(new discord.MessageEmbed(reaction.message.embeds[0]));
                    });
                    collector.on("end", collection => {
                        mReaction.message.embeds[0].author = "募集終了";
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