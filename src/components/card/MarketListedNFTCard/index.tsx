import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { BundleBadge, ListedBadge, MarketListedNFTCardStyle } from './index.styled'
import { useCallback, useEffect, useState } from 'react'
import { getNFTDetailByAsset } from '@/api/api'
import { getExactImageFormat } from '@/hooks/function'
import { EXCEPTIONAL_NFT_ASSETS } from '@/constants/assets.constants'
import { useGlobalContext } from '@/context/GlobalContext'
import { COLORS } from '@/constants/colors.constants'

const placeholderImage = `https://imagesstorag.s3.eu-west-2.amazonaws.com/default_collection.png`

const MarketListedNFTCard = ({
  data,
  isBundle,
  isListed,
  search
}: MarketListedNFTCardType) => {
  const [listedNFTs, setListedNFTs] = useState<NFTDataProps[]>()
  const [activeNFT, setActiveNFT] = useState<number>(0)
  const [show, setShow] = useState<boolean>(true)
  const [isHover, setIsHover] = useState(false)

  const { colorMode } = useGlobalContext()

  useEffect(() => {
    if (listedNFTs && listedNFTs.length > 0) {
      const names = listedNFTs.map((item) => item.name);


      let namesWithoutHash = names.map(function (text) {
        return text.replace(/#/g, '');
      });
      if (!search) return;
      const result = names.some(element => element.toLowerCase().includes(search.toLowerCase())) || namesWithoutHash.some(element => element.toLowerCase().includes(search.toLowerCase()));

      if (result) {
        setShow(true)
      } else {
        setShow(false)
      }
    }
  }, [search, listedNFTs])


  useEffect(() => {
    getNFTData()
  }, [])

  useEffect(() => {
    // in case of bundle nfts, change display nft name image every second
    if (listedNFTs && listedNFTs.length > 1) {
      const interval = setInterval(() => {
        // Move to the next nft
        setActiveNFT((nft) => (nft + 1) % listedNFTs.length);
      }, 500); // Change slides every 1 (adjust as needed)

      return () => {
        // Cleanup the interval when the component unmounts
        clearInterval(interval);
      };
    }
  }, [listedNFTs])


  const onImageError = (e: any) => {
    e.target.src = placeholderImage
  }

  // get nfts data from their asset
  const getNFTData = useCallback(async () => {
    const assetKeys = Object.keys(data.nfts);

    // Map asset keys to an array of promises
    const nftPromises = assetKeys.map(async (assetKey) => {
      const response = await getNFTDetailByAsset(assetKey);
      return {
        name: response.onchain_metadata ? (response.onchain_metadata.name ? response.onchain_metadata.name : EXCEPTIONAL_NFT_ASSETS[response.asset].name) : EXCEPTIONAL_NFT_ASSETS[response.asset].name,
        asset: response.asset,
        image: response.onchain_metadata.image
      };
    });

    // Use Promise.all to await all responses
    const nfts = await Promise.all(nftPromises);
    console.log("nfts", nfts)

    setListedNFTs(nfts);
  }, [data]);


  return (
    <>
      {
        !show
          ?
          <></>
          :
          <MarketListedNFTCardStyle href={`/nfts/${Object.keys(data.nfts)[0]}`}>
            {
              isListed &&
              <ListedBadge>Listed</ListedBadge>
            }
            {
              isBundle &&
              <BundleBadge>Bundle of {Object.keys(data.nfts).length}</BundleBadge>
            }
            <div className="image-container">
              {/* <div className='image-wrapper'> */}
              <img
                className={"image-raffle"}
                src=
                {listedNFTs && getExactImageFormat(listedNFTs[activeNFT].image) ? getExactImageFormat(listedNFTs[activeNFT].image) : placeholderImage}

                alt="img-raffle"
                onMouseEnter={() => {
                  setIsHover(true)
                }}
                onMouseLeave={() => {
                  setIsHover(false)
                }}
                onError={onImageError}
              />
              {/* </div> */}
            </div>
            {/* <CustomImage
              image={listedNFTs && getExactImageFormat(listedNFTs[activeNFT].image)}
              width='240px'
              height='240px'
              smWidth='172px'
              smHeight='172px'
              borderRadius='3px 3px 0px 0px'
              hoverScale='scale(1.1)'
            /> */}
            <FlexBox
              bgColor={
                colorMode === "light" ? 'white' : '#3f3f3f'
              }
              borderRadius='0px 0px 3px 3px'
              padding='10px 20px'
              direction='column'
              alignItems='center'
              gap='4px'
              width='240px'
              height='74px'
              smWidth='172px'
              smHeight='68px'
              smGap='4px'
            >
              <CustomText
                text={listedNFTs && listedNFTs[0].name ? listedNFTs[activeNFT].name : ''}
                fontSize='21px'
                fontWeight='700'
                maxWidth='200px'
                lineHeight='120%'
                letterSpacing='-0.525px'
                className='three-dots'
                display='block'
                smPadding='5px 12px'
                smFontSize='15px'
                smMaxWidth='139px'
                smDisplay='block'
                color={COLORS[colorMode].mainTextColor}

              />
              <CustomText
                text={`₳${parseInt(data.amount) / 1000000}`}
                fontSize='21px'
                fontWeight='700'
                maxWidth='200px'
                lineHeight='120%'
                letterSpacing='-0.525px'
                className='three-dots'
                display='block'
                smPadding='5px 12px'
                smFontSize='15px'
                smMaxWidth='139px'
                smDisplay='block'
                color='#6073F6'
              />
            </FlexBox>
          </MarketListedNFTCardStyle>
      }
    </>
  )
}

export default MarketListedNFTCard