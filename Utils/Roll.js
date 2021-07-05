const fs = require("fs");
const fetch = require("node-fetch");
const path = "./Data/Links.json";

module.exports = class Roll {
    static update() {
        fs.readFile(path, { encoding: "utf8" }, (err, file) => {
            if (err) {
                console.error(err);
            } else {
                const data = JSON.parse(file).APIs[0];
                Roll.read(data.url);
            }
        });
    }

    static async read(url) {
        await fetch(url)
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