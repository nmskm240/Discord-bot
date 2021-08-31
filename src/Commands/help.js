const discord = require("discord.js");
const requireDir = require("require-dir");
const commands = requireDir("../Commands")

module.exports = class help extends commands.Command {
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
                .addField("実装コマンド", Object.keys(commands).filter(c => !c.match(/^[A-Z]/)))
        }
        else {
            try {
                const command = new commands[parameters[0]]();
                embed.setDescription("**" + command.grammar + "**\n\n" + command.detail)
                    .addFields(command.parameters.map(p => {
                        return { name: p.name, value: p.detail };
                    }))
            } catch (error) {
                if (parameters[0].startsWith("help")) {
                    embed.setDescription("**" + this.grammar + "**\n\n" + this.detail)
                        .addFields(this.parameters.map(p => {
                            return { name: p.name, value: p.detail };
                        }))
                }
                else {
                    embed.setTitle("ヘルプ(ERROR)")
                        .setDescription("コマンドではない文字列が入力されました。")
                }
            }
        }
        message.channel.send(embed);
    }
}