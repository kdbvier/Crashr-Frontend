import { getRaffleFloorPrice } from '@/api/raffle'
import CustomText from '@/components/common/CustomText'
import CustomTextLink from '@/components/common/CustomTextLink'
import { FlexBox } from '@/components/common/FlexBox'
import { COLORS } from '@/constants/colors.constants'
import { useGlobalContext } from '@/context/GlobalContext'
import { getExactImageFormat, getExactTokenAmount, getExactTokenSymbolValue, outputEndTimeByTimestamp } from '@/hooks/function'
import { useEffect, useState } from 'react'
import { useMedia } from 'react-use'

import styled from 'styled-components'
import { device } from '@/styles/Breakpoints'

const RaffleCardStyle = styled.div`
  border-radius: 3px;
  max-width: 240px;
  width: 100%;  
  background-color: rgba(255, 255, 255, 0.58);
  cursor: pointer;
  position: relative;
  @media ${device.sm} {
    max-width: 156px;
    width: 100%;
  }
`
interface RaffleCardType {
  item?: any;
  onClick?: any;
  floorPrice?: number;
  featured?: boolean;
  winRaffles?: any;
  active?: number;
}


const ADABadge = styled.div`
  position: absolute;
  right: 0px;
  z-index: 10;
  top:32px;
  background: linear-gradient(102deg, rgba(255, 255, 255, 0.58) 3.82%, rgba(255, 255, 255, 0.70) 96.56%);
  width: 143px;
  height: 37px;
  font-size: 21px;
  color: black;
  font-weight: 600;
  font-family: 'Open Sans';
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const RaffleImage = styled.img`
  width: 240px;
  height: 240px;
  border-radius: 3px 3px 0 0;
  @media ${device.sm} {
    width: 156px;
    height: 156px;
  }
`

const RaffleCard = ({ item, onClick, featured, winRaffles, active }: RaffleCardType) => {
  const isMobile = useMedia('(max-width: 768px)');
  const [floorPrice, setFloorPrice] = useState<number>()
  const { colorMode } = useGlobalContext()

  useEffect(() => {
    if (item && item.assets) {
      getFloorPrice()
    }
  }, [item])
  const getFloorPrice = async () => {
    const sum = await getRaffleFloorPrice(item.assets)
    setFloorPrice(sum)
  }
  return (

    <RaffleCardStyle onClick={onClick}>
      {
        !isMobile &&
        <ADABadge>
          {
            // @ts-ignore
            item && getExactTokenSymbolValue(item.tokenName, getExactTokenAmount(parseInt(item.price), item.tokenName))
          }
        </ADABadge>
      }

      <RaffleImage
        src={
          // @ts-ignore
          getExactImageFormat(item?.image)}
        alt={
          // @ts-ignoreF
          `image${item?.name}`
        }

      />

      <FlexBox
        bgColor={colorMode === 'light' ? '#F7efef' : '#3f3f3f'}
        padding='12px 24px'
        borderRadius='0px 0px 3px 3px'
        direction='column'
        alignItems='center'
        justifyContent='center'
        gap="4px"
        smPadding='8px 10px'
        smWidth='156px'
      >
        <CustomText
          color={COLORS[colorMode].mainTextColor}
          fontSize='21px'
          fontWeight='700'
          fontFamily='Inconsolata'
          smFontSize='19px'
          smDisplay='block'
          smMaxWidth='134px'
          className='three-dots'

          text={
            // @ts-ignore
            item && item.name ? item.name : "Undefined"
          }
        />
        {
          !isMobile &&
          <FlexBox
            smDirection='row'
            alignItems='center'
            fontSize='21px'
            fontWeight='400'
            height='21px'
          >
            <CustomText
              color={COLORS[colorMode].mainTextColor}
              fontSize='15px'
              fontWeight='600'
              lineHeight='120%'
              fontFamily='Open Sans'
              text={`Floor Price:&nbsp;`}
            />
            {
              floorPrice &&
              <CustomText
                color='#6073F6'
                fontSize='15px'
                fontWeight='600'
                lineHeight='120%'
                fontFamily='Open Sans'
                text={`₳` + (floorPrice ? floorPrice : 0)}
              />
            }
          </FlexBox>
        }
        {


          item && item.timestamp < new Date().getTime() && item.winner &&
          <CustomTextLink
            color='#FE6126'
            fontSize='15px'
            fontWeight='600'
            fontFamily='Open Sans'
            link={`/users/${item.winner}`}
            maxWidth='192px'
            className='three-dots'
            justifyContent='center'
            text={
              `Winner`
            }
            lineHeight='normal'
            smFontSize='12px'
            smLineHeight='15px'
          />
        }
        {/* {
          new Date().getTime()
        }
        <br />
        {
          item.timestamp
        }
        <br />
        {
          item.timestamp - new Date().getTime()
        } */}
        {
          item && ((parseInt(item.timestamp) + 60 * 5 * 1000) < new Date().getTime()) && !item.winner &&
          <CustomText
            color='#FE6126'
            fontSize='15px'
            fontWeight='600'
            fontFamily='Open Sans'
            maxWidth='192px'
            className='three-dots'
            justifyContent='center'
            text={
              `Refunded`
            }
            smFontSize='12px'
            smLineHeight='15px'
          />
        }
        {
          item && (parseInt(item.timestamp) < new Date().getTime()) && (new Date().getTime() < (parseInt(item.timestamp) + 60 * 5 * 1000)) && !item.winner &&
          <CustomText
            color='#F73737'
            fontSize='16px'
            fontWeight='600'
            fontFamily='Open Sans'
            maxWidth='192px'
            className='three-dots'
            justifyContent='center'
            text={
              `Processing`
            }
            smFontSize='12px'
            smLineHeight='15px'
          />
        }
        {item && (parseInt(item.timestamp) > new Date().getTime()) &&
          <CustomText
            color='#F73737'
            fontSize='16px'
            fontWeight='600'
            fontFamily='Open Sans'
            text={
              // @ts-ignore
              outputEndTimeByTimestamp(item.timestamp)
            }
            smFontSize='12px'
            smLineHeight='15px'
          />
        }
      </FlexBox>
    </RaffleCardStyle>
  )
}

export default RaffleCard