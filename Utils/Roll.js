const Network = require("../Utils/Network");

module.exports = class Roll {
    static update() {
        Network.get({ command: "who" })
            .then(res => {
                Roll.register = res.data;
            })
    }
}
module.exports.register = [];