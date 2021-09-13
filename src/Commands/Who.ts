import { GuildMember, MessageEmbed } from "discord.js";
import { Command } from "./Command";
import { OmittableMemberParameter } from "./Parameters";
import { MemberDatabase } from "../Utils/Members/MemberDatabase";

export class Who extends Command {
    constructor() {
        super(
            "who",
            "メンションで指定したメンバーのデータを表示します。\n",
            [
                new OmittableMemberParameter("対象メンバー", "情報を表示するメンバーを指定します。", null)
            ]
        );
    }

    public async execute(): Promise<MessageEmbed> {
        const target: GuildMember = this.parameters[0].valueOrDefault;
        const tag: string = target.user.tag;
        const res = await MemberDatabase.instance.find({ tag: tag.slice(tag.length - 5) });
        if (res.length > 0) {
            let description: string = "";
            for (const game of res[0].games) {
                if(!game.id) {
                    continue;
                }
                description = description.concat(game.name + ":**" + game.id + "**\n");
            }
            return new MessageEmbed()
                .setTitle(target.displayName)
                .setDescription(description)
                .setColor("#00a2ff")
                .setImage(target.user.avatarURL()!);
        }
        return new MessageEmbed()
            .setTitle("エラー")
            .setDescription(target.toString() + "はデータベースに登録されていません")
    }
}
