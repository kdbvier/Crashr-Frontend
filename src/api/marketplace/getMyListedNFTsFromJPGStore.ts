import axios from "axios";
import { BASE_URL } from "@/constants/document";

export const getMyListedNFTsFromJPGStore = async (address: string) => {
    try {
        const url = `${BASE_URL}market/my-jpg-store-listing?address=${address}`;
        const response = await axios.get(url);
        console.log("response", response)
        if (response) {
            if (response.status === 200) {
                return response.data;
            }
        }
    } catch (err) {
        console.log("Error getMyListedNFTsFromJPGStore", err)
    }
}