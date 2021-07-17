const discord = require("discord.js");
const Command = require("./Command");

module.exports = class Help extends Command {
    constructor() {
        super(".nit　help　コマンド名",
            "実装されているコマンドの説明を表示します。\n",
            "・コマンド名：ヘルプを表示するコマンド名");
    }

    execute(message, parameters) {
        const embed = new discord.MessageEmbed()
            .setTitle("ヘルプ")
            .setColor("#00a2ff")
        if(parameters.length <= 0){
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