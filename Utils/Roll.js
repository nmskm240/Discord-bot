const fetch = require("node-fetch");

module.exports = class Roll {
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
module.exports.register = [];