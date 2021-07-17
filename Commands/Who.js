const discord = require("discord.js");
const requireDir = require("require-dir");
const commands = requireDir("../Commands");
const utils = requireDir("../Utils");

module.exports = class Who extends commands.Command {
    constructor() {
        super("who",
            "メンションで指定したメンバーのデータを表示します。\n",
            new commands.Parameter("対象メンバー", "情報を表示するメンバーを指定します。", "メンション", false, true, "自分"));
    }

    execute(message, parameters) {
        if (message.channel.type == "dm") {
            message.channel.send(message.channel.type + "ではwhoコマンドを使用できません");
            return;
        }
        let isEnd = false;
        const target = (parameters.size <= 0) ? message.member : parameters.first();
        utils.Network.get({ command: "who" })
            .then(res => {
                res.data.forEach(member => {
                    if (target.user.tag.indexOf(member.DiscordTag) != -1) {
                        const keys = Object.keys(member.game);
                        const values = Object.values(member.game);
                        let description = member.Medals + "\n\n";
                        for (let i = 0; i < keys.length; i++) {
                            description += keys[i] + ": ** " + values[i] + " ** \n";
                        }
                        const embed = new discord.MessageEmbed()
                            .setTitle(target.displayName)
                            .setDescription(description)
                            .setColor("#00a2ff")
                            .setImage(target.user.avatarURL())
                        message.channel.send(embed);
                        isEnd = true;
                        return;
                    }
                })
                if (!isEnd) {
                    message.channel.send(target + "は名簿に載っていないか、名簿のデータと異なります");

                }
            })
            .catch(e => {
                console.error(e);
                message.channel.send("エラー");
            })
    }
}