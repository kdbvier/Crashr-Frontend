import { FlexBox } from '@/components/common/FlexBox'
import React from 'react'
import styled from 'styled-components'

const Row = styled.div`
  &::after{
    content: "";
    clear: both;
    display: table;
  }
`


const TH = styled.th`
  font-family: Inconsolata;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 1.28px;
  text-transform: uppercase;
  color: #767676;
  text-align: left;
  width: 50%;
  padding: 10px 20px;
`

const TdOffer = styled.td`
  color: #000;

  /* 💻Desktop/Body base-semibold */
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  width: 50%;
  padding: 10px 20px;
`

const TdCount = styled.td`
  color: #000;

  /* 💻Desktop/Body base- Regular */
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: 50%;
  padding: 10px 20px;
`

const OfferTable = () => {
  return (
    <div>
      <table>
        <thead>
          <FlexBox width='483px'>
            <TH>OFFER</TH>
            <TH>COUNT</TH>
          </FlexBox>
        </thead>
        <tbody>
          <FlexBox width='483px' bgColor='white' borderBottom='#7a7a7a 1px solid'>
            <TdOffer>₳80 </TdOffer>
            <TdCount>1</TdCount>
          </FlexBox>
          <FlexBox width='483px' bgColor='white' borderBottom='#7a7a7a 1px solid'>
            <TdOffer>₳80 </TdOffer>
            <TdCount>1</TdCount>
          </FlexBox>
          <FlexBox width='483px' bgColor='white' borderBottom='#7a7a7a 1px solid'>
            <TdOffer>₳80 </TdOffer>
            <TdCount>1</TdCount>
          </FlexBox>
          <FlexBox width='483px' bgColor='white' borderBottom='#7a7a7a 1px solid'>
            <TdOffer>₳80 </TdOffer>
            <TdCount>1</TdCount>
          </FlexBox>
          <FlexBox width='483px' bgColor='white' borderBottom='#7a7a7a 1px solid'>
            <TdOffer>₳80 </TdOffer>
            <TdCount>1</TdCount>
          </FlexBox>
          <FlexBox width='483px' bgColor='white' borderBottom='#7a7a7a 1px solid'>
            <TdOffer>₳80 </TdOffer>
            <TdCount>1</TdCount>
          </FlexBox>

        </tbody>
      </table>
    </div>
  )
}

export default OfferTable