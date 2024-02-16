import axios from "axios";
import { BASE_URL } from "@/constants/document";
import { successAlert } from "@/hooks/alert";

export const updateUserProfile = async (reqData: any) => {
    try {
        const url = "https://c7uwl2c9qh.execute-api.us-west-2.amazonaws.com/put-users";
        const response = await axios.post(url, JSON.stringify(reqData));
        if (response) {
            // if (response.status === 200) {
            successAlert("Your profile is updated successfully!")
            return response.data;
        }
    } catch (err) {
        console.log("Error updateUserProfile", err)
    }
}

export const postTransaction = async (reqData: any) => {
    // const url = "https://zdqmhxkh1f.execute-api.us-west-2.amazonaws.com/tx";
    const url = BASE_URL + "market/transaction"
    console.log("post transaction", reqData)
    try {
        const request = {
            id: Date.now(),
            data: reqData
        }
        console.log("request", request)
        const response = await axios.post(url, request);
        console.log("post transaction response", response)
        if (response) {
            // if (response.status === 200) {
            // successAlert("Your profile is updated successfully!")
            // return response.data;
        }
    } catch (err) {
        console.log("Error updateUserProfile", err)
    }
}

/**
 * The function `getUserDatabyAddress` is an asynchronous function that takes an address as a parameter
 * and makes a GET request to a specific URL to retrieve user data.
 * @param {string} address - The `address` parameter is a string that represents the address of a user.
 * @returns the data obtained from the API request.
 */
export const getUserDatabyAddress = async (address: string) => {
    const url = BASE_URL + "users/personal-info?address=" + address
    try {
        const response = await axios.get(url);
        if (response) {
            return response.data;
        }

    } catch (error) {
        console.error("Error getUserDatabyAddress", error);
    }
}

/**
 * The function `getUserPoints` retrieves data from an API, filters out items with no points or points
 * equal to zero, and sorts the remaining items in descending order based on their points.
 * @returns The function `getUserPoints` returns a promise that resolves to an array of objects. Each
 * object represents an item and contains a `points` property. The array is sorted in descending order
 * based on the `points` value.
 */
export const getUserPoints = async () => {
    try {
        const url = BASE_URL + "users/all"
        const response = await axios.get(url);
        const data = response.data; // Access the data property of the Axios response

        // rank data by points number
        const rankedData = data
            .filter((item: any) => item.points !== undefined && item.points !== 0) // Filter out elements with no points or points = 0
            .sort((a: any, b: any) => b.points - a.points);

        return rankedData;

    } catch (error) {
        console.error("Error getUserPoints:", error);
    }
}

/**
 * The function `getTotalUserNumber` retrieves data from an API and returns the length of the data
 * array.
 * @returns the length of the data array.
 */
export const getTotalUserNumber = async () => {
    const { data } = await axios.get(BASE_URL + "users/all");
    if (data) {
        return data.length
    }
}

/**
 * The function `getNFTDetailByAsset` is an asynchronous function that retrieves NFT details by making
 * a GET request to a specified URL.
 * @param {string} asset - The `asset` parameter is a string that represents the unit of the NFT
 * (Non-Fungible Token) for which you want to retrieve the details.
 * @returns The function `getNFTDetailByAsset` returns the data obtained from the API call.
 */
export const getNFTDetailByAsset = async (asset: string) => {
    console.log("getNFTDetailByAsset")
    try {
        const url = 'https://fk6vsmvml8.execute-api.eu-west-2.amazonaws.com/default/getNFTinfo?unit=' + asset
        const response = await axios.get(url);
        const data = response.data; // Access the data property of the Axios response
        return data

    } catch (error) {
        console.error("Error getNFTDetailByAsset:", error);
    }
}

export const getNFTNameByAsset = async (asset: string) => {
    console.log("getNFTDetailByAsset")
    try {
        const url = 'https://fk6vsmvml8.execute-api.eu-west-2.amazonaws.com/default/getNFTinfo?unit=' + asset
        const response = await axios.get(url);
        const data = response.data; // Access the data property of the Axios response
        return data.onchain_metadata.name

    } catch (error) {
        console.error("Error getNFTDetailByAsset:", error);
    }
}


export const getNFTImageByAsset = async (asset: string) => {
    console.log("getNFTDetailByAsset")
    try {
        const url = 'https://fk6vsmvml8.execute-api.eu-west-2.amazonaws.com/default/getNFTinfo?unit=' + asset
        const response = await axios.get(url);
        const data = response.data; // Access the data property of the Axios response
        return data.onchain_metadata.image

    } catch (error) {
        console.error("Error getNFTDetailByAsset:", error);
    }
}

export const getMyActivities = async (address: string) => {
    try {
        const url = BASE_URL + "market/my-activities?address=" + address;
        const response = await axios.get(url);
        const data = response.data; // Access the data property of the Axios response
        return data
    } catch (err) {
        console.error("Error getMyActivities:", err);
    }
}
