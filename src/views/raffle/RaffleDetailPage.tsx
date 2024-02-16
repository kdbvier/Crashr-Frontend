import axios from 'axios'
import HeaderBanner from '@/components/HeaderBanner'
import RaffleCard from '@/components/card/RaffleCard'
import CustomButton from '@/components/common/CustomButton'
import CustomSearchInput from '@/components/common/CustomSearchInput'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import CreateRaffleModal from '@/components/modal/CreateRaffleModal'
import RaffleDetailModal from '@/components/modal/RaffleDetailModal'
import RaffleSuccessModal from '@/components/modal/RaffleSuccesModal'
import { H1 } from '@/components/typography'
import { COLLECTION_DATA, OPENCNFT_API_KEY, POLICYID_ASSET_LIST } from '@/constants/document'
import { RAFFLE_HEADER_IMAGE } from '@/constants/image.constants'
import { raffleDetailsScript } from '@/constants/script.constants'
import { PUT_RAFFLES_URL } from '@/constants/url.constants'
import { useGlobalContext } from '@/context/GlobalContext'
import { useWalletConnect } from '@/context/WalletConnect'
import { generateRandomString, getExactImageFormat, outputEndTimeRemaining } from '@/hooks/function'
import { Data, toHex } from 'lucid-cardano'
import React, { useEffect, useState } from 'react'
import { Container, PageWrapper } from '@/styles/GlobalStyles'


const restrictedRaffles = [
  "00000000000000000000000100011698685912702",
  "000000000000000000000000000100011698742825243",
  "018ffb14d16f75564c12b0111bd1fc407d1573e1e8061b67b45d497cdc59fbce",
  "c477bcdfefd8e14eee75bb13d6a3f901394ebf2e4f2cb360b7c38cd02ddc09e6",
  "aa855882a8e78d72efbe8c8d0acb30d02992c8c33b5b49a995a113bf69ec8e85"
]

const today = new Date();
const today_10_min_later = new Date(today);
const today_12_hours_later = new Date(today);
const today_48_hours_later = new Date(today);
const today_24_hours_later = new Date(today);
const endTime = new Date(today);
today_10_min_later.setMinutes(today.getMinutes() + 10);
// today_12_hours_later.setMinutes(today.getMinutes() + 15);
today_12_hours_later.setHours(today.getHours() + 12);
today_48_hours_later.setHours(today.getHours() + 48);
today_24_hours_later.setHours(today.getHours() + 24);
endTime.setDate(today.getDate() + 14);


const formInitialValues = {
  title: '',
  description: '',
  currency: '',
  amount: 0,
  price: 1,
  attachedImage: '',
  minTicket: 1,
  maxTicket: 1,
  endDate: today_12_hours_later, //today_24_hours_later
  endTimeRemaining: outputEndTimeRemaining(today_12_hours_later),
  agree1: false,
  agree2: false,
  selectedNFTs: [],
  raffleID: ''
}

