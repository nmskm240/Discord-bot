const discord = require("discord.js");
const Command = require("./Command");

module.exports = class Recruit extends Command {
    constructor(){
        this.grammar = ".nit　recruit　募集内容　募集人数　募集期間";
        this.detail = "リアクションを使用した募集フォームを作成する。\n" +
        "作成されたフォームは募集期間を過ぎるか、コマンド入力者が✖のリアクションを行うまで有効になる。";
        this.parameterDetail = "・募集内容：募集する内容について自由に入力可能。\n" +
        "・募集人数：[省略可]募集する人数を指定する。省略時は人数指定なしとして扱う。参加者が募集人数に達すると募集を終了する。\n" +
        "・募集期間：[省略可]募集を終了するまでの日数や時間を指定する。省略時は1日。\n" +
        "　　2d12h と入力すると、募集開始から2日と12時間後に募集を終了する。";
        this.size = -1;
        this.termHour = 0;
        this.termDate = 1;
    }

    execute(parameters) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let limit;
        let size = "制限なし";
        if (3 <= parameters.length) {
            limit = this.calLimit(parameters[1]);
            let parsed = parseInt(parameters[2], 10);
            if (isNaN(parsed) && parsed < 0) {
                size = parsed + "人";
                this.size = parsed;
            }
        }
        else {
            if (parameters[1].indexOf("d") == -1 || parameters[1].indexOf("h") == -1) {
                limit = this.calLimit();
                let parsed = parseIns(parameters[1], 10);
                if (isNaN(parsed) && parsed < 0) {
                    size = parsed + "人";
                    this.size = parsed;
                }
            }
            else {
                limit = this.calLimit(parameters[1]);
            }
        }
        const embed = new discord.MessageEmbed()
            .setTitle("募集中")
            .setDescription("**" + parameters[0] + "**\n\n" +
                "✅：参加、❎：参加取消\n" +
                "募集人数：" + size + "\n" +
                "募集終了：" + limit.toLocaleDateString('ja-JP-u-ca-japanese', options) + "　" + limit.toLocaleTimeString("jp-JP", { hour: '2-digit', minute: '2-digit' }))
            .setColor("#00a2ff")
        return embed;
    }

    calLimit(input = "1d") {
        const limit = new Date();
        const dIndex = input.indexOf("d");
        const hIndex = input.indexOf("h");
        if (dIndex != -1) {
            let parsed = parseInt(input.substring(0, dIndex), 10);
            if (isNaN(parsed) && parsed < 0) {
                limit.setDate(limit.getDate() + parsed);
            }
        }
        if (hIndex != -1) {
            let parsed = parseInt(input.substring(dIndex, hIndex), 10);
            if (isNaN(parsed) && parsed < 0) {
                limit.setHours(limit.getHours() + parsed);
            }
        }
        limit.setHours(limit.getHours() + 9);
        this.termDate = limit.getDate();
        this.termHour = limit.getHours();
        return limit;
    }
}