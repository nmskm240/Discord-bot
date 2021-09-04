// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const axiosBase = require("axios");
const baseURL = "https://script.google.com";

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class Network {
    static async get(query: any) {
        const axios = axiosBase.create({
            baseURL: baseURL,
        });
        const res = await axios.get((Network as any).URL, {
    params: query,
})
    .catch((error: any) => {
    console.log("GASへのGETに失敗");
    return error.response;
});
        if (res.status != 200) {
            return null;
        }
        return res;
    }

    static async post(sendData: any) {
        const axios = axiosBase.create({
            baseURL: baseURL,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            responseType: "json",
        });
        const res = await axios.post((Network as any).URL, sendData)
    .catch((error: any) => {
    console.log("GASへのPOSTに失敗");
    return error.response;
});
        if (res.status != 200) {
            return null;
        }

    }
}
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.URL = "";