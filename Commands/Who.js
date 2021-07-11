const discord = require("discord.js");
const Command = require("./Command");
const Roll = require("../Utils/Roll");

exports.modules = class Who extends Command {
    constructor() {
        super(".nit　who　対象メンバー",
            "メンションで指定したメンバーの登録されているデータを表示する。\n",
            "・対象メンバー：[省略可]情報を表示するメンバーをメンションで指定する。省略時は自分の情報を表示する。\n");
    }

    execute(message, parameters) {
        if(message.channel.type == "dm"){
            message.channel.send(message.channel.type + "ではwhoコマンドを使用できません");
            return;
        }
        const target = (parameters.size <= 0) ? message.member : parameters.first();
        const embed = new discord.MessageEmbed()
            .setTitle("エラー")
        Roll.register.forEach(member => {
            if (target.user.tag.indexOf(member.DiscordTag) != -1) {
                embed.setTitle(target.displayName)
                    .setDescription(member.Medals + "\n\n" +
                        "APEX ID：**" + member.APEXID + "**\n" +
                        "LOL ID：**" + member.LOLID + "**\n")
                    .setColor("#00a2ff")
                    .setImage(target.user.avatarURL())
                return;
            }
        })
        message.channel.send(embed);
    }
}