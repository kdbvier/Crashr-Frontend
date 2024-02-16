import CustomImage from '@/components/common/CustomImage'
import CustomSearchInput from '@/components/common/CustomSearchInput'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { H2 } from '@/components/typography'
import { DOWN_FILTER_ICON_IMAGE, FILTER_ICON, PARTNER_ICON, ROYALTIES_ICON, UP_FILTER_ICON_IMAGE, VERIFIED_ICON_IMAGE } from '@/constants/image.constants'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Container, PageWrapper } from '@/styles/GlobalStyles'
import CopyBoard from '@/components/CopyBoard'
import VERIFIED_COLLECTIONS from '@/constants/verified.collections.constant'
import { getListedNFTsByPolicy } from '@/api/marketplace'
import { useMedia } from 'react-use'
import HeaderBanner from '@/components/HeaderBanner'
import { COLLECTIONS_ROYALTIES_CONSTANT } from '@/constants/collections.royalties.constant'
import CustomButton from '@/components/common/CustomButton'
import { useGlobalContext } from '@/context/GlobalContext'
import { COLORS } from '@/constants/colors.constants'
import BackButton from '@/components/button/BackButton'
import SpecCollectionStats from '@/components/sections/Collections/SpecCollectionStats'
import SalesInfo from '@/components/sections/Collections/SalesInfo'
import OfferTable from '@/components/sections/Collections/OfferTable'
import NFTsInfo from '@/components/sections/Collections/NFTsInfo'

const tabData = ["NFTs", "Offers", "Sales"]

interface SearchFilterTabProps {
  active: boolean;
  color?: string;
  bgColor?: string;
  colorMode?: string;
}

export const SearchFilterTab = styled.div<SearchFilterTabProps>`
  cursor: pointer;
  background-color: ${props => props.active ? (props.colorMode === 'light' ? '#afb9fb' : '#4856b9') : 'none'};
  color: ${props => props.colorMode === 'dark' ? '#e7e7e7' : 'black'};
  font-size: 16px;
  font-family: Open Sans;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 149px;
  height: 36px;
  border-radius: 3px;
  @media screen and (max-width: 768px) {
    width: 50%;
    height: 28px;
  }
`


