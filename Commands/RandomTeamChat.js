const RandomTeam = require("./RandomTeam");
const Team = require("../Utils/Team")

exports.modules = class RandomTeamChat extends RandomTeam {
    constructor() {
        super(".nit　rtc　1チームの人数　対象メンバー",
            "メンションで指定したメンバーでランダムなチームを作成する。\n",
            "・1チームの人数：[省略可]1チームの人数を指定する。省略時は3人。\n" +
            "・対象メンバー：[複数指定可]チーム作成に含めるメンバーをメンションで指定する。\n");
    }

    execute(message, parameters) {
        const embed = super.execute(message, parameters);
        this.make(message.mentions.members.array()).forEach(team => {
            embed.addField(team.name, team.members);
        });
        message.channel.send(embed);
    }

    make(members) {
        return Team.random(members, this.size);
    }
}