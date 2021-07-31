const requireDir = require("require-dir");
const commands = requireDir("../Commands");
const utils = requireDir("../Utils");

module.exports = class rtv extends commands.RandomTeam {
    constructor() {
        super("rtv",
            "コマンド入力者が参加しているVCの参加者でランダムなチームを作成します。\n",
            new commands.Parameter("1チームの人数", "1チームの人数を指定します。", "0以上の整数", false, true, "3"),
            new commands.Parameter("対象ゲーム", "チーム分けを行うゲームを指定します。", "半角英語大文字でのゲームタイトル（APEX, LOL等）", false, true, "空白文字列"),
            new commands.Parameter("考慮対象", "チーム分け時に考慮する情報を指定します。", "半角英語子文字（rank, kdr, damage等）", false, true, "rank"),
            new commands.Parameter("除外メンバー", "チーム分けに含めないメンバーを指定します。", "メンション", true));
    }

    parseParameter(message, parameters) {
        const parameter = super.parseParameter(message, parameters);
        const vc = message.member.voice.channel;
        if (vc) {
            const members = vc.members.array();
            parameter.members = members.filter(m => parameter.members.indexOf(m) == -1);
        }
        else {
            message.channel.send("ボイスチャンネルの収得に失敗しました。\n");
        }
        return parameter;
    }
}