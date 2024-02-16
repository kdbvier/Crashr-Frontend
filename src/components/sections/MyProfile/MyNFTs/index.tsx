import { getMyNFTListing } from '@/api/marketplace'
import MyListedNFTCard from '@/components/card/MyListedNFTCard'
import NFTCard from '@/components/card/NFTCard'
import CustomButton from '@/components/common/CustomButton'
import CustomImage from '@/components/common/CustomImage'
import CustomInput from '@/components/common/CustomInput'
import CustomSearchInput from '@/components/common/CustomSearchInput'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import SellNFTBundleModal from '@/components/modal/SellNFTBundleModal'
import SellNFTModal from '@/components/modal/SellNFTModal'
import SuccessModal from '@/components/modal/SuccessModal'
import { BLACK_DOWN_ICON, BLACK_UP_ICON, DEFAULT_NFT_IMAGE, DOWN_FILTER_ICON_IMAGE, UP_FILTER_ICON_IMAGE } from '@/constants/image.constants'
import { useGlobalContext } from '@/context/GlobalContext'
import { useWalletConnect } from '@/context/WalletConnect'
import { infoAlert } from '@/hooks/alert'
import { getExactImageFormat } from '@/hooks/function'
import { useEffect, useState } from 'react'
import RemoveConfirmModal from '@/components/modal/RemoveConfirmModal'
import EditListingModal from '@/components/modal/EditListingModal'
import { useMedia } from 'react-use'
import { getMyListedNFTsFromJPGStore } from '@/api/marketplace/getMyListedNFTsFromJPGStore'
import MyJpgStoreNFTCard from '@/components/card/MyJpgStoreNFTCard'
import MigrateListingModal from '@/components/modal/MigrateListingModal'
import { migrateAssets } from '@/api/marketplace/migrateAssets'
import { editListedNFT } from '@/api/marketplace/editListedNFT'
import { listNFTByAddress } from '@/api/marketplace/listNFT'
import { cancelNFT } from '@/api/marketplace/cancelNFT'
import { NFTFlex } from './index.styled'
import InputsExhaustedModal from '@/components/modal/InputsExhaustedModal'
import { ThreeDots } from 'react-loader-spinner'
import { COLORS } from '@/constants/colors.constants'
const filterCategories: any = {
  "Rewards": [
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
  ],
  "PFP": [
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
  ],
  "Music": [
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
  ],
  "Gaming": [
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
  ],
  "Membership": [
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
  ],
  "Photography": [
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Lorem Ipsum",
  ],
  "Fashion": [
    "Lorem Ipsum",
    "Lorem Ipsum",
  ]
}

