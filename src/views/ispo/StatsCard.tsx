import { FlexBox } from '@/components/common/FlexBox'
import React from 'react'
import styled from 'styled-components';

import { device } from '@/styles/Breakpoints';
interface IStatsCardProps {
  value: any;
  title: string;
}

const Value = styled.div`
  color: #272727;
  text-align: center;
  leading-trim: both;

  text-edge: cap;
  font-family: Inconsolata;
  font-size: 41px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 49.2px */
  letter-spacing: -1.025px;
  span{
    font-size: 40px;
  }
  @media ${device.sm} {
    font-size: 28px;
    letter-spacing: -0.42px;
    span{
      font-size: 20px;
    }
  }
`

const Title = styled.div`
  color: #272727;
  text-align: center;
  font-family: Open Sans;
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; 
  @media ${device.sm} {
    font-size: 14px;
  }
`
const StatsCard: React.FC<IStatsCardProps> = (props) => {
  const { value, title } = props;

  console.log("value", value)
  return (
    <FlexBox bgColor='#D7dcfd' maxWidth='234px' padding='0px 16px' alignItems='center' direction='column' gap='16px' boxShadow='0px 0px 4px 0px rgba(0, 0, 0, 0.25)' smWidth='160px' smHeight='92px' smGap='8px' height='128px'>
      <Value>{value}</Value>
      <Title>{title}</Title>
    </FlexBox>
  );
};


export default StatsCard