import { GuildMember, MessageEmbed } from "discord.js";
import { Command } from "./Command";
import { OmittableMemberParameter } from "./Parameters";
import { DiscordID, MemberData, Network } from "../Utils";

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

    public async execute(): Promise<void> {
        const target: GuildMember = this.parameters[0].valueOrDefault;
        const request = new DiscordID(target.user.id);
        const res = await Network.get<MemberData>(process.env.NAME_LIST_API!, request);
        if (res) {
            let description: string = "";
            for (const game of res.games) {
                if(!game.id) {
                    continue;
                }
                description = description.concat(game.title + ":**" + game.id + "**\n");
            }
            this._result = new MessageEmbed()
                .setTitle(target.displayName)
                .setDescription(description)
                .setColor("BLUE")
                .setImage(target.user.avatarURL()!);
            return;
        }
        this._result = new MessageEmbed()
            .setTitle("エラー")
            .setDescription(target.toString() + "は名簿に登録されていません")
            .setColor("RED")
    }
}
