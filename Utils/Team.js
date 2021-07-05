module.exports = class Team {
    constructor(name, max = -1) {
        this.name = name;
        this.max = max <= 0 ? -1 : max;
        this.isMax = false;
        this.isEmpty = true;
        this.members = [];
    }

    addMember(member) {
        if (!this.isMax && !this.hasMember(member)) {
            this.members.push(member);
            this.refresh();
        }
    }

    addMembers(members) {
        for (let member of members) {
            this.addMember(member);
        }
    }

    hasMember(member) {
        return this.members.indexOf(member) != -1;
    }

    removeMember(member) {
        if (this.hasMember(member)) {
            this.members.splice(this.members.indexOf(member), 1);
            this.refresh();
        }
    }

    refresh() {
        this.isMax = this.max != -1 && this.members.length >= this.max;
        this.isEmpty = this.members.length == 0;
    }

    static random(members, size) {
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