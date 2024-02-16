import HeaderBanner from '@/components/HeaderBanner'
import MarketListedNFTCard from '@/components/card/MarketListedNFTCard'
import CustomImage from '@/components/common/CustomImage'
import CustomInput from '@/components/common/CustomInput'
import CustomSearchInput from '@/components/common/CustomSearchInput'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { H2 } from '@/components/typography'
import { COLORS } from '@/constants/colors.constants'
import { BLACK_DOWN_ICON, BLACK_UP_ICON, DOWN_FILTER_ICON_IMAGE, FILTER_ICON, MARKETPLACE_HEADER_IMAGE, UP_FILTER_ICON_IMAGE } from '@/constants/image.constants'
import { useGlobalContext } from '@/context/GlobalContext'
import { useEffect, useState } from 'react'
import { useMedia } from 'react-use'
import { Container, PageWrapper } from '@/styles/GlobalStyles'
import SkeletonCard from '@/components/skeleton/SkeletonCard'
import BackButton from '@/components/button/BackButton'
const filterCategories: any = {
  "Price(Currency)": [
    {
      value: "0 to 100",
      tag: 100,
    },
    {
      value: "101 to 200",
      tag: 200,
    },
    {
      value: "201 to 300",
      tag: 300,
    },
    {
      value: "301 to 400",
      tag: 400,
    },
    {
      value: "401 to 500",
      tag: 500,
    }
  ],
  "Sale Type": [
    {
      value: "All NFTs",
      tag: "All NFTs",
    },
    {
      value: "For Sales",
      tag: "For Sales",
    },
    {
      value: "Bundles",
      tag: "Bundles",
    }
  ],
  "Collection": [

  ]
}

const AllNFTs = () => {
  const [isFilter, setIsFilter] = useState<boolean>(false)
  const [filteredNFTs, setFilteredNFTs] = useState<any[]>()
  const [subFiltersOpen, setSubFiltersOpen] = useState<boolean[]>(
    [false, false, false]
  )
  const [search, setSearch] = useState<string>('');
  const [search2, setSearch2] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true)

  const { listedAllNFTs, colorMode } = useGlobalContext();

  const isMobile = useMedia('(max-width: 768px)');

  useEffect(() => {
    if (listedAllNFTs && Object.values(listedAllNFTs).length > 0) {
      let dataArray = Object.values(listedAllNFTs);
      dataArray.sort((a, b) => parseInt(a.amount) - parseInt(b.amount));
      setFilteredNFTs(dataArray)
      setLoading(false)
    }
  }, [listedAllNFTs])

  return (
    <>

      <PageWrapper colorMode={colorMode}>
        <HeaderBanner
          image={MARKETPLACE_HEADER_IMAGE}
        />
        <Container paddingTop='12px' smMarginTop='-30px'>
          <FlexBox direction='column' gap='32px' smGap='16px'>
            <FlexBox smDirection='row' gap="16px" smGap='14px' alignItems='center' justifyContent='start' smJustifyContent='start'>
              <BackButton />
              <H2 color={COLORS[colorMode].mainTextColor}>
                All NFTs
              </H2>
            </FlexBox>
            <FlexBox
              borderRadius='6px'
              bgColor='#e5e5e5'
              alignItems='center'
              justifyContent='start'
              boxShadow='0px 2px 9px -4px rgba(0, 0, 0, 0.19)'
              maxWidth='500px'
              padding='10px 17.5px'
              smPadding='8px 14px'
              gap='12px'
              smDirection='row'
              smGap='8px'
            >
              {
                !isMobile &&
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
              <CustomSearchInput
                input={search}
                setInput={setSearch}
                placeholder='Search NFTs'
                bgColor='#E5E5E5'
                boxShadow='none'
                maxWidth='100%'
              />
              {
                isMobile &&
                <>
                  <FlexBox
                    maxWidth='1px'
                    height='35px'
                    bgColor='#b2b2b2'
                  ></FlexBox>
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

            <FlexBox gap="20px" smPosition='relative'>
              {
                isFilter &&
                <FlexBox
                  bgColor={colorMode === 'light' ? '#f3f3f3' : '#4f4f4f'}
                  borderRadius='8px'
                  // border="1px solid #9E9E9E"
                  width='340px'
                  padding='20px 20px 20px 20px'
                  direction='column'
                  justifyContent='start'
                  smWidth='320px'
                  smPadding='20px 20px 136px 20px'
                  // smPosition='absolute'
                  zIndex={1002}
                // smMarginTop='-700px'
                >
                  <CustomSearchInput
                    input={search2}
                    setInput={setSearch2}
                    placeholder='Search Collection'
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
                                      text={item.value}
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
                <FlexBox
                  flexWrap='wrap'
                  gap={`64px ${isFilter ? '70px' : '30px'}`}
                  justifyContent='center'
                  alignItems='center'
                  smDirection='row'
                  smJustifyContent='center'
                  smAlignItems='center'
                  smGap='22px'
                  smMarginTop='10px 22px'
                >
                  {
                    loading
                      ?
                      (
                        [1, 2, 3, 4, 5].map((item) => (
                          <SkeletonCard />
                        ))
                      )
                      :
                      <>
                        {
                          filteredNFTs && filteredNFTs.map((nft, index) => {
                            const isBundle = Object.values(nft.nfts).length > 1 ? true : false;
                            return (
                              <MarketListedNFTCard
                                key={index}
                                isBundle={isBundle}
                                isListed={true}
                                data={nft}
                                search={search}
                              />
                            );
                          })
                        }
                      </>
                  }

                </FlexBox>
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </Container>
      </PageWrapper>
    </>
  )
}

export default AllNFTs