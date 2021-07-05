const discord = require("discord.js");
const Command = require("./Command");

exports.modules = class Help extends Command {
    constructor() {
        super(".nit　help",
            "実装されているコマンドの説明を表示する。\n",
            "引数なし");
    }

    execute(message, parameters) {
        const embed = new discord.MessageEmbed()
            .setTitle("ヘルプ")
            .setColor("#00a2ff")
        parameters.forEach(c => embed.addField(c.grammar, c.detail + c.parameterDetail));
        message.channel.send(embed);
    }
}