const SpecCollection = () => {
  const [collectionData, setCollectionData] = useState<CollectionType>()
  const [isFilter, setIsFilter] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>("NFTs");
  const [collectionAssets, setCollectionAssets] = useState([])
  const [commonNFTs, setCommonNFTs] = useState([]);
  const [listedNFTs, setListedNFTs] = useState<ListedData[]>() // listed nfts of every collection
  const [filteredNFTs, setFilteredNFTs] = useState<ListedData[]>() // filtered nfts of listed nfts based on search and filter categories
  const [subFiltersOpen, setSubFiltersOpen] = useState<boolean[]>(
    [false, false, false]
  )

  const isMobile = useMedia('(max-width: 768px)');
  const { colorMode } = useGlobalContext()

  if (typeof window === "undefined") return;
  const policyId = window.location.href.split("/collections/")[1];



  useEffect(() => {
    // @ts-ignore
    const object: CollectionType = VERIFIED_COLLECTIONS[policyId];

    console.log("object", object)
    setCollectionData(object)
    // getCollectionNFTs(object.supply.length)
    getListedData(policyId)
  }, [policyId]);

  useEffect(() => {
    if (listedNFTs && listedNFTs.length > 0 && search !== "") {
      updateFilteredNFTs()
    }
  }, [listedNFTs, search])

  const getListedData = async (policyId: string) => {
    const data: any = await getListedNFTsByPolicy(policyId);
    const dataArray: any = Object.values(data);

    // Sort the array based on the 'amount' property
    dataArray.sort((a: any, b: any) => parseInt(a.amount) - parseInt(b.amount));
    setListedNFTs(dataArray)
  }

  const updateFilteredNFTs = () => {
    console.log("listedNFTs", listedNFTs)
    // // Logic to filter listed NFTs based on searchQuery and filterCategory
    // const newFilteredNFTs = listedNFTs.filter((nft) => {
    //   // Include additional conditions based on your specific requirements
    //   const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase());
    //   const matchesFilter = nft.category === filterCategory || filterCategory === '';

    //   return matchesSearch && matchesFilter;
    // });

    // setFilteredNFTs(newFilteredNFTs);
  };

  return (
    <PageWrapper colorMode={colorMode}>
      <HeaderBanner
        image={collectionData && collectionData.banner && collectionData.banner}
        height='294px'
      />
      <Container>
        <CustomImage
          position='absolute' marginTop='-147px'
          smMarginTop="-57px"
          image={collectionData && collectionData.image}
          width='200px'
          height='200px'
          border='2px solid #FFF'
          smWidth='114px'
          smHeight='114px'
        />
        <FlexBox direction='column' paddingTop='68px' smPaddingTop='65px'>
          <FlexBox justifyContent='space-between'>
            <FlexBox
              gap='12px'
              justifyContent='start'
              alignItems='center'
              width='default'
              smDirection='row'
              smJustifyContent='start'
            >
              <BackButton />
              <H2 color={COLORS[colorMode].mainTextColor}>
                {
                  collectionData && collectionData.name
                }

              </H2>
              <CustomImage
                width='32px'
                height='30px'
                smWidth='24px'
                smHeight='23px'
                image={VERIFIED_ICON_IMAGE}
              />
              {
                collectionData && collectionData.id && COLLECTIONS_ROYALTIES_CONSTANT[collectionData.id] &&
                <CustomImage
                  width='32px'
                  height='30px'
                  image={ROYALTIES_ICON}
                  smWidth='24px'
                  smHeight='23px'
                />
              }
              {
                policyId === "848838af0c3ab2e3027d420e320c90eb217f25b8b097efb4378e90f5" &&
                <CustomImage
                  image={PARTNER_ICON}
                  width='32px'
                  height='30px'
                  smWidth='24px'
                  smHeight='23px'
                />
              }

            </FlexBox>
            {
              !isMobile &&
              <FlexBox
                width='default'
                smDirection='row'
                alignItems='center'
                gap="28px"
              >
                {
                  collectionData && collectionData.id &&
                  <FlexBox alignItems='center' smDirection='row' width='default'>
                    <CustomText
                      text={`Policy ID:&nbsp;`}
                      fontFamily='Open Sans'
                      fontSize='17px'
                      fontWeight='600'
                      color='#6073f6'
                      lineHeight='130%'
                      className='text-nowrap'
                      smFontSize='14px'
                      smMaxWidth='179px'
                    />
                    <CopyBoard
                      addr={collectionData.id}
                      maxWidth='200px'
                    />
                  </FlexBox>
                }

              </FlexBox>
            }
          </FlexBox>
          {
            collectionData &&
            <CustomText
              text={collectionData && collectionData.description}
              maxWidth='872px'
              fontSize='17px'
              fontWeight='400'
              lineHeight='130%'
              fontFamily='Open Sans'
              marginTop='12px'
              marginBottom='21px'
              smFontSize='14px'
              smMarginBottom='16px'
              color={COLORS[colorMode].mainTextColor}
            />
          }
          {
            collectionData &&
            <SpecCollectionStats
              items={collectionData && collectionData.prices}
            />
          }
          {/* {
            isMobile &&
            <FlexBox alignItems='center' smDirection='row' width='default' smMarginTop='16.5px' smPaddingLeft='16px'>
              <CustomText
                text={`Policy ID:&nbsp;`}
                fontFamily='Open Sans'
                fontSize='21px'
                fontWeight='700'
                color='#6073f6'
                className='text-nowrap'
                smFontSize='14px'
                smMaxWidth='179px'
              />
              <CopyBoard
                addr={collectionData && collectionData.policyId}
              // maxWidth='200px'

              />
            </FlexBox>
          } */}
          <FlexBox marginTop='21px' smDirection='row' gap="20px" justifyContent='start' alignItems='center' marginBottom='20px'>
            {
              activeTab === "NFTs" && !isMobile &&
              <CustomImage
                image={FILTER_ICON}
                width='22.5px'
                height='17.5px'
                onClick={() => setIsFilter(!isFilter)}
                cursor='pointer'
              />
            }


            <FlexBox
              smDirection='column'
              smGap='16px'
              justifyContent='start'
              gap='20px'
              alignItems='center'
            // marginBottom='32px'
            >
              <FlexBox
                smDirection='row' justifyContent='start'
                gap="12px"
                padding='6px'
                borderRadius='3px'
                border='2px solid #8896F8' width='default'
                smPadding='6px'
                smWidth='100%'
              >
                {
                  tabData.map((tab, j) => {
                    return (
                      <SearchFilterTab
                        active={tab === activeTab}
                        onClick={() => setActiveTab(tab)}
                        colorMode={colorMode}
                      >
                        {tab}
                      </SearchFilterTab>
                    )

                  })
                }
              </FlexBox>
              <FlexBox width='440px' smWidth='100%' smDirection='row' smGap='16px' alignItems='center'>
                {
                  activeTab === "Offers"
                    ?
                    <CustomButton text="Make Collection Offer" width='310px' height='42px' fontSize='15px' />
                    :
                    <CustomSearchInput
                      input={search}
                      setInput={setSearch}
                      placeholder='Search NFTs'
                      maxWidth='440px'
                    />
                }

                {
                  isMobile &&
                  <>
                    <CustomImage
                      image={FILTER_ICON}
                      width='22.5px'
                      height='17.5px'
                      onClick={() => setIsFilter(!isFilter)}
                      cursor='pointer'
                    />
                  </>
                }
              </FlexBox>
            </FlexBox>


          </FlexBox>

          {
            activeTab === "NFTs" &&
            <NFTsInfo
              isFilter={isFilter}
              setIsFilter={setIsFilter}
              commonNFTs={commonNFTs}
              listedNFTs={listedNFTs}
              search={search}
            />
          }
          {
            activeTab === "Offers" &&
            <OfferTable />
          }
          {
            activeTab === "Sales" &&
            <SalesInfo />
          }
        </FlexBox>
      </Container>
    </PageWrapper>
  )
}

export default SpecCollection