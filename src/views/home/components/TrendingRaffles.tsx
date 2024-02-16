
import { FlexBox } from '@/components/common/FlexBox';
import CustomRouterLinkButton from '@/components/common/CustomRouterLinkButton';
import RaffleCard from '@/components/card/RaffleCard';
import { useGlobalContext } from '@/context/GlobalContext';
import RaffleDetailModal from '@/components/modal/RaffleDetailModal';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLORS } from '@/constants/colors.constants';
import { getActiveRaffles } from '@/api/raffle';

const restrictedRaffles = [
  "00000000000000000000000100011698685912702",
  "000000000000000000000000000100011698742825243"
]
interface IProps {
  color?: string;
}
const TrendingRafflesText = styled.div<IProps>`
  color: ${(props: any) => COLORS[props.color].mainTextColor};
  font-family: Inconsolata;
  font-size: 33px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 39.6px */
  letter-spacing: -0.825px;
  @media screen and (max-width: 768px) {
    font-size: 25px;
    letter-spacing: -1px;
  }
`

const TrendingRaffles = () => {
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
  const [raffleDetailData, setRaffleDetailData] = useState({})
  const [trendingRaffles, setTrendingRaffles] = useState<any>()
  const { raffleData, featuredRaffles, floorPriceList, colorMode } = useGlobalContext()

  useEffect(() => {
    getTrendingRaffles()
  }, [])

  const getTrendingRaffles = async () => {
    const raffles = await getActiveRaffles()
    console.log("raffles", raffles)
    // Convert the object into an array of entries
    const rafflesArray = Object.entries(raffles);

    // Sort the array based on the "tickets" number
    rafflesArray.sort((a: any, b: any) => b[1].tickets - a[1].tickets);

    // Convert the sorted array back into an object
    const sortedRaffles = Object.fromEntries(rafflesArray);
    setTrendingRaffles(sortedRaffles)
    console.log("sortedRaffles", sortedRaffles);
  }

  return (
    <FlexBox direction='column' gap="32px" smGap='14px'>
      <FlexBox smDirection='row' justifyContent='space-between' alignItems='center' smJustifyContent='space-between'>
        <TrendingRafflesText color={colorMode && colorMode}>
          Trending Raffles
        </TrendingRafflesText>

        <CustomRouterLinkButton
          text="View All"
          link="/raffle"
          fontFamily={`Open Sans`}
          fontSize='17px'
          lineHeight='130%'
          fontWeight='600'
          color='#6073F6'
          width='auto'
          padding='8px 16px'
          smWidth='93px'
        />
      </FlexBox>
      <FlexBox flexWrap='wrap' gap="40px 30px" smAlignItems='center'
        smJustifyContent='center' smGap='10px' smDirection='row'
      >
        {
          trendingRaffles && Object.values(trendingRaffles).length > 0 && Object.values(trendingRaffles).map((item: any, index: number) => {
            if (!restrictedRaffles.includes(item.id)) {
              return (
                <RaffleCard
                  item={
                    item
                  }
                  onClick={() => {
                    setRaffleDetailData(item);
                    setShowDetailModal(true);
                  }}

                  key={index}
                // floorPrice={floorPriceList[item.uniqueid] ? floorPriceList[item.uniqueid].floorprice : -1}
                />
              );
            }

          })
        }
      </FlexBox>
      {
        showDetailModal &&
        <RaffleDetailModal
          show={showDetailModal}
          onClose={() => { setShowDetailModal(false) }}
          raffleDetailData={raffleDetailData}
        />
      }
    </FlexBox>
  )
}

export default TrendingRaffles