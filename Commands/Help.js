const discord = require("discord.js");
const requireDir = require("require-dir");
const commands = requireDir("../Commands")

module.exports = class Help extends commands.Command {
    constructor() {
        super("help",
            "実装されているコマンドの説明を表示します。\n",
            new commands.Parameter("コマンド名", "ヘルプを表示するコマンドを指定します。", "実装されているコマンド"));
    }

    execute(message, parameters) {
        const embed = new discord.MessageEmbed()
            .setTitle("ヘルプ")
            .setColor("#00a2ff")
        if (parameters.length <= 0) {
            embed.setDescription("「.nit help」の後にヘルプを表示するコマンド名を入力し、再度投稿してください。")
                .addField("実装コマンド",
                    "・rtc\n" +
                    "・rtv\n" +
                    "・recruit\n" +
                    "・who\n")
        }
        message.channel.send(embed);
    }
}