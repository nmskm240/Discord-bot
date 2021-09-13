import { DatabaseProvider } from "../../Database";
import { Member } from "./Member";

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