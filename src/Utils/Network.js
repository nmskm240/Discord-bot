const axiosBase = require("axios");
const baseURL = "https://script.google.com";

module.exports = class Network {
    static async get(query) {
        const axios = axiosBase.create({
            baseURL: baseURL,
        });
        const res = await axios.get(Network.URL, {
            params: query,
        })
            .catch(error => {
                console.log("GASへのGETに失敗");
                return error.response;
            });
        if (res.status != 200) {
            return null;
        }
        return res;
    }

    static async post(sendData) {
        const axios = axiosBase.create({
            baseURL: baseURL,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            responseType: "json",
        });
        const res = await axios.post(Network.URL, sendData)
            .catch(error => {
                console.log("GASへのPOSTに失敗");
                return error.response;
            });
        if (res.status != 200) {
            return null;
        }

    }
}
module.exports.URL = "";