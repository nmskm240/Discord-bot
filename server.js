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
            const embed = help.execute([ new commands.RTC(), new commands.RTV(), new commands.Recruit(), new commands.Who() ]);
            message.channel.send(embed);
            return;
        }
        if (command.startsWith("rtc")) {
            const rtc = new commands.RTC();
            const embed = rtc.execute(parameters);
            rtc.make(message.mentions.members.array()).forEach(team => {
                embed.addField(team.name, team.members);
            });
            message.channel.send(embed);
            return;
        }
        if (command.startsWith("rtv")) {
            const vc = message.member.voice.channel;
            if (vc) {
                const rtv = new commands.RTV();
                const embed = rtv.execute(parameters);
                rtv.make(vc.members.array(), message.mentions.members.array()).forEach(team => {
                    embed.addField(team.name, team.members);
                });
                message.channel.send(embed);
            }
            else {
                message.channel.send("ボイスチャンネルの収得に失敗しました。\n");
            }
            return;
        }
        if (command.startsWith("recruit")) {
            if (parameters.length < 1) {
                message.channel.send("コマンド引数が足りません。\n");
                return;
            }
            const reactionFilter = (reaction, user) =>
                reaction.emoji.name === recruit.participation ||
                reaction.emoji.name === recruit.cancel ||
                reaction.emoji.name === recruit.end;
            const recruit = new commands.Recruit();
            const planner = message.author;
            const embed = recruit.execute(parameters);
            message.channel.send(embed)
                .then(m => m.react(recruit.participation))
                .then(mReaction => mReaction.message.react(recruit.cancel))
                .then(mReaction => mReaction.message.react(recruit.end))
                .then(mReaction => {
                    const collector = mReaction.message
                        .createReactionCollector(reactionFilter, {
                            time: (recruit.termDate * 24 * 60 * 60 * 1000) + (recruit.termHour * 60 * 60 * 1000)
                        });
                    collector.on("collect", (reaction, user) => {
                        let embedField = Object.assign({}, embed.fields[0]);
                        if (reaction.emoji.name === recruit.participation) {
                            recruit.participant.addMember(user);
                            if (recruit.participant.members.length == recruit.size) {
                                collector.stop();
                            }
                        }
                        else if (reaction.emoji.name === recruit.cancel) {
                            recruit.participant.removeMember(user);
                            const userReactions = reaction.message.reactions.cache.filter(reaction =>
                                reaction.users.cache.has(user.id) &&
                                (reaction.emoji.name === recruit.participation ||
                                    reaction.emoji.name === recruit.cancel));
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
                        embedField.value = recruit.participant.members.length == 0 ? "なし" : recruit.participant.members;
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
        if(command.startsWith("who")){
            const who = new commands.Who();
            const embed = who.execute(message.mentions.members.array()[0]);
            message.channel.send(embed);
        }
    }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);