import HeaderBanner from '@/components/HeaderBanner'
import CollectionCard from '@/components/card/CollectionCard'
import CustomImage from '@/components/common/CustomImage'
import CustomSearchInput from '@/components/common/CustomSearchInput'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { H2 } from '@/components/typography'
import { BLACK_DOWN_ICON, BLACK_UP_ICON, DOWN_FILTER_ICON_IMAGE, FILTER_ICON, MARKETPLACE_HEADER_IMAGE, UP_FILTER_ICON_IMAGE } from '@/constants/image.constants'
import VERIFIED_COLLECTIONS from '@/constants/verified.collections.constant'
import { Container, PageWrapper } from '@/styles/GlobalStyles'
import { useState, useEffect } from "react";
import { useMedia } from 'react-use'
import { COLLECTION_FILTERS } from '@/constants/collection_filter.constant'
import { useGlobalContext } from '@/context/GlobalContext'
import { COLORS } from '@/constants/colors.constants'
import BackButton from '@/components/button/BackButton'


const AllCollections = () => {
  const [isFilter, setIsFilter] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [activeShowingData, setActiveShowingData] = useState()
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { colorMode } = useGlobalContext()
  const isMobile = useMedia('(max-width: 768px)');

  useEffect(() => {
    const filteredCollectionData = Object.keys(VERIFIED_COLLECTIONS)
      .filter(key => {
        const item = VERIFIED_COLLECTIONS[key];
        return activeFilters.every(filter => item.category.includes(filter));
      })
      .reduce((obj: any, key: any) => {
        obj[key] = VERIFIED_COLLECTIONS[key];
        return obj;
      }, {});

    // filter collections showing according to search input
    let filtered_arr = Object.values(filteredCollectionData).filter((item: any) => item.name.toLowerCase().includes(search.toLocaleLowerCase()));

    // @ts-ignore
    setActiveShowingData(filtered_arr.slice(0, 120))
  }, [search, activeFilters])

  const handleCheckboxChange = (filterName: string) => {
    setActiveFilters(prevFilters => {
      // If the filterName is already in activeFilters, remove it; otherwise, add it
      return prevFilters.includes(filterName)
        ? prevFilters.filter(filter => filter !== filterName)
        : [...prevFilters, filterName];
    });
  };
  return (
    <PageWrapper colorMode={colorMode}>
      <HeaderBanner
        image={MARKETPLACE_HEADER_IMAGE}
      />

      <Container paddingTop='12px' smMarginTop='-30px'>
        <FlexBox direction='column'>
          <FlexBox smDirection='row' gap="16px" smGap='14px' alignItems='center' justifyContent='start'>
            <BackButton />
            <H2 color={COLORS[colorMode].mainTextColor}>
              All Collections
            </H2>
          </FlexBox>

          <FlexBox smDirection='row' gap="20px" justifyContent='start' marginTop='16px' smMarginTop='12px'>
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
                  <FlexBox
                    width='1.25px'
                    height='45px'
                    bgColor='#b2b2b2'
                  ></FlexBox>
                </>
              }

              <CustomSearchInput
                input={search}
                setInput={setSearch}
                placeholder='Search Collections'
                bgColor='#E5E5E5'
                boxShadow='none'
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

          </FlexBox>

          <FlexBox gap="20px" marginTop='24px'>
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
                smWidth='380px'
                smPadding='20px 20px 136px 20px'
              >
                <CustomSearchInput
                  input={filterSearch}
                  setInput={setFilterSearch}
                  placeholder='Search Categories'
                  bgColor={colorMode === 'light' ? '#e7e7e7' : '#767676'}
                />
                <FlexBox marginTop='24px' direction='column'>
                  {
                    COLLECTION_FILTERS.map((filter, index) => {
                      return (
                        <FlexBox direction='column' key={index}>
                          <FlexBox
                            padding='17.5px 20px'
                            justifyContent='space-between'
                            smDirection='row'
                            alignItems='center'
                            smPadding='14px 16px'
                            gap="15px"
                            smGap='12px'
                          >
                            <input type="checkbox"
                              name={filter}
                              checked={activeFilters.includes(filter)}
                              onChange={() => handleCheckboxChange(filter)}
                            />
                            <CustomText
                              fontSize='17px'
                              fontWeight='400'
                              fontFamily='Open Sans'
                              text={filter}
                              width='100%'
                            />

                          </FlexBox>

                        </FlexBox>
                      )
                    })
                  }
                </FlexBox>
              </FlexBox>
            }
            <FlexBox
              flexWrap='wrap'
              gap={isFilter ? "40px 62px" : "64px 30px"}
              justifyContent='center'
              smJustifyContent='center'
              smAlignItems='center'
              smGap='14px 29px'
              smDirection='row'
            >
              {
                // @ts-ignore
                activeShowingData && activeShowingData.map((collection, index: number) => {
                  return (
                    <CollectionCard
                      key={index}
                      hero={collection.image}
                      name={collection.name}
                      policyId={collection.id}
                    />
                  )
                })
              }
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </Container>
    </PageWrapper>
  )
}

export default AllCollections