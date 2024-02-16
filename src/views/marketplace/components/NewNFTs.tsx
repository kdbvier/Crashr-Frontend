import MarketListedNFTCard from '@/components/card/MarketListedNFTCard'
import CustomRouterLinkButton from '@/components/common/CustomRouterLinkButton'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { COLORS } from '@/constants/colors.constants'
import { useGlobalContext } from '@/context/GlobalContext'

const NewNFTs = () => {
  const { listedAllNFTs, colorMode } = useGlobalContext();
  return (
    <FlexBox direction='column' gap='37px' smGap='14px'>
      <FlexBox justifyContent='space-between' smDirection='row' smAlignItems='center' smJustifyContent='space-between'>
        <CustomText
          text={`New NFTs`}
          fontSize='33px'
          fontFamily='700'
          letterSpacing='-0.825px'
          smFontSize='25px'
          color={COLORS[colorMode].mainTextColor}
        />
        <CustomRouterLinkButton
          text="View All"
          link="/nfts"
          fontFamily={`Open Sans`}
          fontSize='18px'
          fontWeight='600'
          color='#6073F6'
          maxWidth='default'
          width='default'
          smWidth='61px'
          smFontSize='16px'
        />
      </FlexBox>

      <FlexBox flexWrap='wrap' smDirection='row' gap='40px 30px' smGap='10px'>
        {
          listedAllNFTs && Object.values(listedAllNFTs).length > 0 && Object.values(listedAllNFTs).reverse().slice(0, 10).map((nft, index) => {
            const isBundle = Object.values(nft.nfts).length > 1 ? true : false;
            return (
              <MarketListedNFTCard
                key={index}
                isBundle={isBundle}
                isListed={true}
                data={nft}
                search=''
              />
            );
          })
        }
      </FlexBox>
    </FlexBox>
  )
}

export default NewNFTs