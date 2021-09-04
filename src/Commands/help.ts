import discord from "discord.js";
import { Command } from "./Command";
import { Parameter } from "./Parameter";

export class help extends Command {
    detail: any;
    grammar: any;
    parameters: any;
    constructor() {
        super("help",
            "実装されているコマンドの説明を表示します。\n",
            new Parameter("コマンド名", "ヘルプを表示するコマンドを指定します。", "実装されているコマンド"));
    }

    execute(message: any, parameters: any) {
        const embed = new discord.MessageEmbed()
            .setTitle("ヘルプ")
            .setColor("#00a2ff")
        if (parameters.length <= 0) {
            embed.setDescription("「.nit help」の後にヘルプを表示するコマンド名を入力し、再度投稿してください。")
        }
        else {
            if (parameters[0].startsWith("help")) {
                embed.setDescription("**" + this.grammar + "**\n\n" + this.detail)
                    .addFields(this.parameters.map((p: any) => {
                        return { name: p.name, value: p.detail };
                    }))
            }
            else {
                embed.setTitle("ヘルプ(ERROR)")
                    .setDescription("コマンドではない文字列が入力されました。")
            }
        }
        message.channel.send(embed);
    }
}