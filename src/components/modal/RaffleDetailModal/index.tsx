import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import axios from 'axios';
import { Constr, Data } from 'lucid-cardano';
import { generateRandomString, getExactImageFormat, getExactTokenAmount, handleExceptionTokenName, outputEndTimeByTimestamp } from '@/hooks/function';
import CustomImage from '@/components/common/CustomImage';
import { LINK_ICON, MINUS_ICON, PLUS_ICON, SLICK_LEFT_ICON, SLICK_RIGHT_ICON, VERIFIED_ICON_IMAGE } from '@/constants/image.constants';
import { device } from '@/styles/Breakpoints';
import { FlexBox } from '@/components/common/FlexBox';
import CustomText from '@/components/common/CustomText';
import CustomButton from '@/components/common/CustomButton';
import { COLLECTION_DATA, OPENCNFT_API_KEY, TOKEN_ARRAY } from '@/constants/document';
import { useWalletConnect } from '@/context/WalletConnect';
import { raffleDetailsScript } from '@/constants/script.constants';
import { useGlobalContext } from '@/context/GlobalContext';
import { CommonText, RaffleStatGroup, RaffleStatSubject, RaffleStatValue, RaffleStats, RemainingTime, ShareNow, TicketControl, TicketEntriesNumber, TicketEntriesTable, TicketEntriesTableRow, TicketQuantity, TicketTableAddress, TotalPriceValue } from './index.styled';
import RaffleSuccessModal from '../RaffleSuccesModal';
import CopyBoard from '@/components/CopyBoard';
import RaffleDetailModal_MobileScreen from './RaffleDetailModal_MobileScreen';
import { useMedia } from 'react-use';
import CustomTextLink from '@/components/common/CustomTextLink';
import { COLORS } from '@/constants/colors.constants';
import { getRaffleFloorPrice } from '@/api/raffle';
import CopyToClipboard from 'react-copy-to-clipboard';
import { successAlert } from '@/hooks/alert';

interface IStyledModalProps {
  colorMode?: string;
}

const StyledModal = styled(Modal) <IStyledModalProps>`
  box-shadow: 0px 5px 50px 9px #242424;
  .modal-dialog{
    margin: auto;
    max-width: 1351px;
    width: 100%;
    
    background: transparent;
    border-radius: 16px;
    
    @media screen and (max-width: 550px) {
      max-width: 100%;
      min-height: 100vh;
    }
  }
  .modal-header{
    border-bottom: none;
    align-items: start;
    &.btn-close{
        font-size: 40px !important;
    }
  }
  .raffle-detail-modal {
    background: ${props => props.colorMode === 'light' ? '#e7e7e7' : '#272727'};
    border-radius: 3px;
    width: 100%;
    overflow: hidden;
    border: none;
    
    @media screen and (max-width: 550px) {
      min-height: 100vh;
    }
  }
`;

const ModalBody = styled(Modal.Body)`
  padding: 18px 96px 120px 96px; 
  @media ${device.sm} {
    padding: 18px 31px 54px 31px; 
  }
  &.modal-body{
  }
  .main-nft{
    width: 515px;
    height: 515px;
    border-radius: 3px;
    @media ${device.sm} {
      width: 160px;
      height: 160px;
    }
  }
  .small-images{
    display: flex;
    gap: 10px;
    padding: 12px;
    flex-direction: row;
    align-items: center;
    img{
      width: 73px;
      height: 73px;
      border-radius: 10px;
        &.active{
          width: 90px;
          height: 90px;
        }
    }
    @media ${device.sm} {
      img{
        width: 35px;
        height: 35px;
        &.active{
          width: 45px;
          height: 45px;
        }
      }
    }
  }
`

interface Props {
  show: boolean;
  onClose: () => void;
  formData?: any;
  setFormData?: any;
  raffleDetailData?: any;
}

const today = new Date();
const today_10_min_later = new Date(today);
const today_12_hours_later = new Date(today);
const today_48_hours_later = new Date(today);
const today_24_hours_later = new Date(today);
const endTime = new Date(today);
// today_10_min_later.setMinutes(today.getMinutes() + 10);
today_12_hours_later.setMinutes(today.getMinutes() + 15);
// today_12_hours_later.setHours(today.getHours() + 12);
today_48_hours_later.setHours(today.getHours() + 48);
today_24_hours_later.setHours(today.getHours() + 24);
endTime.setDate(today.getDate() + 14);


interface TicketEntriesType {
  address: string;
  quantity: number;
}


