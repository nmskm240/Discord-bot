import { DatabaseProvider } from "../../Database";
import { Course } from "./Course";
import { Game } from "./Game";
import { Member } from "./Member";
import { MemberType } from "./MemberType";

export class MemberDatabase extends DatabaseProvider<Member> {
    private static _instance: MemberDatabase = new MemberDatabase();

    public static get instance(): MemberDatabase {
        return this._instance;
    }

    private constructor() {
        super("members");
    }

    protected async parseAll(documents: any[]): Promise<Member[]> {
        const members: Member[] = [];
        for(const member of documents) {
            members.push(Member.parse(member));
        }
        return members;
    }
}