const discord = require("discord.js");
const Command = require("./Command");
const Roll = require("../Utils/Roll");

exports.modules = class Who extends Command {
    constructor() {
        super(".nit　who　対象メンバー",
            "メンションで指定したメンバーの登録されているデータを表示する。\n",
            "・対象メンバー：情報を表示するメンバーをメンションで指定する。\n");
    }

    execute(message, parameters) {
        if (parameters.size <= 0) {
            message.channel.send("情報を表示するメンバーをメンションで指定してください。")
            return;
        }
        const target = parameters.first();
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