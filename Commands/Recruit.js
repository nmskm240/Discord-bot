const discord = require("discord.js");
const Command = require("./Command");
const Team = require("../Utils/Team");
const Form = require("../Utils/Form");

exports.modules = class Recruit extends Command {
    constructor() {
        super(".nit　recruit　募集内容　募集人数　募集期間",
            "リアクションを使用した募集フォームを作成する。\n" +
            "作成されたフォームは募集期間を過ぎるか、コマンド入力者が✖のリアクションを行うまで有効になる。\n",
            "・募集内容：募集する内容について自由に入力可能。\n" +
            "・募集人数：[省略可]募集する人数を指定する。省略時は人数指定なしとして扱う。参加者が募集人数に達すると募集を終了する。\n" +
            "・募集期間：[省略可]募集を終了するまでの日数や時間を指定する。省略時は1日。\n" +
            "　　2d12h と入力すると、募集開始から2日と12時間後に募集を終了する。");
        this.reactions = {
            allow: "✅",
            cancel: "❎",
            close: "✖",
        };
    }

    execute(message, parameters) {
        if (parameters.length < 1) {
            message.channel.send("コマンド引数が足りません。\n");
            return;
        }
        const parameter = this.parseParameter(parameters);
        const form = new Form(parameter.size);
        const embed = form.create("募集中", parameter.formBody, "参加者", message.author);
        message.channel.send(embed)
            .then(m => m.react(this.reactions.allow))
            .then(mReaction => mReaction.message.react(this.reactions.cancel))
            .then(mReaction => mReaction.message.react(this.reactions.close))
            .then(mReaction => form.open(mReaction.message, this.reactions, parameter.time.term));
    }

    parseParameter(parameters) {
        const parameter = {
            formBody: "**" + parameters[0] + "**\n\n",
            time: this.calLimit(),
            size: -1,
            term: {
                date: 0,
                hour: 0,
            }
        }
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let size = "制限なし";
        if (3 <= parameters.length) {
            parameter.time = this.calLimit(parameters[2]);
            let parsed = parseInt(parameters[1], 10);
            if (!isNaN(parsed) && 0 < parsed) {
                size = parsed + "人";
                parameter.size = parsed;
            }
        }
        else if (2 == parameters.length) {
            if (parameters[1].indexOf("d") == -1 && parameters[1].indexOf("h") == -1) {
                let parsed = parseInt(parameters[1], 10);
                if (!isNaN(parsed) && 0 < parsed) {
                    size = parsed + "人";
                    parameter.size = parsed;
                }
            }
            else {
                parameter.time = this.calLimit(parameters[1]);
            }
        }
        parameter.formBody += this.reactions.allow + "：参加、" + this.reactions.cancel + "：参加取消\n" +
            "募集人数：" + size + "\n" +
            "募集終了：" + parameter.time.limit.toLocaleDateString('ja-JP-u-ca-japanese', options) + "　" +
            parameter.time.limit.toLocaleTimeString("jp-JP", { hour: '2-digit', minute: '2-digit' })
        return parameter;
    }

    calLimit(input = "1d") {
        const data = {
            limit: new Date(),
            term: {
                date: 1,
                hour: 0,
            }
        }
        const dIndex = input.indexOf("d");
        const hIndex = input.indexOf("h");
        if (dIndex == -1 && hIndex == -1) {
            data.limit.setDate(data.limit.getDate() + 1);
        }
        else {
            if (dIndex != -1) {
                let parsed = parseInt(input.substring(0, dIndex), 10);
                if (!isNaN(parsed) && 0 < parsed) {
                    data.limit.setDate(data.limit.getDate() + parsed);
                    data.term.date = parsed;
                }
            }
            if (hIndex != -1) {
                let parsed = parseInt(input.substring(dIndex, hIndex), 10);
                if (!isNaN(parsed) && 0 < parsed) {
                    data.limit.setHours(data.limit.getHours() + parsed);
                    data.term.hour = parsed;
                }
            }
        }
        data.limit.setHours(data.limit.getHours() + 9);
        return data;
    }
}