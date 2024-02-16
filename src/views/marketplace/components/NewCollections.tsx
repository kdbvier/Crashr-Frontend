import NewCollectionCard from '@/components/card/NewCollectionCard'
import CustomRouterLinkButton from '@/components/common/CustomRouterLinkButton'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { COLORS } from '@/constants/colors.constants'
import { NEW_COLLETIONS_DATA } from '@/constants/new.collections'
import { useGlobalContext } from '@/context/GlobalContext'

const NewCollections = () => {
  const { colorMode } = useGlobalContext()
  return (
    <FlexBox direction='column' gap='37px' smGap='14px'>
      <FlexBox justifyContent='space-between' smDirection='row' smAlignItems='center' smJustifyContent='space-between'>
        <CustomText
          text={`New Collections`}
          fontSize='33px'
          fontFamily='700'
          letterSpacing='-0.825px'
          smFontSize='25px'
          color={COLORS[colorMode].mainTextColor}
        />
        <CustomRouterLinkButton
          text="View All"
          link="/collections"
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
          NEW_COLLETIONS_DATA.slice(0, 5).map((item, index) => {
            return (
              <NewCollectionCard
                key={index}
                hero={item.image}
                name={item.name}
                policyId={item.id}
              />
            )
          })
        }
      </FlexBox>
    </FlexBox>
  )
}

export default NewCollections