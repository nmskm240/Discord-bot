import { MessageEmbed } from "discord.js";
import { CommandParameter, Parameter } from "./Parameters";
import { Command } from "./Command";

export class Help extends Command {
    constructor() {
        super(
            "help",
            "実装されているコマンドの説明を表示します。\n",
            [
                new CommandParameter("コマンド名", "ヘルプを表示するコマンドを指定します。"),
            ]
        );
    }

    public async execute(): Promise<MessageEmbed> {
        const target: Command = this.parameters[0].valueOrDefault();
        return new MessageEmbed()
            .setTitle("ヘルプ")
            .setColor("#00a2ff")
            .setDescription("**" + target.grammar + "**\n\n" + target.detail)
            .addFields(target.parameters.map((p: Parameter<any>) => {
                return { name: p.name, value: p.detail };
            }));
    }
}