import { EmbedFieldData, GuildMember, MessageEmbed } from "discord.js";
import { Command } from "./Command";
import { Team } from "../Utils";
import { MembersParameter, OmittableNumberParameter } from "./Parameters";

export class RandomTeamChat extends Command {
    constructor() {
        super(
            "rtc",
            "メンションで指定したメンバーでランダムなチームを作成します。\n",
            [
                new OmittableNumberParameter("1チームの人数", "1チームの人数を指定します。", (value: number) => { return 0 < value; }, 3),
                new MembersParameter("対象メンバー", "チーム分けに含めるメンバーを指定します。")
            ]
        );
    }

    public async execute(): Promise<MessageEmbed> {
        const size: number = this.parameters[0].valueOrDefault;
        const members: GuildMember[] = this.parameters[1].valueOrDefault;
        const teams: Team[] = Team.random(members, size);
        const fields: EmbedFieldData[] = teams.map((team: Team) => {
            return { name: team.name, value: team.members };
        })
        return new MessageEmbed()
            .setTitle("チーム分け結果")
            .addFields(fields)
    }
}