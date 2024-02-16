import { FlexBox } from '@/components/common/FlexBox'
import { COLORS } from '@/constants/colors.constants';
import { useGlobalContext } from '@/context/GlobalContext';
import styled from 'styled-components';



const VerticalLine = styled.div`
  border-left: 1px solid #cecece;
  height: 64px;
  @media screen and (max-width: 768px) {
    height: 48px;
  }
`

const StatsSubject = styled.div`

  text-align: center;
  font-family: Open Sans;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`

const StatsValue = styled.div`
  text-align: center;
  font-family: Open Sans;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  @media screen and (max-width: 768px) {
    font-size: 16px;
  }
`

const SpecCollectionStats = ({ items }: any) => {
  console.log("items", items)
  const { colorMode } = useGlobalContext()
  return (
    <FlexBox smDirection='row' justifyContent='start' gap='16px' smGap='14px' smJustifyContent='center' color={COLORS[colorMode].mainTextColor}>
      <FlexBox direction='column' gap="10px" width='default' alignItems='center' color={COLORS[colorMode].mainTextColor}>
        <StatsSubject>Items</StatsSubject>
        <StatsValue>{items[4]}</StatsValue>
      </FlexBox>
      <VerticalLine />
      {/* <FlexBox direction='column' gap="10px" width='default' alignItems='center'>
        <StatsSubject>Best offer</StatsSubject>
        <StatsValue>{items[1]}</StatsValue>
      </FlexBox> */}
      {/* <VerticalLine /> */}
      <FlexBox direction='column' gap="10px" width='default' alignItems='center' color={COLORS[colorMode].mainTextColor}>
        <StatsSubject>Floor</StatsSubject>
        <StatsValue>{items[0]}</StatsValue>
      </FlexBox>
      <VerticalLine />
      <FlexBox direction='column' gap="10px" width='default' alignItems='center' color={COLORS[colorMode].mainTextColor}>
        <StatsSubject>Listed</StatsSubject>
        <StatsValue>{items[3]}</StatsValue>
      </FlexBox>
      <VerticalLine />
      <FlexBox direction='column' gap="10px" width='default' alignItems='center' color={COLORS[colorMode].mainTextColor}>
        <StatsSubject>Volume</StatsSubject>
        <StatsValue>{items[2]}</StatsValue>
      </FlexBox>
    </FlexBox>
  )
}

export default SpecCollectionStats