module.exports = class Command {
    constructor(name, detail,　...parameters) {
        this.name = name;
        this.detail = detail;
        this.parameters = parameters;
    }

    execute(message, parameters) {

    }
}