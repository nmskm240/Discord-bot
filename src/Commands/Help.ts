import { MessageEmbed } from "discord.js";
import { OmittableCommandParameter, Parameter } from "./Parameters";
import { Command } from "./Command";

export class Help extends Command {
    constructor() {
        super(
            "help",
            "実装されているコマンドの説明を表示します。\n",
            [
                new OmittableCommandParameter("コマンド名", "ヘルプを表示するコマンドを指定します。", "help"),
            ]
        );
    }

    public async execute(): Promise<void> {
        const target: Command = this.parameters[0].valueOrDefault;
        this._result = new MessageEmbed()
            .setTitle("ヘルプ")
            .setColor("BLUE")
            .setDescription("**" + target.grammar + "**\n\n" + target.detail)
            .addFields(target.parameters.map((p: Parameter<any>) => {
                return { name: p.name, value: p.detail };
            }));
    }
}
