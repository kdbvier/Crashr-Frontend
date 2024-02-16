import { COLORS } from "@/constants/colors.constants";
import Link from 'next/link'
import styled from "styled-components";
import { device } from "@/styles/Breakpoints";

export const TopCollectionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  /* max-height: 738px; */
  @media screen and (max-width: 550px) {
    gap: 4px;
  }
`

interface ITopCollectionRow {
  colorMode?: string;
}

export const TopCollectionRow = styled(Link) <ITopCollectionRow>`
  max-width: 640px;
  width: 100%;
  background-color: ${props => props.colorMode === 'light' ? '#f1f1f1' : '#363636'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  text-decoration: none;
  color: ${props => props.colorMode && COLORS[props.colorMode].mainTextColor};
  padding: 12px 20px;
  
  &:hover{
    background-color: ${props => props.colorMode === 'light' ? '#dddddd' : '#444444'};
    cursor: pointer;
  }
  @media screen and (max-width: 860px) {
    padding: 6px 12px;
  }
  @media screen and (max-width: 550px) {
    padding: 4px 8px;
  }

  div:nth-child(2){
    padding: 0px 9px;
    width: 5%;
    /* 🖥️Desktop/Caption/Caption3 */
    font-family: Open Sans;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
    @media screen and (max-width: 550px) {
      padding: 0px 4px;
      width: 10%;
    }
  }
  div:nth-child(1){
    padding: 0px 9px;
    width: 15%;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 550px) {
      padding: 0px 4px;
    }
    img{
      width: 42px;
      height: 42px;
      border-radius: 3px;
    }
    @media screen and (max-width: 860px) {
      img{
        width: 60px;
        height: 60px;
      }
    }
    @media screen and (max-width: 550px) {
      img{
        width: 40px;
        height: 40px;
      }
    }
  }
  div:nth-child(3){
    padding: 0px 9px;
    max-width: 35%;
    width: 100%;
    white-space: nowrap;
    overflow: hidden!important;
    text-overflow: ellipsis;

    font-family: Inconsolata;
    font-size: 21px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 25.2px */
    letter-spacing: -0.525px;
    
    @media screen and (max-width: 860px) {
      font-size: 18px;
    }
    @media screen and (max-width: 550px) {
      font-size: 14px;
      padding: 0px 4px;
    }
  }
  div:nth-child(4){
    padding: 0px 9px;
    width: 15%;
    display: flex;
    flex-direction: column;
    
    gap: 3px;
    @media screen and (max-width: 550px) {
      padding: 0px 4px;
      width: 20%;
    }
    p:nth-child(1){
      font-family: Open Sans;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: 120%; 
      width: 100%;
      text-align: center;
      text-wrap: nowrap;
      @media screen and (max-width: 860px) {
        font-size: 16px;
      }
      @media screen and (max-width: 550px) {
        font-size: 12px;
      }
    }
    p:nth-child(2){
      font-family: Open Sans;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: 120%; 
      width: 100%;
      text-align: center;
      color: #FE6126;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
      &.active{
        color: #40A140;
      }
      @media screen and (max-width: 860px) {
        font-size: 14px;
      }
      @media screen and (max-width: 550px) {
        font-size: 11px;
      }
    }
  }
  div:nth-child(5){
    padding: 0px 9px;
    width: 15%;
    display: flex;
    flex-direction: column;
    
    gap: 3px;
    @media screen and (max-width: 550px) {
      padding: 0px 4px;
      width: 20%;
    }
    p:nth-child(1){
      font-family: Open Sans;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: 120%; 
      width: 100%;
      text-align: center;
      text-wrap: nowrap;
      @media screen and (max-width: 860px) {
        font-size: 16px;
      }
      @media screen and (max-width: 550px) {
        font-size: 12px;
      }
    }
    p:nth-child(2){
      font-family: Open Sans;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: 120%; 
      width: 100%;
      text-align: center;
      color: #FE6126;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
      &.active{
        color: #40A140;
      }
      @media screen and (max-width: 860px) {
        font-size: 14px;
      }
      @media screen and (max-width: 550px) {
        font-size: 11px;
      }
    }
  }
  div:nth-child(6){
    padding: 0px 9px;
    width: 15%;
    display: flex;
    flex-direction: column;
    
    gap: 3px;
    @media screen and (max-width: 550px) {
      padding: 0px 4px;
      width: 20%;
    }
    p:nth-child(1){
      font-family: Open Sans;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: 120%; 
      width: 100%;
      text-align: center;
      text-wrap: nowrap;
      @media screen and (max-width: 860px) {
        font-size: 16px;
      }
      @media screen and (max-width: 550px) {
        font-size: 12px;
      }
    }
    p:nth-child(2){
      font-family: Open Sans;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: 120%; 
      width: 100%;
      text-align: center;
      color: #FE6126;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
      &.active{
        color: #40A140;
      }
      @media screen and (max-width: 860px) {
        font-size: 14px;
      }
      @media screen and (max-width: 550px) {
        font-size: 11px;
      }
    }
  }
  
`;

interface MarketPercentType {
  up?: boolean;
}
export const MarketPercent = styled.div<MarketPercentType>`
  color: ${(props) => props.up ? '#40a140' : '#fe6126'};
  font-family: 'Open Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

export const CollectionTableHeader = styled.div`
  display: flex;
  font-family: Inconsolata;
  font-size: 17px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 20.4px */
  letter-spacing: 0.17px;
  text-transform: uppercase;
  max-width: 640px;
  color: #808080;
  width: 100%;
  padding: 0px 20px;
  @media screen and (max-width: 860px) {
    padding: 6px 12px;
    font-size: 16px;
  }
  @media screen and (max-width: 550px) {
    padding: 4px 8px;
    font-size: 12px;
    letter-spacing: 0.96px;
  }
  div:nth-child(2){
    padding: 0px 9px;
    width: 5%;
    @media screen and (max-width: 550px) {
      width: 10%;
      padding: 0px 4px;
    }
  }
  div:nth-child(1){
    padding: 0px 9px;
    width: 15%;
    @media screen and (max-width: 550px) {
      padding: 0px 4px;
    }    
  }
  div:nth-child(3){
    padding: 0px 9px;
    width: 35%;
    @media screen and (max-width: 550px) {
      padding: 0px 4px;
    }
  }
  div:nth-child(4){
    padding: 0px 9px;
    width: 15%;
    text-align: center;
    @media screen and (max-width: 550px) {
      width: 20%;
      padding: 0px 4px;
    }
  }
  div:nth-child(5){
    padding: 0px 9px;
    width: 15%;
    text-align: center;
    @media screen and (max-width: 550px) {
      width: 20%;
      padding: 0px 4px;
    }
  }
  div:nth-child(6){
    padding: 0px 9px;
    width: 15%;
    text-align: center;

  }
`

interface TimeTabProps {
  active: boolean;
  colorMode?: string;
}
export const TimeTab = styled.div<TimeTabProps>`
  color: ${props => props.active ? 'white' : 'black'};
  text-align: center;
  justify-content: center;
  font-family: Open Sans;
  line-height: 130%;
  font-size: 17px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  width: 68px;
  height: 44px;
  display: flex;
  align-items: center;
  border-radius: 3px;
  background-color: ${props => props.active ? (props.colorMode === 'light' ? '#AFB9FB' : '#4856b9') : '#D7DCFD'};
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  @media ${device.sm} {
    font-size: 15px;
    border-radius: 3px;
    width: 25%;
    height: 34px;
  }
`