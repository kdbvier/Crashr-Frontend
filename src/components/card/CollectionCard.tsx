import CustomImage from '@/components/common/CustomImage'
import { FlexBox } from '@/components/common/FlexBox'
import { COLORS } from '@/constants/colors.constants'
import { VERIFIED_ICON_IMAGE } from '@/constants/image.constants'
import { useGlobalContext } from '@/context/GlobalContext'
import Link from 'next/link'
import styled from 'styled-components'

interface CollectionCardProps {
  hero: string;
  name: string;
  policyId: string;
}

const CollectionCardStyle = styled(Link)`
  border-radius: 3px;
  background-color: white;
  cursor: pointer;
  transition: transform .1s;
  text-decoration: none;
  max-width: 240px;
  width: 100%;
  &:hover {
    -ms-transform: scale(1.02); /* IE 9 */
    -webkit-transform: scale(1.02); /* Safari 3-8 */
    transform: scale(1.02); 
  }
  @media screen and (max-width: 768px) {
    max-width: 156px;
    width: 100%;
  }
`

const CollectionName = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 175px;
  width: 100%;
  font-family: Inconsolata;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 25.2px */
  letter-spacing: -0.525px;
  @media screen and (max-width: 768px) {
    display: flex;
    -webkit-line-clamp: 1;
    white-space: nowrap;
    overflow: hidden!important;
    text-overflow: ellipsis;
    max-width: 120px;
    display: block;
    font-size: 16px;
    letter-spacing: -0.3px;
  }
`

const CollectionCard = ({
  hero, name, policyId
}: CollectionCardProps) => {
  const { colorMode } = useGlobalContext()
  return (
    <CollectionCardStyle href={"/collections/" + policyId}>
      <CustomImage
        srcset={hero}
        width='240px'
        height='240px'
        borderRadius='3px 3px 0px 0px'
        smWidth='156px'
        smHeight='156px'
      />
      <FlexBox
        padding='12px 24px'
        gap='6px'
        bgColor={colorMode === 'light' ? 'white' : '#414040'}
        borderRadius='0px 0px 3px 3px'
        maxWidth='240px'
        height='58px'
        alignItems='center'
        smDirection='row'
        smHeight='41px'
        smPadding='12px 10px'
        color={COLORS[colorMode].mainTextColor}
      >
        <CollectionName>
          {name}
        </CollectionName>

        <CustomImage
          image={VERIFIED_ICON_IMAGE}
          width='20.4px'
          height='19.5px'
          smWidth='13.6px'
          smHeight='13px'
        />
      </FlexBox>
    </CollectionCardStyle >
  )
}

export default CollectionCard