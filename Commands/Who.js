const discord = require("discord.js");
const Command = require("./Command");
const Network = require("../Utils/Network");

exports.modules = class Who extends Command {
    constructor() {
        super(".nit　who　対象メンバー",
            "メンションで指定したメンバーの登録されているデータを表示する。\n",
            "・対象メンバー：[省略可]情報を表示するメンバーをメンションで指定する。省略時は自分の情報を表示する。\n");
    }

    execute(message, parameters) {
        if (message.channel.type == "dm") {
            message.channel.send(message.channel.type + "ではwhoコマンドを使用できません");
            return;
        }
        let isEnd = false;
        const target = (parameters.size <= 0) ? message.member : parameters.first();
        Network.get({ command: "who" })
            .then(res => {
                res.data.forEach(member => {
                    if (target.user.tag.indexOf(member.DiscordTag) != -1) {
                        const keys = Object.keys(member.game);
                        const values = Object.values(member.game);
                        const description = member.Medals + "\n\n";
                        for(let i = 0; i < keys.length; i++){
                            description += keys[i] + ":**" + values[i] + "**\n";
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