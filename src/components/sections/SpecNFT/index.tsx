import { getNFTDetailByAsset } from '@/api/api'
import CopyBoard from '@/components/CopyBoard'
import CustomBorderButton from '@/components/common/CustomBorderButton'
import CustomButton from '@/components/common/CustomButton'
import CustomImage from '@/components/common/CustomImage'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import BuyNFTModal from '@/components/modal/BuyNFTModal'
import SuccessModal from '@/components/modal/SuccessModal'
import { COLLECTION_DATA } from '@/constants/document'
import { BLACK_DOWN_ICON, DROPDOWN_ICON, PARTNER_ICON, SLICK_LEFT_ICON, SLICK_RIGHT_ICON, VERIFIED_ICON_IMAGE } from '@/constants/image.constants'
import { useWalletConnect } from '@/context/WalletConnect'
import { getExactImageFormat } from '@/hooks/function'
import { useEffect, useState } from 'react'
import { Container, PageWrapper } from '@/styles/GlobalStyles'
import { SelectButton, SelectButtonGroup, HistoryTableHeader, HistoryTableRow, ComingSoonTableHeader, ComingSoonTableRow } from './index.styled'
import { useGlobalContext } from '@/context/GlobalContext'
import MakeOfferModal from '@/components/modal/MakeOfferModal'
import VERIFIED_COLLECTIONS from '@/constants/verified.collections.constant'
import { useCart } from '@/context/CartContext'
import { buyNFT } from '@/api/marketplace/buyNFT'
import { makeAnOfferForNFT } from '@/api/marketplace/makeOffer'
import { useMedia } from 'react-use'
import InputsExhaustedModal from '@/components/modal/InputsExhaustedModal'
import CollectionLink from '@/components/button/CollectionLink'
import { EXCEPTIONAL_NFT_ASSETS } from '@/constants/assets.constants'
import CustomLinkButton from '@/components/common/CustomLinkButton'
import CustomTextLink from '@/components/common/CustomTextLink'
import { H6, H7 } from '@/components/typography'
import { COLORS } from '@/constants/colors.constants'
import BackButton from '@/components/button/BackButton'
import Head from 'next/head'
const selectButtons = [
  "Purchase Now",
  "Make an Offer",
  // "Buy with Credit Card",
  // "Buy with ETH",
]
const SpecNFT = () => {
  if (typeof window === "undefined") return;
  const nftAsset = window.location.href.split("/nfts/")[1];

  const [listedData, setListedData] = useState<ListedData>()
  const [NFTData, setNFTData] = useState<NFTDataProps[]>()
  const [listedNFTUtxo, setListedNFTUtxo] = useState<string>()
  const [isListed, setIsListed] = useState<boolean>();

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showExhaustedModal, setShowExhaustedModal] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [noteMessage, setNoteMessage] = useState<string>()
  const [buttonSelected, setButtonSelected] = useState('Purchase Now');
  const [isBundle, setIsBundle] = useState<boolean>()
  // assume count is in component state
  const [count, setCount] = useState(0);
  const [activeNFT, setActiveNFT] = useState(0);
  const [imageNFTs, setImageNFTs] = useState([])
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  const isMobile = useMedia('(max-width: 768px)')
  const { myWalletAddress, lucid } = useWalletConnect()
  const { listedAllNFTs, myBalance, colorMode } = useGlobalContext()
  const { cartData, addToCart } = useCart()

  const data_arr = [true, false, false]

  const addCart = (newData: any) => {
    // Append newData to the existing array and update it in local storage
    console.log("newData", newData)
    addToCart(newData)
  };

  const isAssetInListing = (data: ListedNFTList, asset: string) => {
    for (let key in data) {
      if (data[key].nfts.hasOwnProperty(asset)) {
        return true;
      }
    }
    return false;
  };

  const getUtxoByAsset = (data: ListedNFTList, asset: string) => {
    for (let key in data) {
      if (data[key].nfts.hasOwnProperty(asset)) {
        return key;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (nftAsset && listedAllNFTs) {
        const isListed = isAssetInListing(listedAllNFTs, nftAsset);
        setIsListed(isListed);

        if (isListed) {
          const utxo: any = getUtxoByAsset(listedAllNFTs, nftAsset);
          setListedNFTUtxo(utxo)
          setIsBundle(Object.keys(listedAllNFTs[utxo].nfts).length > 1);
          setListedData(listedAllNFTs[utxo]);
          // @ts-ignore
          setImageNFTs(Object.values(listedAllNFTs[utxo].nfts));
          await getNFTData(Object.keys(listedAllNFTs[utxo].nfts));
        } else {
          await getNFTData([nftAsset]);
        }
      }
    };

    fetchData();
  }, [nftAsset, listedAllNFTs]);


  const submitBuyNFT = async () => {
    if (!myWalletAddress || !lucid || !listedNFTUtxo || !NFTData) return;
    const owner = listedData ? listedData.seller : ''
    setPending(true)
    // submit tx to buy nft
    const response = await buyNFT(myWalletAddress, lucid, listedNFTUtxo, NFTData, owner)
    if (response) {
      console.log("response", response)
      if (response.result === "success") {
        // close modal for buying nft(s)
        setShowBuyModal(false)
        setNoteMessage('You have successfully made your purchase.')
        // show success modal
        setShowSuccessModal(true)
      }
      if (response.result === "fail" && response.error === "InputsExhaustedError") {
        setPending(false)
        setShowBuyModal(false)
        setShowExhaustedModal(true)
      }
    } else {
    }
  }

  const submitOffer = async (price: number, policyId: string, asset: string, tokenType: string, nftAssets: string[], royaltyAmount: number) => {
    const owner = listedData ? listedData.seller : ''
    setPending(true)
    if (!myWalletAddress || !lucid || !NFTData) return;
    const response = await makeAnOfferForNFT(myWalletAddress, lucid, price, policyId, asset, tokenType, nftAssets, NFTData, owner, 0)
    if (response) {
      // close modal for buying nft(s)
      setShowOfferModal(false)
      setNoteMessage('You have successfully made your offer.')
      // show success modal
      setShowSuccessModal(true)
    } else {
      setPending(false)
    }

  }
  const getNFTData = async (assets: string[]) => {

    try {
      const arr: NFTDataProps[] = [];
      for (const asset of assets) {
        const data = await getNFTDetailByAsset(asset);
        const object = VERIFIED_COLLECTIONS[data.policy_id];
        arr.push({
          asset: data.asset,
          name: data.onchain_metadata.name,
          image: data.onchain_metadata.image,
          policyId: data.policy_id,
          description: object ? object.description : 'Welcome to CRASHR',
        });
      }
      setNFTData(arr);
    } catch (error) {
      console.error('Error fetching NFT data:', error);
    }
  };


  return (
    <>
      <Head>
        <title>
          {nftAsset && nftAsset}
        </title>
        <meta name="description"
          content="The Ultimate Platform. Providing the tools on the Cardano Blockchain for NFT Traders." />


        <meta property="og:url" content="https://teamv2.crashr.io" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="CRASHR" />
        <meta property="og:description"
          content="The Ultimate Platform. Providing the tools on the Cardano Blockchain for NFT Traders." />
        {
          NFTData &&
          <meta property="og:image"
            content={
              getExactImageFormat(NFTData[activeNFT].image)
            }
          />
        }


        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="teamv2.crashr.io" />
        <meta property="twitter:url" content="https://teamv2.crashr.io" />
        <meta name="twitter:title" content="CRASHR" />
        <meta name="twitter:description"
          content="The Ultimate Platform. Providing the tools on the Cardano Blockchain for NFT Traders." />
        {
          NFTData &&
          <meta property="twitter:image"
            content={
              getExactImageFormat(NFTData[activeNFT].image)
            }
          />
        }

      </Head>

      <PageWrapper colorMode={colorMode}>
        <Container paddingTop='100px' smPaddingTop='32px'>

          {
            <>
              {
                NFTData &&
                <FlexBox
                  justifyContent='space-between'
                  smGap='16px'
                >

                  {
                    !isBundle &&
                    <CustomImage
                      image={getExactImageFormat(NFTData[activeNFT].image)}
                      width='502px'
                      height='502px'
                      borderRadius='3px'
                      smWidth='358px'
                      smHeight='358px'
                    />
                  }
                  {
                    isBundle &&
                    <FlexBox maxWidth='502px' direction='column' smWidth='100%'>
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
                        <CustomImage
                          image={
                            NFTData && NFTData.length > 0 &&
                            getExactImageFormat(NFTData[activeNFT].image)
                          }
                          width='380px'
                          height='380px'
                          borderRadius='3px'
                          smWidth='250px'
                          smHeight='250px'
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
                        bgColor='white'
                        padding='12px 24px'
                        smDirection='row'
                        smPadding='6px 12px'
                        gap="12px"
                        alignItems='center'
                        borderRadius='3px'
                        marginTop='24px'
                        smGap='8px'
                      >
                        {
                          NFTData && NFTData.length > 0 && NFTData.slice(Math.floor(activeNFT / 6) * 6, Math.floor(activeNFT / 6) * 6 + 6).map((item, j) => {
                            return (
                              <CustomImage
                                image={
                                  NFTData && NFTData.length > 0 &&
                                  getExactImageFormat(item.image)
                                }
                                key={j}
                                alt={`img-slick-nft` + j}
                                width={(j + Math.floor(activeNFT / 6) * 6) === activeNFT ? '80px' : '64px'}

                                height={(j + Math.floor(activeNFT / 6) * 6) === activeNFT ? '80px' : '64px'}
                                smWidth={(j + Math.floor(activeNFT / 6) * 6) === activeNFT ? '50px' : '36px'}
                                smHeight={(j + Math.floor(activeNFT / 6) * 6) === activeNFT ? '50px' : '36px'}
                                onClick={() => {
                                  setActiveNFT(j + Math.floor(activeNFT / 5) * 5)
                                }}
                                cursor='pointer'
                                borderRadius='3px'
                              />
                            )
                          })
                        }
                      </FlexBox>
                    </FlexBox>
                  }
                  <FlexBox direction='column' width='default' maxWidth='670px'>
                    <FlexBox direction='column' marginBottom='20px' gap='10px'>
                      <FlexBox smDirection='row' smGap='9px' smAlignItems='center' smJustifyContent='start' justifyContent='start'>
                        {
                          isMobile &&
                          <BackButton />
                        }
                        <CustomText
                          text={
                            // @ts-ignore
                            NFTData[activeNFT].name ? NFTData[activeNFT].name : EXCEPTIONAL_NFT_ASSETS[NFTData[activeNFT].asset].name
                          }
                          maxWidth='665px'
                          display='block'
                          smDisplay='block'
                          className='three-dots'
                          fontFamily='Inconsolata'
                          fontSize='41px'
                          lineHeight='120%'
                          letterSpacing='-1.025px'
                          fontWeight='700'
                          smFontSize='38px'
                          smMaxWidth='358px'
                          color={COLORS[colorMode].mainTextColor}
                        />
                      </FlexBox>
                      <FlexBox
                        smDirection='row'
                        gap='6px'
                        alignItems='center'
                        justifyContent='start'
                        smJustifyContent='start'
                      >
                        {

                          <CollectionLink
                            link={`/collections/${NFTData[activeNFT].policyId}`}
                            text={
                              COLLECTION_DATA.hasOwnProperty(NFTData[activeNFT].policyId)
                                ?
                                // @ts-ignore
                                COLLECTION_DATA[NFTData[activeNFT].policyId].name
                                :
                                NFTData[activeNFT].policyId
                            }
                            color='black'
                            fontSize='17px'
                            fontWeight='400'
                            maxWidth='600px'
                            display='block'
                            className='three-dots'
                            bgColor='none'
                            justifyContent='start'
                            fontFamily='Open Sans'
                            lineHeight='130%'
                          // smDisplay='block'
                          // smMaxWidth='350px'
                          />
                        }
                        {
                          NFTData && activeNFT &&
                          // @ts-ignore
                          Object.keys(COLLECTION_DATA).includes(NFTData[activeNFT].policyId) &&
                          <CustomImage
                            image={VERIFIED_ICON_IMAGE}
                            width='22px'
                            height='22px'
                          />
                        }
                        {
                          nftAsset.includes("848838af0c3ab2e3027d420e320c90eb217f25b8b097efb4378e90f5") &&
                          <CustomImage
                            image={PARTNER_ICON}
                            width='22px'
                            height='22px'
                          />
                        }

                      </FlexBox>
                      {
                        isListed &&
                        <FlexBox gap='5px' justifyContent='start' smJustifyContent='start' smDirection='row' alignItems='center' smAlignItems='center'>
                          <H6 color={COLORS[colorMode].mainTextColor}>Owned by:</H6>
                          {
                            listedData &&
                            <CustomTextLink
                              link={listedData.seller ? `/users/${listedData.seller}` : ''}
                              text={listedData.seller ? listedData.seller.slice(0, 10) + "..." : ''}
                              width='auto'
                              color={`#6073f6`}
                              fontSize='17px'
                              fontWeight='600'
                              lineHeight='130%'
                              smFontSize='15px'
                            />
                          }
                        </FlexBox>
                      }
                    </FlexBox>
                    {
                      !isMobile &&
                      <FlexBox
                        smDirection='column'
                        gap='11px'
                        justifyContent='start'
                        marginBottom='16px'
                        alignItems='center'
                      >
                        <FlexBox alignItems='center' justifyContent='start' smAlignItems='center' smGap='8.5px'>
                          <CustomText
                            text={`Policy ID: `}
                            fontWeight='600'
                            lineHeight='130%'
                            fontFamily='Open Sans'
                            fontSize='17px'
                            className='no-wrap'
                            smFontSize='15px'
                            color={`#6073f6`}
                            width='80px'
                          />
                          <CopyBoard addr={NFTData[activeNFT].policyId} maxWidth='139px' />
                        </FlexBox>
                        <FlexBox alignItems='center' smAlignItems='center' smGap='8.5px' justifyContent='start'>
                          <CustomText
                            text={`Asset ID: `}
                            fontWeight='600'
                            lineHeight='130%'
                            fontFamily='Open Sans'
                            fontSize='17px'
                            className='no-wrap'
                            smFontSize='15px'
                            color={`#6073f6`}
                            width='80px'
                          />
                          <CopyBoard addr={NFTData[activeNFT].asset} maxWidth='139px' />
                        </FlexBox>

                      </FlexBox>
                    }
                    <CustomText
                      text={NFTData && NFTData[activeNFT].description}
                      maxWidth='665px'
                      fontSize='17px'
                      lineHeight='130%'
                      fontWeight='400'
                      fontFamily='Open Sans'
                      marginBottom='48px'
                      smFontSize='15px'
                      color={COLORS[colorMode].mainTextColor}
                    />

                    <FlexBox
                      bgColor={colorMode === 'light' ? 'none' : '#363636'}
                      // padding='15px 24px 30px 36px'
                      borderRadius='3px'
                      justifyContent='start'
                      direction='column'
                      gap='16px'
                      smPadding='0px 0px'
                      smWidth='100%'
                      color={COLORS[colorMode].mainTextColor}
                    >
                      {
                        listedData &&
                        <CustomText
                          text={`₳${parseInt(listedData.amount) / 1000000}`}
                          fontSize='50px'
                          fontWeight='700'
                          fontFamily='Open Sans'
                          smFontSize='28px'
                          color={(listedData.seller === myWalletAddress || myWalletAddress === undefined || myBalance.ADA < parseInt(listedData.amount)) ? '#9e9e9e' : COLORS[colorMode].mainTextColor}
                        />
                      }
                      {isListed
                        ?
                        <FlexBox justifyContent='start' gap='16px' direction='column'>
                          {
                            !pending && listedData &&
                            <CustomBorderButton
                              width='100%'
                              height='48px'
                              text='Add to Cart'
                              disabled={listedData.seller === myWalletAddress || myWalletAddress === undefined ||
                                cartData.some(item => item.utxo === listedData.utxo)}
                              onClick={() => {
                                addCart(listedData)
                              }}
                              smWidth='100%'
                              color={`#6073f6`}
                            />
                          }
                          {
                            pending &&
                            <CustomButton
                              text='Transaction Pending'
                              width='100%'
                              height='48px'
                              smWidth='100%'
                              smHeight='42px'
                              bgColor='#9e9e9e'
                              hoverBgColor='#9e9e9e'
                            />
                          }
                          {
                            !pending &&
                            <FlexBox width='100%' smWidth='100%' smDirection='row' gap="16px" smGap="16px">

                              <FlexBox direction='column' width='100%' smWidth='100%'>
                                {
                                  buttonSelected === "Purchase Now" && listedData &&
                                  <CustomButton
                                    text='Purchase Now'
                                    width='100%'
                                    height='48px'
                                    disabled={listedData.seller === myWalletAddress || myWalletAddress === undefined || myBalance.ADA < parseInt(listedData.amount)}
                                    onClick={() => {
                                      setShowBuyModal(true);
                                    }}
                                    smWidth='100%'
                                    smHeight='42px'
                                  />
                                }
                                {
                                  buttonSelected === "Make an Offer" &&
                                  <CustomButton
                                    text='Make an Offer'
                                    width='100%'
                                    height='48px'
                                    onClick={() => {
                                      setShowOfferModal(true);
                                    }}
                                    disabled={
                                      myWalletAddress === undefined || isBundle
                                    }
                                    smWidth='100%'
                                    smHeight='42px'
                                  />
                                }

                                {
                                  buttonSelected === "Buy with Credit Card" &&

                                  <CustomButton
                                    text='Buy with Credit Card'
                                    width='100%'
                                    height='48px'
                                    disabled={true}
                                  />
                                }
                                {
                                  buttonSelected === "Buy with ETH" &&

                                  <CustomButton
                                    text='Buy with ETH'
                                    width='100%'
                                    height='48px'
                                    disabled={true}
                                  />
                                }
                                {
                                  showDropdown &&
                                  <SelectButtonGroup>
                                    {
                                      selectButtons.map((button: string, index: number) => {
                                        if (button === buttonSelected) {
                                          return;
                                        }
                                        return (
                                          <SelectButton key={index} onClick={() => {
                                            setButtonSelected(button)
                                          }}>
                                            {button}
                                          </SelectButton>
                                        )
                                      })

                                    }

                                  </SelectButtonGroup>
                                }
                                {
                                  <>
                                    {
                                      myWalletAddress !== undefined && listedData && myBalance.ADA < parseInt(listedData.amount) &&
                                      <CustomText
                                        text={`Insufficient funds in wallet.`}
                                        marginTop='8px'
                                        fontFamily='Open Sans'
                                        fontSize='16px'
                                        fontWeight='400'
                                        color='#F73737'
                                        width='100%'
                                        justifyContent='end'
                                      />
                                    }

                                  </>
                                }

                              </FlexBox>

                              <CustomImage
                                image={BLACK_DOWN_ICON[colorMode]}
                                width='20.5px'
                                height='12px'
                                smWidth='19px'
                                smHeight='11px'
                                cursor='pointer'
                                marginTop='18px'
                                smMarginTop='15px'
                                onClick={
                                  () => {
                                    setShowDropdown(!showDropdown)
                                  }
                                }
                              />
                            </FlexBox>
                          }

                        </FlexBox>
                        :
                        <FlexBox direction='column'>
                          <CustomText
                            text={`Not Listed`}
                            fontSize='38px'
                            fontWeight='700'
                            fontFamily='Inconsolata'
                            color='#9e9e9e'
                          />
                          {
                            myWalletAddress === undefined &&
                            <CustomText
                              text={`Please connect your wallet.`}
                              marginTop='8px'
                              fontFamily='Open Sans'
                              fontSize='16px'
                              fontWeight='400'
                              color='#F73737'
                              width='100%'
                              justifyContent='end'
                            />
                          }
                          <CustomButton
                            marginTop='16px'
                            text='Make an Offer'
                            width='100%'
                            height='48px'
                            onClick={() => {
                              setShowOfferModal(true);
                            }}
                            disabled={myWalletAddress === undefined}
                            smWidth='100%'
                          />

                        </FlexBox>
                      }


                    </FlexBox>
                  </FlexBox>
                </FlexBox>
              }
              <FlexBox
                direction='column'
                marginTop='91px'
              >
                <CustomText
                  text={`Transaction History`}
                  fontSize='26px'
                  fontWeight='700'
                  lineHeight='120%'
                  letterSpacing='-0.52px'
                  smFontSize='21px'
                />
                <FlexBox direction='column' alignItems='center' justifyContent='center'>
                  <ComingSoonTableHeader className='mx-auto' colorMode={colorMode}>
                    <div>TRADE TYPE</div>
                    <div>PRICE</div>
                    {
                      !isMobile &&
                      <>
                        <div>FROM</div>
                        <div>TO</div>
                      </>
                    }

                    <div>TIME</div>
                  </ComingSoonTableHeader>
                  {
                    data_arr.map((item, index) => {
                      return (
                        <ComingSoonTableRow className={item === true ? 'active' : ''}>
                          <div></div>
                          <div></div>
                          {
                            !isMobile &&
                            <>
                              <div></div>
                              <div></div>
                            </>
                          }

                          <div></div>
                        </ComingSoonTableRow>
                      )
                    })
                  }
                </FlexBox>
              </FlexBox>
            </>
          }
        </Container>
        {
          showBuyModal && NFTData && listedData &&
          <BuyNFTModal
            show={showBuyModal}
            onClose={() => { setShowBuyModal(false) }}
            submitBuyNFT={submitBuyNFT}
            nftData={NFTData[0]}
            price={parseInt(listedData.amount) / 1000000}
          />
        }
        {
          showSuccessModal && noteMessage &&
          <SuccessModal
            show={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false)
            }}
            message={noteMessage}
          />
        }
        {
          showExhaustedModal &&
          <InputsExhaustedModal
            show={showExhaustedModal}
            onClose={() => setShowExhaustedModal(false)}
          />
        }
        {
          showOfferModal && NFTData && listedData &&
          <MakeOfferModal
            show={showOfferModal}
            // @ts-ignore
            onClose={() => { setShowOfferModal(false) }}
            // @ts-ignore
            submitOffer={submitOffer}
            nftData={NFTData[0]}
            listedData={listedData}
          />
        }

      </PageWrapper>
    </>
  )
}

export default SpecNFT