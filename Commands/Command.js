module.exports = class Command {
    constructor(grammar, detail, parameterDetail) {
        this.grammar = grammar;
        this.detail = detail;
        this.parameterDetail = parameterDetail;
    }

    execute(message, parameters) {

    }
}