const RaffleDetailPage = () => {
  if (typeof window === "undefined") return;
  const _raffle_id = window.location.href.split("/raffle/")[1];
  const [search, setSearch] = useState("")
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
  const [activeShowRaffleData, setActiveShowRaffleData] = useState([])
  const [active, setActive] = useState<number>(1)

  const [formData, setFormData] = useState<RaffleFormDataType>(formInitialValues);
  const [raffleDetailData, setRaffleDetailData] = useState()
  const { myWalletAddress, lucid } = useWalletConnect()

  const { raffleData, floorPriceList, winRaffles, allRaffles, colorMode } = useGlobalContext()

  const isItemInWinRaffles = (item: any, winRaffles: any) => {
    const winRafflesArray = Array.isArray(winRaffles) ? winRaffles : Object.values(winRaffles);
    return winRafflesArray.some(winItem => winItem.uniqueid === item.uniqueid);
  };

  // filter raffle array data according to win raffles, search value
  useEffect(() => {
    if (raffleData && Object.values(raffleData).length > 0 && allRaffles.length > 0 && _raffle_id !== '') {
      let activeFilteredData;
      activeFilteredData = Object.values(raffleData)
        .filter((item: any) => item.uniqueid === _raffle_id);
      if (activeFilteredData.length === 0) {
        activeFilteredData = allRaffles
          .filter((item: any) => item.timestamp < new Date().getTime())
          .filter((item: any) => !isItemInWinRaffles(item, winRaffles))
          .filter((item: any) => item.uniqueid === _raffle_id);
      }

      setActiveShowRaffleData(activeFilteredData);
    }
  }, [raffleData, _raffle_id]);

  // submit creating raffle
  const submit = async () => {
    if (!myWalletAddress) return;
    // @ts-ignore
    if (formData.selectedNFTs.length === 0) {
      return;
    } else {
      // price of raffle
      let amount = Math.floor(formData.price)
      let posix = Math.floor(new Date(formData.endDate).getTime());
      // console.log('posix', posix);
      let exclusiveFlag = 0
      // console.log("myWalletAddress", myWalletAddress)
      // @ts-ignore
      const { paymentCredential, stakeCredential } = lucid.utils.getAddressDetails(
        myWalletAddress
      );
      if (!paymentCredential || !stakeCredential) return;
      // @ts-ignore
      const assetValues: any = formData.selectedNFTs.map(item => item.asset);

      let _floorprice: number = 0;

      const axiosRequests = assetValues.map((assetValue: string) => {
        let _policyID = assetValue.slice(0, 56)
        if (COLLECTION_DATA[_policyID]) {
          return {
            data: {
              "floor_price": COLLECTION_DATA[_policyID].floorprice * 1000000
            }
          };
        } else {
          // console.log("calling api")

          return axios.get(
            "https://api.opencnft.io/2/collection/" + _policyID + "/floor_price",
            {
              headers: {
                'X-Api-Key': OPENCNFT_API_KEY,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Max-Age": "3600",
              }
            }
          );
        }

      });

      try {
        const responses = await Promise.all(axiosRequests);
        // console.log("responses", responses)
        // @ts-ignore
        const totalFloorPrice = responses.reduce((sum, { data }) => sum + data.floor_price, 0);
        _floorprice = totalFloorPrice / 1000000;
        console.log("Average floor price:", _floorprice);
      } catch (err) {
        console.log("Error:", err);
      }

      console.log("_floorPrice", _floorprice)
      console.log("formData.currency", formData.currency)

      const policyId = POLICYID_ASSET_LIST[formData.currency].policyId;
      const asset = POLICYID_ASSET_LIST[formData.currency].asset;
      let decimals = POLICYID_ASSET_LIST[formData.currency].decimals;
      console.log("decimals", decimals)
      if (
        decimals === 6
      ) {
        amount = amount * 1000000;
        // @ts-ignore
        // tokens['lovelace'] = amount;
      } else {
        if (
          decimals === 8
        ) {
          amount = amount * 100000000;
          // @ts-ignore
          // tokens[unit] = amount;
        } else {
          if (decimals === 4) {
            amount = amount * 10000;
            // @ts-ignore
            // tokens[unit] = amount;
          } else {
            if (decimals === 3) {
              amount = amount * 1000;
              // @ts-ignore
              // tokens[unit] = amount;
            } else {
              amount = amount * 1;
              // @ts-ignore
              // tokens[unit] = amount;
            }
          }
        }
      }
      console.log("policyId", policyId)
      let utf8Encode = new TextEncoder()
      // @ts-ignore
      let _raffleId = toHex(utf8Encode.encode(formData.title + "-" + Math.floor(formData.minTicket) + "/" + Math.floor(formData.maxTicket))) + posix;

      console.log("hey", _raffleId, myWalletAddress, posix, formData.maxTicket, formData.minTicket, formData.price)


      console.log("token policy, asset", policyId, asset, amount)
      let datumRaffle = Data.to(
        [
          "",//winner
          "",
          policyId,//ADA byte array vuoto
          asset,//amount
          BigInt(amount), //amount
          toHex(utf8Encode.encode(formData.title + "-" + Math.floor(formData.minTicket) + "/" + Math.floor(formData.maxTicket))),
          // @ts-ignore
          toHex(utf8Encode.encode(getExactImageFormat(formData.selectedNFTs[0].image))),
          toHex(utf8Encode.encode(formData.description)),//hours in ms
          BigInt(posix),
          BigInt(0),//here is always 0. no more drafts
          BigInt(exclusiveFlag),
          paymentCredential.hash,
          stakeCredential.hash
        ]
      );



      // @ts-ignore
      const rafflePrizeAddress = lucid.utils.validatorToAddress(raffleDetailsScript);
      console.log("raffleprizeAddr", rafflePrizeAddress)


      console.log("datumRaffle", datumRaffle)
      let nfts: any = {};
      nfts['lovelace'] = ""
      // @ts-ignore
      for (let i = 0; i < formData.selectedNFTs.length; i++) {
        // @ts-ignore
        nfts[formData.selectedNFTs[i].asset] = 1;
      }
      console.log("nfts", nfts)
      // const what = {
      //   // @ts-ignore
      //   utxo: 'txHash',
      //   image: getExactImageFormat(formData.selectedNFTs[0].image),
      //   mintickets: formData.minTicket,
      //   maxtickets: formData.maxTicket,
      //   price: formData.price * Math.pow(10, decimals),
      //   desc: formData.description,
      //   name: formData.title,
      //   assets: nfts,
      //   nfts: formData.selectedNFTs,
      //   uniqueid: _raffleId,   /// unique id
      //   timestamp: posix,
      //   floorprice: _floorprice,
      //   status: "active",
      //   tokenName: formData.currency,
      //   created_at: new Date().getTime(),
      //   tickets: 0,
      //   creator: myWalletAddress,
      //   handled: false,
      //   policyAsset: policyId + asset,
      //   entries: []
      // }
      // console.log("what", what)

      try {
        // @ts-ignore
        const tx = await lucid
          .newTx()
          // @ts-ignore
          .payToContract(rafflePrizeAddress, { inline: datumRaffle }, nfts)
          .complete();
        console.log("tx", tx)
        // @ts-ignore
        const signedTx = await tx.sign().complete();
        console.log("signedTx", signedTx)

        // @ts-ignore
        const txHash = await signedTx.submit();
        console.log("txHash", txHash)
        // toast(txHash);
        if (txHash) {

          // current_waiting[uuid].txAddr = txHash;
          // setTxWaitingList(current_waiting);
          // localStorage.setItem("crashr_tarnsaction_list", JSON.stringify(current_waiting))
          const reqqqq = {
            // @ts-ignore
            utxo: txHash,
            // @ts-ignore
            image: getExactImageFormat(formData.selectedNFTs[0].image),
            mintickets: formData.minTicket,
            maxtickets: formData.maxTicket,
            price: formData.price * Math.pow(10, decimals),
            desc: formData.description,
            name: formData.title,
            assets: nfts,
            nfts: formData.selectedNFTs,
            uniqueid: _raffleId,   /// unique id
            timestamp: posix,
            floorprice: _floorprice,
            // status: "active",
            tokenName: formData.currency,
            created_at: new Date().getTime(),
            tickets: 0,
            creator: myWalletAddress,
            handled: false,
            policyAsset: policyId + asset,
            entries: []
          }
          const response = await axios.post(PUT_RAFFLES_URL, JSON.stringify(reqqqq));
          // @ts-ignore
          if (response.status === 200) {
            console.log("success");
            if (formData.currency === "ADA") {
              try {
                const response2 = await axios.post("https://sobxamwtp2.execute-api.us-west-2.amazonaws.com/test", JSON.stringify({
                  uniqueid: _raffleId,
                  creator: myWalletAddress,
                  endtime: posix,
                  handled: false,
                  maxTicket: formData.maxTicket,
                  minTicket: formData.minTicket,
                  price: formData.price,
                  totalTicket: 0,
                }));
                console.log("respond2", response2)
              } catch (err) {
                console.log("err", err)
              }
            }

            setFormData(formInitialValues);

            setShowCreateModal(false)
            setShowSuccessModal(true)
          }
          console.log("formData.currency", formData.currency);



        } else {
          // delete current_waiting[uuid];
          // setTxWaitingList(current_waiting);
        }
        console.log('txHash', txHash);

      } catch (err) {
        console.log("err", err)
      }

    }
  };

  return (
    <PageWrapper colorMode={colorMode}>
      <HeaderBanner
        image={RAFFLE_HEADER_IMAGE}
      />
      <Container paddingTop='12px' smMarginTop='-30px'>
        <FlexBox marginTop='28px' flexWrap='wrap' gap='50px 90px' smGap='14px 29px' smJustifyContent='center' smAlignItems='center' smDirection='row'>
          {activeShowRaffleData &&
            activeShowRaffleData.length > 0 && Object.values(winRaffles).length > 0 && floorPriceList && activeShowRaffleData.map((item: any, index: number) => {
              let txAddr = item.tx;
              if (!restrictedRaffles.includes(txAddr)) {
                return (
                  <RaffleCard
                    key={index}
                    item={item}
                    onClick={() => {
                      console.log("what ar you?", raffleData[txAddr])
                      setRaffleDetailData(item);
                      setShowDetailModal(true);
                    }}
                    floorPrice={item.floorprice}
                    winRaffles={winRaffles}
                    active={active}
                  />
                );
              }

              return null;
            })}
        </FlexBox>
      </Container>
      {
        showSuccessModal &&
        <RaffleSuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          raffleID={formData.raffleID}
          message={`We have received your submission.`}
        />
      }

      {
        showCreateModal &&
        <CreateRaffleModal
          show={showCreateModal}
          onClose={() => { setShowCreateModal(false) }}
          formData={formData}
          setFormData={setFormData}
          submit={submit}
        />
      }
      {
        showDetailModal && raffleDetailData &&
        <RaffleDetailModal
          show={showDetailModal}
          onClose={() => { setShowDetailModal(false) }}
          raffleDetailData={raffleDetailData}
        />
      }
    </PageWrapper>
  )
}

export default RaffleDetailPage