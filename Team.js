module.exports = class Team {
    constructor(name) {
        this.name = name;
        this.members = [];
    }

    addMember(member){
        if(this.hasMember(member)){
            this.members.push(member);
        }
    }

    addMembers(members){
        for(let member of members){
            this.addMember(member);
        }
    }

    getMembers(){
        return this.members;
    }

    hasMember(member){
        return this.members.indexOf(member) == -1 ? true : false;
    }
}