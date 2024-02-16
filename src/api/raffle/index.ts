import axios from "axios"
import { BASE_URL } from "@/constants/document"


const getActiveRaffles = async () => {
  const url = BASE_URL + "raffle/get-active-raffles"
  const response = await axios.get(url)
  if (response.status === 200) {
    return response.data;
  }
}

const getWinnerRaffles = async () => {
  const url = BASE_URL + "raffle/get-raffle-winners"
  const response = await axios.get(url)
  if (response.status === 200) {
    return response.data;
  }
}

const getRaffleFloorPrice = async (assets: any) => {
  const filteredArray = Object.keys(assets).filter(element => !element.includes("lovelace"));
  console.log("filteredArray", filteredArray);
  const requests = filteredArray.map(async (element) => {
    const url = "https://x2j5ucq6pc.execute-api.us-west-2.amazonaws.com/items/" + element.slice(0, 56);
    console.log("url", url);

    try {
      const response = await axios.get(url);
      // console.log("response", response)
      if (response) {
        return response.data.floorprice ? parseInt(response.data.floorprice) : 0;
      } else {
        return 0;
      }
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
      return 0; // or handle the error based on your requirements
    }
  });



  const results = await Promise.all(requests);
  const sum = results.reduce((acc, value) => acc + value, 0);

  return sum;
};


export {
  getActiveRaffles,
  getWinnerRaffles,
  getRaffleFloorPrice
}