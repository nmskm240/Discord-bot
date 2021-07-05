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
        const target = parameters.user;
        const embed = new discord.MessageEmbed()
            .setTitle("エラー")
        Roll.register.forEach(member => {
            if (target.tag.indexOf(member.DiscordTag) != -1) {
                embed.setTitle(parameters.displayName)
                    .setDescription(member.Medals + "\n\n" +
                        "APEX ID：**" + member.APEXID + "**\n" +
                        "LOL ID：**" + member.LOLID + "**\n")
                    .setColor("#00a2ff")
                    .setImage(target.avatarURL())
                return;
            }
        })
        message.channel.send(embed);
    }
}