const RaffleDetailModal = ({ show, onClose, formData, raffleDetailData }: Props) => {
  console.log("raffleDetailData", raffleDetailData)
  const [activeNFT, setActiveNFT] = useState(0);
  const [captcha, setCaptcha] = useState('');
  const [captchavalue, setCaptchavalue] = useState('');
  const [showRaffleWarningModal, setShowRaffleWarningModal] = useState(false)
  const [imageNFTs, setImageNFTs] = useState<any[]>([])
  const [status, setStatus] = useState<string>() // if raffle is active, ended, etc
  const [ticketEntries, setTicketEntries] = useState<TicketEntriesType[] | []>();
  const [totalTicket, setTotalTicket] = useState<number>();
  const [ticketQuantity, setTicketQuantity] = useState<number>(1)
  const [thisFloorPrice, setThisFloorPrice] = useState<number>()
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [copied, setCopied] = useState(false);
  const isMobile = useMedia('(max-width: 768px)');

  const [loading, setLoading] = useState(true)

  const { myRaffleEntries, floorPriceList, setMyRaffleEntries, colorMode } = useGlobalContext()

  const { lucid, myWalletAddress } = useWalletConnect()

  useEffect(() => {
    console.log("copied", copied)
    if (copied) {
      successAlert("Raffle Share URL is Copied")
    }
  }, [copied])

  const handleCaptcha = (param: string) => {
    setCaptcha(param);
    handleParam(param);
  };

  /**
   * The function `handleParam` takes a string parameter `param`, sets the state variable `captchavalue`
   * to the value of `param`, and if `param` is not empty, sets `captchavalue` to the value of `param`
   * again.
   * @param {string} param - The parameter `param` is of type `string`.
   */
  const handleParam = (param: string) => {
    //console.log('param', param);
    setCaptchavalue(param);
    if (param !== '') {
      //console.log('empty');
      setCaptchavalue(param);

    }
  };

  /**
   * The function `getRaffleImages` retrieves information about raffle images from an API and stores them
   * in an array.
   */
  const getRaffleImages = async () => {
    if (raffleDetailData.assets) {
      let assets = Object.keys(raffleDetailData.assets);
      // assets.shift();
      let arr: any[] = [];
      let warningModalShown = false;
      console.log("assets", assets)
      await Promise.all(
        assets.map(async (asset) => {
          if (asset === "lovelace") {
            // Skip the try-catch block and move to the next asset
            return;
          }
          try {
            const { data } = await axios.get(
              "https://fk6vsmvml8.execute-api.eu-west-2.amazonaws.com/default/getNFTinfo?unit=" + asset
            );
            if (data) {
              let collection = "";
              const verified = Object.keys(COLLECTION_DATA).includes(data.policy_id);
              if (verified) {
                collection = COLLECTION_DATA[data.policy_id].name;
              } else {
                if (warningModalShown === false) {
                  setShowRaffleWarningModal(true);
                  warningModalShown = true; // Set the flag to true indicating the modal has been shown
                }
                const isToken = Object.keys(TOKEN_ARRAY).includes(data.asset);
                if (isToken) {
                  return; // Skip this asset and continue to the next iteration
                } else {
                  collection = data.policy_id;
                }
              }

              arr.push({
                image: data.onchain_metadata?.image ? data.onchain_metadata?.image : "https://asdtf",
                collection: collection,
                policyId: data.policy_id,
                nftName: data.onchain_metadata?.name ? data.onchain_metadata?.name : 'Anonymous',
                asset: data.asset,
                verified: verified
              });
            }

            // }
          } catch (err) {
            console.log("err", err);
          }
        })
      );

      // console.log("arr", arr);
      setImageNFTs([...arr]);
    } else {
      setImageNFTs(raffleDetailData.nfts.map((item: any) => item.image))
    }




  };

  /**
   * The function `sumObjectsByKey` takes in multiple objects and returns a new object that sums the
   * values of common keys in the input objects.
   * @param objs - The `objs` parameter is a rest parameter that allows you to pass in multiple objects
   * as arguments to the function. These objects will be used to calculate the sum of their values for
   * each key.
   * @returns The function `sumObjectsByKey` returns an object that contains the sum of the values for
   * each key across all the input objects.
   */
  function sumObjectsByKey(...objs: any) {
    return objs.reduce((a: any, b: any) => {
      for (let k in b) {
        if (b.hasOwnProperty(k))
          // @ts-ignore
          a[k] = (a[k] || 0n) + b[k];
      }
      return a;
    }, {});
  }

  /**
   * The function `getTotalTicket` retrieves the total number of tickets and their corresponding
   * addresses for a raffle, based on the raffle details and transaction address.
   * @param {any} raffleDetailData - The `raffleDetailData` parameter is an object that contains
   * information about a raffle. It may have the following properties:
   * @param [retryCount=3] - The `retryCount` parameter is an optional parameter that specifies the
   * number of times the function should retry the API call in case of a failure. It is set to a default
   * value of 3, but you can override it with a different value if needed.
   * @returns The function does not have a return statement.
   */
  const getTotalTicket = async (raffleDetailData: any, retryCount = 3): Promise<void> => {
    console.log("status", parseInt(raffleDetailData.timestamp), new Date().getTime())

    if (raffleDetailData.timestamp > new Date().getTime()) {
      console.log("live")
      setStatus("live")
    } else {
      console.log("raffleDetailData.winner", raffleDetailData.winner)
      if (raffleDetailData.winner) {
        if (raffleDetailData.winner.includes("addr")) {
          setStatus("ended")
          console.log("ended")
        } else {
          setStatus("processing")
          console.log("processing")
        }
      } else {
        console.log("refund")
        if ((parseInt(raffleDetailData.timestamp) < new Date().getTime()) && (parseInt(raffleDetailData.timestamp) + 60 * 5 * 1000) > new Date().getTime()) {
          setStatus("processing")
        } else {
          setStatus("refund")
        }
      }
    }

    let txAddr = raffleDetailData.utxo ? raffleDetailData.utxo : raffleDetailData.tx;

    try {
      const { data } = await axios.get(`https://qdo04av455.execute-api.eu-west-2.amazonaws.com/default/getAddressEntries?tx=${txAddr}`);

      let unit: string = raffleDetailData.unit === "" ? 'lovelace' : raffleDetailData.unit;
      let price: number = raffleDetailData.price;

      let sum: number = 0;
      const addressList: any[] = [];

      data.forEach((item: any) => {
        const address = Object.keys(item)[0];
        const quantities = item[address];

        quantities.forEach((quantityItem: any) => {
          if (quantityItem.unit === unit) {
            sum += parseInt(quantityItem.quantity);
          }
        });

        addressList.push({
          address,
          quantity: Math.floor(quantities.find((item: any) => item.unit === unit).quantity / price)
        });
      });

      const actualLockedAmount = Math.floor(sum / price);
      setLoading(false)
      setTicketEntries(addressList)
      setTotalTicket(actualLockedAmount);
    } catch (error: any) {
      if (retryCount > 0 && (error.response?.status === 503 || error.response?.status === 500)) {
        console.log('Retrying...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return getTotalTicket(raffleDetailData, retryCount - 1);
      } else {
        console.log('Unable to fetchLockedAmount:', error);
        throw error;
      }
    }
  };

  /**
   * The `buyTicket` function is an asynchronous function that handles the process of buying tickets for
   * a raffle.
   */
  const buyTicket = async () => {
    if (!lucid) return;
    // @ts-ignore
    const rafflePrizeAddress = await lucid.utils.validatorToAddress(raffleDetailsScript);
    console.log("rafflePrizeAddress", rafflePrizeAddress)
    let RedeemCounter = Data.to(new Constr(4, []));

    // console.log("Data unit", raffleDetailData.unit)
    let cost: any = {}
    if (raffleDetailData.policyToken === "") {
      cost["lovelace"] = BigInt(parseInt(raffleDetailData.price) * ticketQuantity);
      //cost["lovelace"] = 0;
    } else {
      cost[raffleDetailData.unit] = BigInt(parseInt(raffleDetailData.price) * ticketQuantity);
      //cost[data.unit] = 0;
    }

    // updateStorageRaffleEntered(raffleDetailData, ticketQuantity)

    let utxo = await lucid.utxosByOutRef([{ txHash: raffleDetailData.utxo, outputIndex: raffleDetailData.index }])
    let txValue = utxo[0]
    console.log("utxo", utxo)
    console.log("txValue", txValue)
    //add cost to assets
    // @ts-ignore
    let pool = sumObjectsByKey(cost, txValue.assets)
    console.log("pool", pool);
    console.log("cost", cost)
    console.log("RedeemCounter", RedeemCounter)
    console.log("rafflePrizeAddress", rafflePrizeAddress)
    console.log("raffleDetailsScript", raffleDetailsScript)

    try {
      const tx = await lucid
        .newTx()
        // @ts-ignore
        .collectFrom([txValue], RedeemCounter)
        // @ts-ignore
        .attachSpendingValidator(raffleDetailsScript)
        // @ts-ignore
        .payToContract(rafflePrizeAddress, { inline: txValue.datum }, pool)
        .validFrom((Date.now() - 300000))
        .validTo((Date.now() + 300000))
        .complete();

      const signedTx = await tx.sign().complete();
      console.log("signedTx", signedTx)

      let current_time = Date.now();
      let uuid = current_time;
      // let current_waiting = { ...txWaitingList };
      // current_waiting[uuid] = {
      //   success: false,
      //   actionTime: Date.now(),
      //   actionTitle: 'Buy ' + ticketQuantity + " Ticket for " + raffleDetailData.name,
      //   txAddr: '',
      // };
      // setTxWaitingList(current_waiting)
      // setShowWaitingList(true);


      const txHash = await signedTx.submit();
      console.log("txHash", txHash)
      if (txHash) {


        let current_raffle_entered = myRaffleEntries;
        let newObj = {
          utxo: raffleDetailData.utxo,
          name: raffleDetailData.name,
          token: raffleDetailData.tokenName,
          total: ticketQuantity,
          price: raffleDetailData.price,
          expired: raffleDetailData.timestamp,
          message: 'Buy ' + ticketQuantity + " Ticket for " + raffleDetailData.name,
          time: Date.now(),
          success: true,
          txAddr: txHash,
          uniqueid: raffleDetailData?.uniqueid,
          processed: false,
        }

        // current_waiting[uuid].txAddr = txHash;
        // console.log("current_waiting", current_waiting[uuid])

        current_raffle_entered[current_time] = newObj;

        const response = await axios.post("https://oiv43opb2m.execute-api.us-west-2.amazonaws.com/test", JSON.stringify({
          id: myWalletAddress,
          transactions: JSON.stringify(current_raffle_entered)
        }));
        console.log("response", response)
        if (response.status === 200) {
          console.log("success");
          setShowSuccessModal(true)
        }

        setMyRaffleEntries(current_raffle_entered)
        // setTxWaitingList(current_waiting);
        // localStorage.setItem("crashr_tarnsaction_list", JSON.stringify(current_waiting))


        // updateStorageRaffleEntered(raffleDetailData, ticketQuantity)
      } else {
        // delete current_waiting[uuid];
        // setTxWaitingList(current_waiting);
      }
      console.log(txHash)
    } catch (err) {
      console.log("err", err)
    }
  }



  /**
   * The function increments the ticket quantity if it is greater than 0 and less than the difference
   * between the maximum tickets and the total tickets.
   */
  function increment() {
    // console.log("parseInt(raffleDetailData.maxtickets) - totalTicket", parseInt(raffleDetailData.maxtickets) - totalTicket)

    if (totalTicket && ticketQuantity > 0 && (ticketQuantity < (parseInt(raffleDetailData.maxtickets) - totalTicket))) {
      setTicketQuantity(ticketQuantity => ticketQuantity + 1);
    }
  }

  /**
   * The function decrements the ticket quantity by 1 if it is greater than 1.
   */
  function decrement() {
    if (ticketQuantity > 1) {
      setTicketQuantity(ticketQuantity => ticketQuantity - 1);
    }
  }

  /**
   * The function `getFloorPrice` makes an asynchronous request to retrieve the floor price of a
   * collection and then sends a POST request with the floor price and other data.
   */
  const getFloorPrice = async () => {
    const sum = await getRaffleFloorPrice(raffleDetailData.assets);
    setThisFloorPrice(sum)
  };

  // const cancelRaffle = async () => {
  //   const { paymentCredential } = lucid.utils.getAddressDetails(
  //     myWalletAddress
  //   );
  //   let redeemCancel = Data.to(new Constr(0, []));
  //   let utxo = await lucid.utxosByOutRef([{ txHash: raffleDetailData.utxo, outputIndex: raffleDetailData.index }])
  //   console.log("payment credential", paymentCredential.hash)
  //   console.log("raffle utxo", raffleDetailData.utxo)
  //   console.log("utxo", utxo)
  //   try {
  //     const tx = await lucid
  //       .newTx()
  //       // @ts-ignore
  //       .collectFrom([utxo[0]], redeemCancel)
  //       // @ts-ignore
  //       .attachSpendingValidator(raffleDetailsScript)
  //       .addSignerKey(paymentCredential.hash)
  //       .validFrom((Date.now() - 1000000))
  //       .validTo((Date.now() + 1000000))
  //       .complete();//qua andrà il datum allora
  //     const signedTx = await tx.sign().complete();


  //     let uuid = generateRandomString();
  //     // let current_waiting = { ...txWaitingList }; // Use spread operator or Object.assign() to create a new object
  //     // current_waiting[uuid] = {
  //     //   success: false,
  //     //   actionTime: Date.now(),
  //     //   actionTitle: "Cancel Raffle",
  //     //   txAddr: "",
  //     // };
  //     // setTxWaitingList(current_waiting)
  //     // setShowWaitingList(true)

  //     const txHash = await signedTx.submit();
  //     if (txHash) {
  //       // current_waiting[uuid].success = true;
  //       // current_waiting[uuid].txAddr = txHash;
  //       // setTxWaitingList({ ...current_waiting });
  //       // setShowWaitingList(true);
  //       // localStorage.setItem("crashr_tarnsaction_list", JSON.stringify(current_waiting))
  //       // setShowCancelSuccessModal(true)
  //     }
  //     console.log(txHash)
  //   } catch (err) {
  //     console.log("err", err)
  //   }
  // }


  useEffect(() => {
    const fetchData = async () => {
      const [raffleImages, totalTicketData, floorPriceData] = await Promise.all([
        getRaffleImages(),
        getTotalTicket(raffleDetailData),
        floorPriceList[raffleDetailData.uniqueid ? raffleDetailData.uniqueid : raffleDetailData.tx] ||
        getFloorPrice()
      ]);

      // Process the fetched data or update state as needed
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (raffleDetailData && raffleDetailData.assets) {
      getFloorPrice()
    }
  }, [raffleDetailData])

  return (
    <StyledModal show={show} onHide={onClose} centered contentClassName="raffle-detail-modal" colorMode={colorMode}>
      <Modal.Header closeButton>
      </Modal.Header>
      {

        <ModalBody>
          {
            <FlexBox alignItems='center' maxWidth='1159px' justifyContent='space-between' smWidth='100%'
              smJustifyContent='start' smAlignItems='start'
            >
              {
                !isMobile ?
                  <>
                    {/** image slicker*/}
                    <FlexBox maxWidth='584px' direction='column'>
                      <FlexBox alignItems='center' gap='25px' smDirection='row'>
                        <CustomImage
                          image={SLICK_LEFT_ICON}
                          width='18.6px'
                          height='37.8px'
                          smWidth='10px'
                          smHeight='18.6px'
                          cursor='pointer'
                          onClick={() => {
                            if (activeNFT !== 0)
                              setActiveNFT(activeNFT => activeNFT - 1)
                          }}
                        />
                        <LazyLoadImage
                          src={
                            imageNFTs && imageNFTs.length > 0 &&
                            getExactImageFormat(imageNFTs[activeNFT].image)
                          }
                          className="main-nft"
                        />
                        <CustomImage
                          image={SLICK_RIGHT_ICON}
                          width='18.6px'
                          height='37.8px'
                          smWidth='10px'
                          smHeight='18.6px'
                          cursor='pointer'
                          onClick={() => {
                            if (activeNFT < imageNFTs.length - 1) setActiveNFT(activeNFT => activeNFT + 1)
                          }}
                        />
                      </FlexBox>
                      <FlexBox
                        direction='column'
                        padding='12px 36px' bgColor={colorMode === 'light' ? 'white' : '#414040'} borderRadius='3px' maxWidth='513px' className='mx-auto'>
                        {
                          imageNFTs && imageNFTs.length > 0 &&
                          <CustomText
                            text={imageNFTs[activeNFT].nftName}
                            fontSize='38px'
                            fontWeight='700'
                            display='block'
                            className='three-dots'
                          />
                        }

                        {
                          imageNFTs && imageNFTs.length > 0 &&
                          <FlexBox justifyContent='start' gap="10px" marginTop='4px'>

                            <CustomText
                              text={imageNFTs[activeNFT].collection}
                              fontSize='16px'
                              fontFamily='Open Sans'
                              fontWeight='400'
                              color='#f73737'
                              maxWidth='450px'
                              display='block'
                              className='three-dots'
                            />
                            {
                              imageNFTs[activeNFT].verified &&
                              <CustomImage
                                image={VERIFIED_ICON_IMAGE}
                                width='22px'
                                height="21px"
                              />
                            }
                          </FlexBox>
                        }
                        {
                          thisFloorPrice &&
                          <CustomText
                            text={`₳${thisFloorPrice && thisFloorPrice} `}
                            fontSize='28px'
                            fontWeight='700'
                            marginTop='16px'
                          />
                        }
                        {
                          imageNFTs && imageNFTs.length > 0 && <FlexBox smDirection='row' marginTop='13px' justifyContent='start' alignItems='center'>
                            <CustomText
                              text={`Policy ID:`}
                              fontWeight='600'
                              fontFamily='Open Sans'
                              fontSize='16px'
                              className='no-wrap'
                            />
                            <CopyBoard
                              addr={imageNFTs[activeNFT].policyId}
                              maxWidth='100px'
                            />
                            <CustomText
                              text={`Asset ID:`}
                              fontWeight='600'
                              fontFamily='Open Sans'
                              fontSize='16px'
                            />
                            <CopyBoard
                              addr={imageNFTs[activeNFT].asset}
                              maxWidth='100px'
                            />
                          </FlexBox>
                        }
                      </FlexBox>
                    </FlexBox>
                    {/********  right part */}
                    <FlexBox direction='column' maxWidth='505px'>
                      {/** title, description, created by */}
                      <FlexBox direction='column'>
                        <CustomText
                          text={raffleDetailData && raffleDetailData.name && raffleDetailData.name}
                          fontSize='50px'
                          smFontSize='21px'
                          fontWeight='700'
                          letterSpacing='-0.14px'
                          marginBottom='22px'
                        />
                        <FlexBox direction='column' marginBottom='10px'>

                          <FlexBox smDirection='row' justifyContent='start'>
                            <CustomText
                              text={`Created by:&nbsp;`}
                              fontSize='21px'
                              fontWeight='400'
                              smFontSize='12px'
                              display='block'
                            />
                            <CustomText
                              text={`${raffleDetailData && raffleDetailData.creator}`}
                              fontSize='21px'
                              fontWeight='400'
                              smFontSize='12px'
                              display='block'
                              maxWidth='278px'
                            />
                          </FlexBox>
                          <RemainingTime
                            className={status !== 'live' ? 'Ended' : ''}
                          >
                            {
                              status === 'live'
                                ?
                                `Ends: ${raffleDetailData && outputEndTimeByTimestamp(raffleDetailData.timestamp)}`
                                :
                                'Ended'
                            }
                          </RemainingTime>
                          <FlexBox smDirection='row' justifyContent='start'
                            gap="10px" alignItems='center'>

                            <ShareNow>
                              Share Now
                            </ShareNow>
                            {
                              window && raffleDetailData && raffleDetailData.uniqueid &&
                              <CopyToClipboard text={window.location.href + "/" + raffleDetailData.uniqueid || ''} onCopy={() => setCopied(true)}>
                                <CustomImage
                                  image={LINK_ICON}
                                  width='15.96px'
                                  height='15.95px'
                                  cursor='pointer'
                                />
                              </CopyToClipboard>
                            }


                          </FlexBox>
                        </FlexBox>
                        <CustomText
                          text={raffleDetailData?.desc && raffleDetailData.desc}
                          fontWeight='400'
                          fontSize='14px'
                          maxWidth='462px'
                          smFontSize='12px'
                          fontFamily='Open Sans'
                          marginBottom='12px'
                        />
                        {
                          status !== 'refund' &&
                          <FlexBox justifyContent='end' marginBottom='13px'>
                            <CustomText
                              text={`Total Entries: ${raffleDetailData && raffleDetailData.tickets}`}
                              color={
                                status === 'live' ? '#1b78af' : '#767676'
                              }
                              fontSize='16px'
                              fontFamily='Open Sans'
                              fontWeight='700'
                            />
                          </FlexBox>
                        }
                        {
                          status === 'live' &&
                          <TicketEntriesTable>
                            {
                              ticketEntries && ticketEntries.length > 0 &&
                              ticketEntries && ticketEntries.map((item, j) => {
                                return (
                                  <TicketEntriesTableRow color={colorMode === "light" ? 'black' : '#e7e7e7'}>
                                    <TicketTableAddress>
                                      {item.address}
                                    </TicketTableAddress>
                                    <TicketEntriesNumber>
                                      {
                                        item.quantity + " Tickets"
                                      }
                                    </TicketEntriesNumber>
                                  </TicketEntriesTableRow>
                                )
                              })
                            }
                          </TicketEntriesTable>
                        }
                        {
                          status === 'refund' &&
                          <FlexBox borderRadius='3px' direction='column'>
                            <FlexBox maxWidth='505px' height='50px'
                              borderRadius='3px 3px 0 0' bgColor='#1878af'
                              alignItems='center'
                            >
                              <CustomText
                                text={`All Users Refunded`}
                                color='#f3f3f3'
                                fontSize='28px'
                                fontWeight='700'
                                letterSpacing='-0.14px'
                              />
                            </FlexBox>
                            <FlexBox height='155px' padding='9px 13px' bgColor='white' borderRadius='0px 0px 3px 3px' alignItems='center'>
                              <CustomText
                                text={`Due to the criteria of minimum tickets not being reached by end date, all users have been refunded.`}
                                color='black'
                                fontSize='18px'
                                fontWeight='400'
                                smFontWeight='Open Sans'
                                textAlign='center'
                                letterSpacing='-0.5px'
                              />
                            </FlexBox>
                          </FlexBox>
                        }
                        {
                          status === 'processing' &&
                          <FlexBox borderRadius='3px' direction='column'>
                            <FlexBox maxWidth='505px' height='50px'
                              borderRadius='3px 3px 0 0' bgColor='#1878af'
                              alignItems='center'
                            >
                              <CustomText
                                text={`
                                Processing
                                `}
                                color='#f3f3f3'
                                fontSize='28px'
                                fontWeight='700'
                                letterSpacing='-0.14px'
                              />
                            </FlexBox>
                            <FlexBox height='155px' padding='9px 13px' bgColor='white' borderRadius='0px 0px 3px 3px' alignItems='center'>
                              <CustomText
                                text={`Processing Winner`}
                                color='black'
                                fontSize='18px'
                                fontWeight='400'
                                smFontWeight='Open Sans'
                                textAlign='center'
                                letterSpacing='-0.5px'
                              />
                            </FlexBox>
                          </FlexBox>
                        }

                        {
                          status === 'ended' &&
                          <FlexBox borderRadius='3px' direction='column'>
                            {
                              raffleDetailData && raffleDetailData.winner === myWalletAddress
                                ?
                                <FlexBox maxWidth='505px' height='50px'
                                  borderRadius='3px 3px 0 0' bgColor='#1878af'
                                  alignItems='center'
                                >
                                  <CustomText
                                    text={`Raffle Winner`}
                                    color='#f3f3f3'
                                    fontSize='28px'
                                    fontWeight='700'
                                    letterSpacing='-0.14px'
                                  />
                                </FlexBox>
                                :
                                <FlexBox maxWidth='505px' height='50px'
                                  borderRadius='3px 3px 0 0' bgColor='#fe6126'
                                  alignItems='center'
                                >
                                  <CustomText
                                    text={`Sorry! You lost!`}
                                    color='#f3f3f3'
                                    fontSize='28px'
                                    fontWeight='700'
                                    letterSpacing='-0.14px'
                                  />
                                </FlexBox>
                            }

                            <FlexBox height='155px' padding='9px 13px' bgColor='white' borderRadius='0px 0px 3px 3px' alignItems='center' direction='column' >
                              <CustomText
                                text={`Winner Address`}
                                color='black'
                                fontSize='12px'
                                fontWeight='700'
                                smFontWeight='Open Sans'
                                textAlign='center'

                              />

                              <CustomTextLink
                                link={`/users/${raffleDetailData && raffleDetailData.winner}`}
                                text={raffleDetailData && raffleDetailData.winner}
                                color='#6073a6'
                                fontSize='14px'
                                fontWeight='600'
                                smFontWeight='Open Sans'
                                textAlign='center'
                                display='block'
                                maxWidth='479px'
                                marginBottom='18px'
                                className='three-dots'
                              />

                              <CustomText
                                text={`TX ID: `}
                                color='black'
                                fontSize='12px'
                                fontWeight='700'
                                smFontWeight='Open Sans'
                                textAlign='center'
                              />
                              <CustomTextLink
                                link={`https://cardanoscan.io/transaction/${raffleDetailData && raffleDetailData.utxo ? raffleDetailData.utxo : raffleDetailData.tx}`}
                                text={raffleDetailData && raffleDetailData.utxo ? raffleDetailData.utxo : raffleDetailData.tx}
                                color='#6073a6'
                                fontSize='14px'
                                fontWeight='600'
                                smFontWeight='Open Sans'
                                textAlign='center'
                                display='block'
                                maxWidth='479px'
                                className='three-dots'
                              />
                            </FlexBox>
                          </FlexBox>
                        }

                        <RaffleStats color={COLORS[colorMode].mainTextColor}>
                          <RaffleStatGroup isBorder={true}>
                            <RaffleStatSubject>
                              Total Assets
                            </RaffleStatSubject>
                            <RaffleStatValue>
                              {raffleDetailData && raffleDetailData.assets && (Object.keys(raffleDetailData.assets).length - 1)}
                            </RaffleStatValue>
                          </RaffleStatGroup>

                          <RaffleStatGroup isBorder={true}>
                            <RaffleStatSubject>
                              Floor Price
                            </RaffleStatSubject>
                            <RaffleStatValue>
                              {raffleDetailData && floorPriceList[raffleDetailData.uniqueid ? raffleDetailData.uniqueid : raffleDetailData.tx] ? floorPriceList[raffleDetailData.uniqueid ? raffleDetailData.uniqueid : raffleDetailData.tx].floorprice : thisFloorPrice}
                            </RaffleStatValue>
                          </RaffleStatGroup>
                          <RaffleStatGroup isBorder={true}>
                            <RaffleStatSubject>
                              Min. Tickets
                            </RaffleStatSubject>
                            <RaffleStatValue>
                              {raffleDetailData && raffleDetailData.mintickets}
                            </RaffleStatValue>
                          </RaffleStatGroup>
                          <RaffleStatGroup>
                            <RaffleStatSubject>
                              Max. Tickets
                            </RaffleStatSubject>
                            <RaffleStatValue>
                              {raffleDetailData && raffleDetailData.maxtickets}
                            </RaffleStatValue>
                          </RaffleStatGroup>
                        </RaffleStats>
                        {/**** */}
                        <FlexBox paddingLeft='34px' paddingRight='18px' alignItems='center' smDirection='column' justifyContent='space-between' marginTop='11px' color={COLORS[colorMode].mainTextColor}>
                          <CommonText>
                            Ticket Quantity:
                          </CommonText>
                          <TicketControl>
                            <CustomImage
                              image={MINUS_ICON}
                              onClick={decrement}
                              cursor='pointer'
                            />
                            <TicketQuantity>
                              {ticketQuantity}
                            </TicketQuantity>
                            <CustomImage
                              image={PLUS_ICON}
                              onClick={increment}
                              cursor='pointer'
                            />
                          </TicketControl>

                        </FlexBox>

                        {/**** */}
                        <FlexBox justifyContent='space-between' paddingLeft='34px' marginTop='44px'>
                          <FlexBox smDirection='row' gap="16px" alignItems='center' justifyContent='start' color={COLORS[colorMode].mainTextColor}>
                            <CommonText>
                              Total Price:
                            </CommonText>
                            <TotalPriceValue>
                              {
                                raffleDetailData && raffleDetailData.price && ticketQuantity ? Math.floor(getExactTokenAmount(parseInt(raffleDetailData.price), raffleDetailData.tokenName) * ticketQuantity) : 0
                              }
                              &nbsp;
                              {
                                raffleDetailData && handleExceptionTokenName(raffleDetailData.tokenName)
                              }
                            </TotalPriceValue>
                          </FlexBox>

                          <FlexBox direction='column' gap='8px' maxWidth='275px'>
                            {
                              status === 'live' &&
                              <CustomButton
                                width='275px'
                                height='47px'
                                text='Purchase'
                                onClick={() => {
                                  if (status !== 'live' || raffleDetailData.creator === myWalletAddress || raffleDetailData.maxtickets < (raffleDetailData.tickets + ticketQuantity)) {
                                    // infoAlert("You cannot buy a ticket for the raffle you have created.")
                                  } else {
                                    buyTicket()
                                  }

                                }
                                }
                              />
                            }
                            {
                              status !== "live" &&
                              <CustomText
                                text={`Raffle has ended.`}
                                color='#f73737'
                                fontSize='16px'
                                fontWeight='400'
                                fontFamily='Open Sans'
                              />
                            }
                          </FlexBox>

                        </FlexBox>
                        {/**** */}
                        {
                          status !== 'refund' &&
                          <FlexBox marginTop='24px' justifyContent='start' smDirection='row' paddingLeft='34px'>
                            <CustomText
                              text={
                                raffleDetailData && getExactTokenAmount(parseInt(raffleDetailData.price), raffleDetailData.tokenName) + " " + handleExceptionTokenName(raffleDetailData.tokenName)
                              }
                              fontFamily='Open Sans'
                              fontSize='16px'
                              fontWeight='700'
                              color='#1878af'
                            />
                            <CustomText
                              text={`/ticket`}
                              fontFamily='Open Sans'
                              fontSize='16px'
                              fontWeight='400'
                              color='#1878af'
                              borderRight='2px solid #1878af'
                              paddingRight='13px'
                            />
                            <CustomText
                              text={raffleDetailData && (raffleDetailData.maxtickets - raffleDetailData.tickets)}
                              fontFamily='Open Sans'
                              fontSize='16px'
                              fontWeight='700'
                              color='#1878af'
                              paddingLeft='13px'
                            />
                            <CustomText
                              text={`&nbsp;available`}
                              fontFamily='Open Sans'
                              fontSize='16px'
                              fontWeight='400'
                              color='#1878af'
                            />

                          </FlexBox>
                        }
                      </FlexBox>

                    </FlexBox>
                  </>
                  :
                  <RaffleDetailModal_MobileScreen
                    raffleDetailData={raffleDetailData}
                    status={status}
                    myWalletAddress={myWalletAddress}
                    buyTicket={buyTicket}
                    imageNFTs={imageNFTs}
                    activeNFT={activeNFT}
                    setActiveNFT={setActiveNFT}
                    floorPriceList={floorPriceList}
                    thisFloorPrice={thisFloorPrice}
                  />
              }
            </FlexBox>
          }
        </ModalBody>
      }
      {
        showSuccessModal &&
        <RaffleSuccessModal
          show={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false)
            onClose()
          }
          }
          raffleID={raffleDetailData && raffleDetailData.uniqueid}
          message={`You have successfully purchased your tickets.`}
        />
      }
    </StyledModal>
  )
}

export default RaffleDetailModal