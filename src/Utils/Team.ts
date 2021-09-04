// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class Team {
    isEmpty: any;
    isMax: any;
    max: any;
    members: any;
    name: any;
    constructor(name: any, max = -1) {
        this.name = name;
        this.max = max <= 0 ? -1 : max;
        this.isMax = false;
        this.isEmpty = true;
        this.members = [];
    }

    addMember(member: any) {
        if (!this.isMax && !this.hasMember(member)) {
            this.members.push(member);
            this.refresh();
        }
    }

    addMembers(members: any) {
        for (let member of members) {
            this.addMember(member);
        }
    }

    hasMember(member: any) {
        return this.members.indexOf(member) != -1;
    }

    removeMember(member: any) {
        if (this.hasMember(member)) {
            this.members.splice(this.members.indexOf(member), 1);
            this.refresh();
        }
    }

    refresh() {
        this.isMax = this.max != -1 && this.members.length >= this.max;
        this.isEmpty = this.members.length == 0;
    }

    static random(members: any, size: any) {
        let teams = [];
        let count = 1;
        while (size <= members.length) {
            let team = new Team("チーム" + count, size);
            while (!team.isMax) {
                let index = Math.floor(Math.random() * members.length);
                team.addMember(members[index]);
                members.splice(index, 1);
            }
            teams.push(team);
            count++;
        }
        if (0 < members.length) {
            let team = new Team("余ったメンバー");
            team.addMembers(members);
            teams.push(team);
        }
        return teams;
    }
}