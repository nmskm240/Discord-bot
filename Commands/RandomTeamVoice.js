const Team = require("../Utils/Team");
const RandomTeam = require("./RandomTeam");

exports.modules = class RandomTeamVoice extends RandomTeam {
    constructor() {
        super(".nit　rtv　1チームの人数　除外メンバー",
            "コマンド入力者が参加しているVCの参加者でランダムなチームを作成する。\n",
            "・1チームの人数：[省略可]1チームの人数を指定する。省略時は3人。\n" +
            "・除外メンバー：[省略可][複数指定可]メンションで指定したメンバーをチーム作成に含めない。\n");
    }

    execute(message, parameters) {
        const vc = message.member.voice.channel;
        if (vc) {
            const embed = super.execute(message, parameters);
            this.make(vc.members.array(), message.mentions.members.array()).forEach(team => {
                embed.addField(team.name, team.members);
            });
            message.channel.send(embed);
        }
        else {
            message.channel.send("ボイスチャンネルの収得に失敗しました。\n");
        }
    }

    make(members, exclusion) {
        return Team.random(members.filter(m => exclusion.indexOf(m) == -1), this.size)
    }
}