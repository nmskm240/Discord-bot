import axiosBase, { AxiosInstance, AxiosResponse } from "axios";
import { DTO } from "./Models/DTO";
const baseURL = "https://script.google.com";

export class Network {
    public static async get<Response extends DTO>(query: DTO | undefined = undefined): Promise<Response | null> {
        const axios: AxiosInstance = axiosBase.create({
            baseURL: baseURL,
        });
        const res: AxiosResponse<Response> = await axios.get<Response>(process.env.GAS!, {
            params: query?.toObject(),
        });
        if (res.status != 200) {
            return null;
        }
        return res.data;
    }

    public static async post<Request extends DTO, Response extends DTO | null>(data: Request): Promise<Response | null> {
        const axios = axiosBase.create({
            baseURL: baseURL,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            responseType: "json",
        });
        const res: AxiosResponse<Response> = await axios.post<Request, Response>(process.env.GAS!, data)
            .catch((error: any) => {
                console.log("GASへのPOSTに失敗");
                return error.response;
            });
        if (res.status != 200) {
            return null;
        }
        return res.data;
    }
}