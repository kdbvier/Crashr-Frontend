import CustomImage from '@/components/common/CustomImage'
import { COLORS } from '@/constants/colors.constants'
import { VERIFIED_ICON_IMAGE } from '@/constants/image.constants'
import { useGlobalContext } from '@/context/GlobalContext'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'

const NewCollectionCardStyle = styled(Link)`
  border-radius: 3px;
  background-color: #f7f7f7;
  cursor: pointer;
  text-decoration: none;
  max-width: 240px;
  width: 100%;
  transition: 0.2s;
  &:hover {
    -ms-transform: scale(1.02); /* IE 9 */
    -webkit-transform: scale(1.02); /* Safari 3-8 */
    transform: scale(1.02); 
  }
  @media screen and (max-width: 550px) {
    max-width: 156px;
  }

`

const CollectionName = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
  font-size: 21px;
  font-weight: 700;
  font-family: Inconsolata;
  line-height: 120%; /* 25.2px */
  letter-spacing: -0.525px;
  @media screen and (max-width: 550px) {
    font-size: 15px;
    -webkit-line-clamp: 1;
    white-space: nowrap;
    overflow: hidden!important;
    text-overflow: ellipsis;
    max-width: 100px;
    display: block;
    letter-spacing: -0.3px;
  }
`

interface FlexProps {
  color?: string;
  bgColor?: string;
}

const CollectionTextFlex = styled.div<FlexProps>`
  display: flex;
  height: 79px;
  padding: 12px 24px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex: 1 0 0;
  color: ${props => props.color};
  background-color: ${props => props.bgColor};
  border-radius: 0px 0px 3px 3px;
  @media screen and (max-width: 550px) {
    width: 156px;
    padding: 10px;
    gap: 3px;
    height: 37px;
  }
`

interface CollectionCardProps {
  hero: string;
  name: string;
  policyId: string;
}

const NewCollectionCard = ({
  hero, name, policyId
}: CollectionCardProps) => {
  const { colorMode } = useGlobalContext()
  return (
    <NewCollectionCardStyle href={"/collections/" + policyId}>
      <CustomImage
        width='240px'
        height='240px'
        smWidth='156px'
        smHeight='156px'
        borderRadius='3px 3px 0px 0px'
        srcset={hero}
      />
      <CollectionTextFlex
        color={COLORS[colorMode].mainTextColor}
        bgColor={colorMode === 'light' ? 'white' : '#404040'}
      >
        <CollectionName>
          {name}
        </CollectionName>
        <CustomImage
          image={VERIFIED_ICON_IMAGE}
          width='20.426px'
          height='19.5px'
          smWidth='13.617px'
          smHeight='13px'
        />
      </CollectionTextFlex>
    </NewCollectionCardStyle>
  )
}

export default NewCollectionCard