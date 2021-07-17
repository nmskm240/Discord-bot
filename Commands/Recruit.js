const requireDir = require("require-dir");
const commands = requireDir("../Commands");
const utils = requireDir("../Utils");

module.exports = class Recruit extends commands.Command {
    constructor() {
        super("recruit",
            "リアクションを使用した募集フォームを作成します。\n",
            new commands.Parameter("募集内容", "募集する内容について自由に入力できます。", "なし"),
            new commands.Parameter("募集人数", "募集する人数を指定します。", "0以上の整数", false, true, "制限なし"),
            new commands.Parameter("募集期間", "募集を終了するまでの日時を指定します。", "〇d△h", false, true, "1d"));
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
        const form = new utils.Form(parameter.size);
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
            time: utils.Converter.text2Time("1d"),
            size: -1,
            term: {
                date: 0,
                hour: 0,
            }
        }
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let size = "制限なし";
        if (3 <= parameters.length) {
            parameter.time = utils.Converter.text2Time(parameters[2]);
            let parsed = parseInt(parameters[1], 10);
            if (!isNaN(parsed) && 0 < parsed) {
                size = parsed + "人";
                parameter.size = parsed;
            }
        }
        else if (2 == parameters.length) {
            if (parameters[2].indexOf("d") == -1 && parameters[2].indexOf("h") == -1) {
                let parsed = parseInt(parameters[1], 10);
                if (!isNaN(parsed) && 0 < parsed) {
                    size = parsed + "人";
                    parameter.size = parsed;
                }
            }
            else {
                parameter.time = utils.Converter.text2Time(parameters[2]);
            }
        }
        parameter.formBody += this.reactions.allow + "：参加、" + this.reactions.cancel + "：参加取消\n" +
            "募集人数：" + size + "\n" +
            "募集終了：" + parameter.time.limit.toLocaleDateString('ja-JP-u-ca-japanese', options) + "　" +
            parameter.time.limit.toLocaleTimeString("jp-JP", { hour: '2-digit', minute: '2-digit' })
        return parameter;
    }
}