const MyNFTs = () => {
  if (typeof window === 'undefined') return;
  const [isFilter, setIsFilter] = useState<boolean>(false)
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('');
  const [search2, setSearch2] = useState<string>('');
  const [selectedNFTs, setSelectedNFTs] = useState<NFTDataProps[] | []>([])
  const [myListedData, setMyListedData] = useState<ListedNFTList>();
  const [activeShowingData, setActiveShowingData] = useState([])
  const [showSellModal, setShowSellModal] = useState(false)
  const [activeSelectNFT, setActiveSelectNFT] = useState<NFTDataProps>()
  const [activeEditData, setActiveEditData] = useState()
  const [activeMigratingData, setActiveMigratingData] = useState()
  const [subFiltersOpen, setSubFiltersOpen] = useState<boolean[]>(
    [false, false, false]
  )
  const [activeRemoveListingID, setActiveRemoveListingID] = useState<string>()

  const [showSellSuccessModal, setShowSellSuccessModal] = useState(false)
  const [showRemoveSuccessModal, setShowRemoveSuccessModal] = useState(false)
  const [showSellBundleModal, setShowSellBundleModal] = useState(false)
  const [showRemoveListingModal, setShowRemoveListingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRemoveBundleModal, setShowRemoveBundleModal] = useState(false)
  const [showMigratingModal, setShowMigratingModal] = useState(false)
  const [showMigrateSuccessModal, setShowMigrateSuccessModal] = useState(false)
  const [showExhaustedModal, setShowExhaustedModal] = useState(false)
  const [myJPGStoreData, setMyJPGStoreData] = useState<any>()
  const [removeListedNFTs, setRemoveListedNFTs] = useState<NFTDataProps[]>([])
  const { myNFTs, setMyNFTs, colorMode } = useGlobalContext()
  console.log("myNFTs", myNFTs)
  const { myWalletAddress, lucid } = useWalletConnect()

  const isMobile = useMedia('(max-width: 768px)');

  const getJpgStoreListedData = async () => {
    if (!lucid || !myWalletAddress) return;
    const jpgStoreListedData = await getMyListedNFTsFromJPGStore(myWalletAddress)
    setMyJPGStoreData(jpgStoreListedData)
  }

  // get my listed nft data
  const getListedData = async () => {
    if (!lucid || !myWalletAddress) return;
    const listedData = await getMyNFTListing(myWalletAddress);
    setMyListedData(listedData);
  }

  // submit nfts to sell 
  const submitSellNFT = async (assets: string[], price: number, nftArr: NFTDataProps[], royaltyAmount?: number) => {
    if (!lucid || !myWalletAddress) return;
    const response = await listNFTByAddress(myWalletAddress, lucid, assets, price, nftArr, royaltyAmount)
    // @ts-ignore
    if (response.result === "success") {
      setShowSellModal(false)
      setShowSellBundleModal(false)
      setShowSellSuccessModal(true)
    }
    // @ts-ignore
    if (response.result === "fail" && response.error === "InputsExhaustedError") {
      setShowSellModal(false)
      setShowExhaustedModal(true)
    }
  }

  // edit nfts to list 
  const editNFT = async (price: number, assets: string[], utxoValue: any, nftArr: NFTDataProps[], royaltyAmount?: number) => {
    if (!lucid || !myWalletAddress) return;
    const response = await editListedNFT(myWalletAddress, lucid, price, assets, utxoValue, nftArr, royaltyAmount)
    if (response) {
      setShowEditModal(false)
      setShowSellSuccessModal(true)
    } else {
    }
  }

  // submit nfts to remove
  const submitRemoveNFTs = async () => {
    if (!lucid || !myWalletAddress || !activeRemoveListingID) return;
    const response = await cancelNFT(lucid, myWalletAddress, activeRemoveListingID, removeListedNFTs)
    if (response) {
      setShowRemoveSuccessModal(true)
    }
  }

  const toggleSelected = (assetToToggle: any) => {
    // update state of selected nfts' selected status
    const updatedData = (myNFTs || []).map((item: any) =>
      item.asset === assetToToggle
        ? { ...item, isSelected: !item.isSelected }
        : item
    );

    // @ts-ignore
    setMyNFTs(updatedData);
  };


  // select first 10 NFTs for bundle selling
  const selectFirst10NFTs = () => {
    const updatedData: any = myNFTs.map((item: any, index: number) => {
      if (index < 10) {
        return {
          ...item,
          isSelected: true
        };
      }
      return item;
    });
    if (!updatedData) return;
    // @ts-ignore
    setMyNFTs(updatedData)
  }

  // select first 10 NFTs for bundle selling
  const unSelectFirst10NFTs = () => {
    const updatedData: any = myNFTs.map((item: any, index: number) => {
      if (index < 10) {
        return {
          ...item,
          isSelected: false
        };
      }
      return item;
    });
    // @ts-ignore
    setMyNFTs(updatedData)
  }

  const migrateNFT = async (utxo: string, assets: [], price: number, nftArr: any[], royaltyAmount: number) => {
    console.log("assets", assets, utxo, price)
    if (!lucid || !myWalletAddress) return;
    const result = await migrateAssets(myWalletAddress, lucid, utxo.replace(/#0$/, ''), assets, price, nftArr, 0)
    if (result) {
      setShowMigrateSuccessModal(true)
      setShowMigratingModal(false)
    }
  }

  useEffect(() => {
    if (isChecked) {
      selectFirst10NFTs()
    } else {
      unSelectFirst10NFTs()
    }
  }, [isChecked])

  useEffect(() => {
    // store selected nfts as state
    const _selected_nfts = myNFTs.filter((item: any) => item.isSelected === true);
    setSelectedNFTs(_selected_nfts);
  }, [myNFTs])

  useEffect(() => {
    console.log("removeListedNFTs", removeListedNFTs)
  }, [removeListedNFTs])

  useEffect(() => {
    if (myNFTs && myNFTs.length > 0) {
      // filter nft data by input search
      let filtered_arr = myNFTs.filter((item: any) => {
        try {
          return item.name.toLowerCase().includes(search.toLocaleLowerCase());
        } catch (error) {
          console.error("Error filtering item:", error);
          // Optionally, you can log or handle the error in a different way
          return false; // Filter out the item in case of an error
        }
      });
      setActiveShowingData(filtered_arr)
    }
  }, [search, myNFTs])

  useEffect(() => {
    // call getListedData if myWalletAddress is set
    if (myWalletAddress) {
      getListedData();
      getJpgStoreListedData();
    }
  }, [myWalletAddress]);

  return (
    <>
      <FlexBox smDirection='row' gap="20px" justifyContent='start' marginBottom='32px' smMarginBottom='0px'>
        {
          !isMobile &&
          <>
            {
              isFilter
                ?
                <CustomImage
                  image={UP_FILTER_ICON_IMAGE[colorMode]}
                  width='40px'
                  height='40px'
                  onClick={() => setIsFilter(false)}
                  cursor='pointer'
                />
                :
                <CustomImage
                  image={DOWN_FILTER_ICON_IMAGE[colorMode]}
                  width='40px'
                  height='40px'
                  onClick={() => setIsFilter(true)}
                  cursor='pointer'
                />
            }
          </>
        }
        <CustomSearchInput
          input={search}
          setInput={setSearch}
          placeholder='Search NFTs'
        />
        {
          isMobile &&
          <>
            {
              isFilter
                ?
                <CustomImage
                  image={UP_FILTER_ICON_IMAGE[colorMode]}
                  width='40px'
                  height='40px'
                  onClick={() => setIsFilter(false)}
                  cursor='pointer'
                />
                :
                <CustomImage
                  image={DOWN_FILTER_ICON_IMAGE[colorMode]}
                  width='40px'
                  height='40px'
                  onClick={() => setIsFilter(true)}
                  cursor='pointer'
                />
            }
          </>
        }
      </FlexBox>
      <FlexBox gap="20px">
        {
          isFilter &&
          <FlexBox
            bgColor={colorMode === 'light' ? '#f3f3f3' : '#4f4f4f'}
            borderRadius='8px'
            border="1px solid #9E9E9E"
            width='392px'
            padding='32px 32px 454px 32px'
            direction='column'
            justifyContent='start'
            smWidth='320px'
            smPadding='20px 20px 136px 20px'
          >
            <CustomSearchInput
              input={search2}
              setInput={setSearch2}
              placeholder='Search properties'
              bgColor={colorMode === 'light' ? '#e7e7e7' : '#767676'}
            />
            <FlexBox marginTop='24px' direction='column'>

              {
                Object.keys(filterCategories).map((filter, index) => {
                  return (
                    <FlexBox direction='column' key={index}>
                      <FlexBox
                        padding='16px'
                        justifyContent='space-between'
                        smDirection='row'
                        borderBottom='#C2C2C2 1px solid'
                        alignItems='center'
                        smPadding='16px'
                      >
                        <CustomText
                          fontSize='14px'
                          fontWeight='600'
                          fontFamily='Open Sans'
                          text={filter}
                          width='100%'
                        />
                        {
                          subFiltersOpen[index]
                            ?
                            <CustomImage
                              image={BLACK_DOWN_ICON[colorMode]}
                              width='10px'
                              height='6px'
                              cursor='pointer'
                              onClick={() => {
                                setSubFiltersOpen(subFiltersOpen.map((item, j) => j === index && false));
                              }}
                            />
                            :
                            <CustomImage
                              image={BLACK_UP_ICON[colorMode]}
                              width='10px'
                              height='6px'
                              cursor='pointer'
                              onClick={() => {
                                setSubFiltersOpen(subFiltersOpen.map((item, j) => j === index && true));
                              }}
                            />
                        }
                      </FlexBox>
                      {
                        subFiltersOpen[index] && filterCategories[filter].map((item: any, j: number) => {
                          return (
                            <FlexBox
                              padding='8px 24px'
                              gap="12px"
                              justifyContent='start'
                              key={j} marginBottom='8px'
                              smDirection='row'
                              smAlignItems='center'
                              smJustifyContent='start'
                              smPadding='8px 24px'
                            >
                              <CustomInput
                                type='checkbox'
                                maxWidth='22px'
                                height='22px'
                              />
                              <CustomText
                                text={`Bombers`}
                                fontSize='14px'
                                fontWeight='400'
                                fontFamily='Open Sans'
                              />
                            </FlexBox>
                          )
                        })
                      }
                    </FlexBox>
                  )
                })
              }
            </FlexBox>
          </FlexBox>
        }
        <FlexBox justifyContent='start' direction='column'>
          {
            !isMobile &&
            <>
              <CustomText
                text={`To make an NFT bundle to sell, select NFTs below. Maximum 10 NFTs.`}
                fontFamily='Open Sans'
                fontSize='16px'
                fontWeight='400'
                width='100%'
                marginBottom='12px'
                color={COLORS[colorMode].mainTextColor}
              />
              <FlexBox alignItems='center'>
                <FlexBox padding='0px 16px' gap='8px' justifyContent='start' alignItems='center' smDirection='row' smJustifyContent='start'>
                  <input type="checkbox"
                    checked={isChecked}
                    onClick={() => {
                      setIsChecked(!isChecked);

                    }}
                  />
                  <CustomText
                    text={`Select All`}
                    fontFamily='Open Sans'
                    fontSize='16px'
                    fontWeight='400'
                    width='100%'
                    color={COLORS[colorMode].mainTextColor}
                  />
                </FlexBox>
                <CustomButton
                  text='Make NFT Bundle'
                  width='185px'
                  height='42px'
                  disabled={selectedNFTs.length < 2}
                  onClick={() => {
                    setShowSellBundleModal(true)
                  }}
                />
              </FlexBox>
            </>
          }
          {
            !myListedData &&
            <FlexBox smJustifyContent='center' smAlignItems='center'>
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#f73737"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                visible={true}
              />
            </FlexBox>
          }
          <NFTFlex>
            {
              myListedData &&
              Object.values(myListedData).length > 0 && Object.values(myListedData).map((nft, index) => {
                const isBundle = Object.values(nft.nfts).length > 1 ? true : false;
                return (
                  <MyListedNFTCard
                    key={index}
                    isBundle={isBundle}
                    isListed={true}
                    data={nft}
                    setActiveRemoveListingID={setActiveRemoveListingID}
                    setShowRemoveListingModal={setShowRemoveListingModal}
                    setActiveEditData={setActiveEditData}
                    setShowEditModal={setShowEditModal}
                    setRemoveListedNFTs={setRemoveListedNFTs}
                  />
                );
              })
            }
            {
              myJPGStoreData && myJPGStoreData.listings && myJPGStoreData.listings.length > 0 &&
              myJPGStoreData.listings.map((item: any, j: number) => {
                return (
                  <MyJpgStoreNFTCard
                    key={j}
                    data={item}
                    setActiveMigratingData={setActiveMigratingData}
                    setShowMigratingModal={setShowMigratingModal}
                  />
                )
              })
            }

            {
              activeShowingData && activeShowingData.length > 0 &&
              activeShowingData.map((nft: NFTDataProps, j) => {

                const imageId = getExactImageFormat(nft.image)
                return (
                  <NFTCard
                    key={j}
                    image={imageId}
                    name={nft.name}
                    isSelected={nft.isSelected}
                    onClick={() => {
                      setActiveSelectNFT(nft)
                      setShowSellModal(true)
                    }}
                    setSelect={
                      () => {
                        if (selectedNFTs.length === 10) {
                          infoAlert("You already selected 10 NFTs.")
                        } else {
                          toggleSelected(nft.asset)
                        }
                      }
                    }
                  />
                );
              })}
          </NFTFlex>
        </FlexBox>
      </FlexBox>
      {
        showSellModal && activeSelectNFT &&
        <SellNFTModal
          show={showSellModal}
          onClose={() => {
            setShowSellModal(false)
          }}
          nftData={activeSelectNFT}
          submitSellNFT={submitSellNFT}
        />
      }
      {
        showSellBundleModal &&
        <SellNFTBundleModal
          show={showSellBundleModal}
          onClose={() => {
            setShowSellBundleModal(false)
          }}
          nftData={selectedNFTs}
          submitSellNFT={submitSellNFT}
        />
      }
      {
        showMigrateSuccessModal &&
        <SuccessModal
          show={showMigrateSuccessModal}
          onClose={() => { setShowMigrateSuccessModal(false) }}
          message='You have successfully migrated your asset.' />
      }
      {
        showSellSuccessModal &&
        <SuccessModal
          show={showSellSuccessModal}
          onClose={() => { setShowSellSuccessModal(false) }}
          message='You have successfully listed your NFT(s).' />
      }
      {
        showRemoveSuccessModal &&
        <SuccessModal
          show={showRemoveSuccessModal}
          onClose={() => { setShowRemoveSuccessModal(false) }}
          message='You have successfully removed this listing.' />
      }
      {
        showRemoveListingModal && removeListedNFTs.length > 0 &&
        <RemoveConfirmModal
          show={showRemoveListingModal}
          onClose={() => { setShowRemoveListingModal(false) }}
          confirmText={
            removeListedNFTs.length > 1 ?
              `Are you sure you want to remove this bundle?`
              :
              `Are you sure you want to remove this listing?`
          }
          infoText={
            removeListedNFTs.length > 1 ?
              `Removing this listing will unlist all NFTs
            in the bundle.`
              :
              `Removing this listing.`
          }
          confirm={() => {
            setShowRemoveListingModal(false)
            submitRemoveNFTs()
          }}
        />
      }
      {
        showEditModal &&
        <EditListingModal
          show={showEditModal}
          onClose={() => { setShowEditModal(false) }}
          editNFT={editNFT}
          activeEditData={activeEditData}
        />
      }
      {
        showMigratingModal &&
        <MigrateListingModal
          show={showMigratingModal}
          onClose={() => { setShowMigratingModal(false) }}
          migrateNFT={migrateNFT}
          activeMigratingData={activeMigratingData}
        />
      }
      {
        showExhaustedModal &&
        <InputsExhaustedModal
          show={showExhaustedModal}
          onClose={() => {
            setShowExhaustedModal(false)
          }}
        />
      }
    </>
  )
}

export default MyNFTs



