import { Parameter } from "./Parameter";
import { RandomTeam } from "./RandomTeam";

export class rtc extends RandomTeam {
    constructor() {
        super("rtc",
            "メンションで指定したメンバーでランダムなチームを作成します。\n",
            new Parameter("1チームの人数", "1チームの人数を指定します。", "0以上の整数", false, true, "3"),
            new Parameter("対象ゲーム", "チーム分けを行うゲームを指定します。", "半角英語大文字でのゲームタイトル（APEX, LOL等）", false, true, "空白文字列"),
            new Parameter("考慮対象", "チーム分け時に考慮する情報を指定します。", "半角英語子文字（rank, kdr, damage等）", false, true, "rank"),
            new Parameter("対象メンバー", "チーム分けに含めるメンバーを指定します。", "メンション", true));
    }
}