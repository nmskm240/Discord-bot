import axiosBase, { AxiosInstance, AxiosResponse } from "axios";
const baseURL = "https://script.google.com";

export class Network {
    public static async get(query: any): Promise<any> {
        const axios: AxiosInstance = axiosBase.create({
            baseURL: baseURL,
        });
        const res: AxiosResponse = await axios.get(process.env.GAS!, {
            params: query,
        });
        if (res.status != 200) {
            return null;
        }
        return res.data;
    }

    public static async post(sendData: any) {
        const axios = axiosBase.create({
            baseURL: baseURL,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            responseType: "json",
        });
        const res = await axios.post(process.env.GAS!, sendData)
            .catch((error: any) => {
                console.log("GASへのPOSTに失敗");
                return error.response;
            });
        if (res.status != 200) {
            return null;
        }

    }
}