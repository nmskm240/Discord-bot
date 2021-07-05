const Team = require("./Team")

module.exports = class Form{
    constructor(answerableSize = -1){
        this.respondents = new Team("回答者", answerableSize);
    }
}