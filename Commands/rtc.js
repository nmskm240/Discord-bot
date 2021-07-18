const requireDir = require("require-dir");
const commands = requireDir("../Commands");
const utils = requireDir("../Utils");

module.exports = class rtc extends commands.RandomTeam {
    constructor() {
        super("rtc",
            "メンションで指定したメンバーでランダムなチームを作成します。\n",
            new commands.Parameter("1チームの人数", "1チームの人数を指定します。", "0以上の整数", false, true, "3"),
            new commands.Parameter("対象メンバー", "チーム分けに含めるメンバーを指定します。", "メンション", true));
    }

    execute(message, parameters) {
        const embed = super.execute(message, parameters);
        this.make(message.mentions.members.array()).forEach(team => {
            embed.addField(team.name, team.members);
        });
        message.channel.send(embed);
    }

    make(members) {
        return utils.Team.random(members, this.size);
    }
}