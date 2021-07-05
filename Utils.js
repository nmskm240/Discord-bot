const fetch = require("node-fetch");

module.exports.Team = class Team {
    constructor(name, max = -1) {
        this.name = name;
        this.max = max <= 0 ? -1 : max;
        this.isMax = false;
        this.members = [];
    }

    addMember(member) {
        if (!this.isMax && !this.hasMember(member)) {
            this.members.push(member);
            this.isMax = this.isMax != -1 && this.members.length >= this.max;
        }
    }

    addMembers(members) {
        for (let member of members) {
            this.addMember(member);
        }
    }

    hasMember(member) {
        return this.members.indexOf(member) == -1 ? false : true;
    }

    removeMember(member) {
        if (this.hasMember(member)) {
            this.members.splice(this.members.indexOf(member), 1);
            this.isMax = this.isMax != -1 && this.members.length >= this.max;
        }
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

module.exports.Roll = class Roll {
    static async update() {
        await fetch("https://script.google.com/macros/s/AKfycbxb37qfooGrVvqqzL5HEAHx-0WCb4MpLNdnYYltBEs3sxN5PSRPVEUZ3XLduxIjauaaRA/exec")
            .then((response) => {
                if (!response.ok) {
                    throw new Error();
                }
                return response.json();
            })
            .then((json) => {
                Roll.register = json;
            })
            .catch((reason) => {
                console.log(reason);
            })
    }
}
module.exports.Roll.register = [];