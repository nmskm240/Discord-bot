import { GuildMember, MessageEmbed } from "discord.js";
import { Command } from "./Command";
import { Network } from "../Utils/Network";
import { MemberParameter } from "./Parameters";

export class Who extends Command {
    constructor() {
        super(
            "who",
            "メンションで指定したメンバーのデータを表示します。\n",
            [
                new MemberParameter("対象メンバー", "情報を表示するメンバーを指定します。")
            ]
        );
    }

    public async execute(): Promise<MessageEmbed> {
        const target: GuildMember = this.parameters[0].valueOrDefault;
        const res = await Network.get({ command: "who" });
        for (const member of res.data) {
            if (target.user.tag.indexOf(member.DiscordTag) != -1) {
                const keys = Object.keys(member.game);
                const values = Object.values(member.game);
                let description = member.Medals + "\n\n";
                for (const i in keys) {
                    description += keys[i] + ": ** " + values[i] + " ** \n";
                }
                return new MessageEmbed()
                    .setTitle(target.displayName)
                    .setDescription(description)
                    .setColor("#00a2ff")
                    .setImage(target.user.avatarURL()!);
            }
        }
        return new MessageEmbed()
            .setTitle("エラー")
            .setDescription(target + "はデータベースに登録されていません")
    }
}