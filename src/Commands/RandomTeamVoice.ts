import { EmbedFieldData, GuildMember, MessageEmbed, VoiceChannel } from "discord.js";
import { Command } from "./Command";
import { Team } from "../Utils/Team";
import { OmittableMembersParameter, OmittableNumberParameter } from "./Parameters";

export class RandomTeamVoice extends Command {
    constructor() {
        super(
            "rtv",
            "コマンド入力者が参加しているVCの参加者でランダムなチームを作成します。\n",
            [
                new OmittableNumberParameter("1チームの人数", "1チームの人数を指定します。", (value: number) => { return 0 < value; }, 3),
                new OmittableMembersParameter("除外メンバー", "チーム分けに含めないメンバーを指定します。", []),
            ]
        );
    }

    public async execute(): Promise<MessageEmbed> {
        try {
            if (!this.info.performer) {
                throw new Error("");
            }
            const vc: VoiceChannel | null = this.info.performer.voice.channel;
            if (!vc) {
                throw new Error("");
            }
            const size: number = this.parameters[0].valueOrDefault;
            const exclusion: GuildMember[] = this.parameters[1].valueOrDefault;
            const members: GuildMember[] = vc.members.array().filter((member: GuildMember) => {
                return exclusion.indexOf(member) != -1;
            });
            const teams: Team[] = Team.random(members, size);
            const fields: EmbedFieldData[] = teams.map((team: Team) => {
                return { name: team.name, value: team.members };
            })
            return new MessageEmbed()
                .setTitle("チーム分け結果")
                .addFields(fields);
        } catch (error) {
            return new MessageEmbed()
                .setTitle("エラー");
        }
    }
}