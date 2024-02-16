import axios from "axios";
import { BASE_URL } from "@/constants/document";

/**
 * The function `getMyNFTListing` retrieves a list of NFTs listed by a specific address from an API and
 * filters the data to only include NFTs listed by that address.
 * @param {string} address - The `address` parameter is a string that represents the address of a user.
 * It is used to filter the NFT listings and retrieve only the listings where the seller's address
 * matches the provided address.
 * @returns The function `getMyNFTListing` returns a filtered object of `ListedNFTList` where the
 * `seller` property matches the provided `address`.
 */
export const getMyNFTListing = async (address: string) => {
  try {
    const url = BASE_URL + "market/my-listing?address=" + address;
    console.log("url", url)
    const response = await axios.get(url);
    console.log("hey hey res", response)
    const data: ListedNFTList = response.data;
    return data;
  } catch (error) {
    console.error("Error getMyNFTListing:", error);
  }
}

/**
 * The function `getAllListing` makes an API call to retrieve a list of listed NFTs and returns the
 * data.
 * @returns The function `getAllListing` is returning a promise that resolves to a `ListedNFTList`
 * object.
 */
export const getAllListing = async () => {
  try {
    const url = BASE_URL + "market/all-listing?policy=all";
    const response = await axios.get<ListedNFTList>(url);
    const data: ListedNFTList = response.data;
    return data;
  } catch (error) {
    console.error("Error getMyNFTListing:", error);
  }
}

export const getListedNFTsByPolicy = async (policyID: string) => {
  try {
    const url = BASE_URL + "market/all-listing?policy=" + policyID;
    const response = await axios.get<ListedNFTList>(url);
    const data: ListedNFTList = response.data;
    return data;
  } catch (error) {
    console.error("Error getMyNFTListing:", error);
  }
}
