const discord = require("discord.js");
const Command = require("./Command");
const Team = require("../Utils/Team");

exports.modules = class Recruit extends Command {
    constructor() {
        super(".nit　recruit　募集内容　募集人数　募集期間",
            "リアクションを使用した募集フォームを作成する。\n" +
            "作成されたフォームは募集期間を過ぎるか、コマンド入力者が✖のリアクションを行うまで有効になる。\n",
            "・募集内容：募集する内容について自由に入力可能。\n" +
            "・募集人数：[省略可]募集する人数を指定する。省略時は人数指定なしとして扱う。参加者が募集人数に達すると募集を終了する。\n" +
            "・募集期間：[省略可]募集を終了するまでの日数や時間を指定する。省略時は1日。\n" +
            "　　2d12h と入力すると、募集開始から2日と12時間後に募集を終了する。");
        this.size = -1;
        this.termHour = 0;
        this.termDate = 1;
        this.participation = "✅";
        this.cancel = "❎";
        this.end = "✖";
        this.reactionFilter = (reaction, user) =>
                reaction.emoji.name === this.participation ||
                reaction.emoji.name === this.cancel ||
                reaction.emoji.name === this.end;
    }

    execute(message, parameters) {
        if (parameters.length < 1) {
            message.channel.send("コマンド引数が足りません。\n");
            return;
        }
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let limit;
        let size = "制限なし";
        this.participant = new Team("参加者");
        this.planner = message.author;
        if (3 <= parameters.length) {
            limit = this.calLimit(parameters[1]);
            let parsed = parseInt(parameters[2], 10);
            if (!isNaN(parsed) && 0 < parsed) {
                size = parsed + "人";
                this.size = parsed;
            }
        }
        else if (2 == parameters.length) {
            if (parameters[1].indexOf("d") == -1 && parameters[1].indexOf("h") == -1) {
                limit = this.calLimit();
                let parsed = parseInt(parameters[1], 10);
                if (!isNaN(parsed) && 0 < parsed) {
                    size = parsed + "人";
                    this.size = parsed;
                }
            }
            else {
                limit = this.calLimit(parameters[1]);
            }
        }
        else {
            limit = this.calLimit();
        }
        const embed = new discord.MessageEmbed()
            .setTitle("募集中")
            .setDescription("**" + parameters[0] + "**\n\n" +
                this.participation + "：参加、" + this.cancel + "：参加取消\n" +
                "募集人数：" + size + "\n" +
                "募集終了：" + limit.toLocaleDateString('ja-JP-u-ca-japanese', options) + "　" +
                limit.toLocaleTimeString("jp-JP", { hour: '2-digit', minute: '2-digit' }))
            .setColor("#00a2ff")
            .addField(this.participant.name, "なし")
        message.channel.send(embed)
            .then(m => m.react(this.participation))
            .then(mReaction => mReaction.message.react(this.cancel))
            .then(mReaction => mReaction.message.react(this.end))
            .then(mReaction => {
                const collector = mReaction.message
                    .createReactionCollector(this.reactionFilter, {
                        time: (this.termDate * 24 * 60 * 60 * 1000) + (this.termHour * 60 * 60 * 1000)
                    });
                collector.on("collect", (reaction, user) => {
                    if (reaction.emoji.name === this.participation) {
                        this.participant.addMember(user);
                        if (this.participant.members.length == this.size) {
                            collector.stop();
                        }
                    }
                    else if (reaction.emoji.name === this.cancel) {
                        this.participant.removeMember(user);
                        const userReactions = reaction.message.reactions.cache.filter(reaction =>
                            reaction.users.cache.has(user.id) &&
                            (reaction.emoji.name === this.participation ||
                                reaction.emoji.name === this.cancel));
                        try {
                            for (const reaction of userReactions.values()) {
                                reaction.users.remove(user.id);
                            }
                        } catch (error) {
                            console.error('Failed to remove reactions.');
                        }
                    }
                    else {
                        if (user.id == this.planner.id) {
                            collector.stop();
                        }
                    }
                    let embedField = Object.assign({}, embed.fields[0]);
                    embedField.value = this.participant.members.length == 0 ? "なし" : this.participant.members;
                    reaction.message.embeds[0].fields[0] = embedField;
                    reaction.message.edit(new discord.MessageEmbed(reaction.message.embeds[0]));
                });
                collector.on("end", collection => {
                    mReaction.message.embeds[0].title = "募集終了";
                    mReaction.message.embeds[0].color = "#000000";
                    mReaction.message.edit(new discord.MessageEmbed(mReaction.message.embeds[0]));
                });
            });
    }

    calLimit(input = "1d") {
        let limit = new Date();
        const dIndex = input.indexOf("d");
        const hIndex = input.indexOf("h");
        if (dIndex != -1) {
            let parsed = parseInt(input.substring(0, dIndex), 10);
            if (!isNaN(parsed) && 0 < parsed) {
                limit.setDate(limit.getDate() + parsed);
            }
        }
        if (hIndex != -1) {
            let parsed = parseInt(input.substring(dIndex, hIndex), 10);
            if (!isNaN(parsed) && 0 < parsed) {
                limit.setHours(limit.getHours() + parsed);
            }
        }
        limit.setHours(limit.getHours() + 9);
        this.termDate = limit.getDate();
        this.termHour = limit.getHours();
        return limit;
    }
}