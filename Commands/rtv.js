const requireDir = require("require-dir");
const commands = requireDir("../Commands");
const utils = requireDir("../Utils");

module.exports = class rtv extends commands.RandomTeam {
    constructor() {
        super("rtv",
            "コマンド入力者が参加しているVCの参加者でランダムなチームを作成します。\n",
            new commands.Parameter("1チームの人数", "1チームの人数を指定します。", "0以上の整数", false, true, "3"),
            new commands.Parameter("除外メンバー", "チーム分けに含めないメンバーを指定します。", "メンション", true));
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
        return utils.Team.random(members.filter(m => exclusion.indexOf(m) == -1), this.size)
    }
}