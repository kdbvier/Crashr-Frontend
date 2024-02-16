import Link from "next/link";
import styled from "styled-components";

const NFTImageCardComp = styled.div`
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 2.4px;
  @media screen and (max-width: 768px) {
    width: 76px;
    height: 76px;
  }
`

const ListedBadge = styled.div`
  position: absolute;
  right: 0px;
  z-index: 10;
  top: 12px;
  background: #8896f8;
  width: 70px;
  height: 22px;
  font-size: 16px;
  color: white;
  font-weight: 600;
  font-family: 'Open Sans';
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Open Sans';
`

interface IModalTitle {
  color?: string;
}
const ModalTitle = styled.div<IModalTitle>`
  font-family: Inconsolata;
  font-size: 41px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 49.2px */
  letter-spacing: -1.025px;
  color: ${(props) => props.color && props.color};
  @media screen and (max-width: 768px) {
    font-size: 33px;
    letter-spacing: -0.66px;
  }
`

interface IModalNote {
  color?: string;
}
const ModalNote = styled.div<IModalNote>`
  font-family: Open Sans;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; 
  color: ${(props) => props.color && props.color};
  @media screen and (max-width: 768px) {
    font-size: 13px;
  }
`

interface IItemLength {
  color?: string;
}
const ItemLength = styled.div<IItemLength>`
  font-family: Open Sans;
  font-size: 17px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; 
  margin-bottom: 16px;
  color: ${(props) => props.color && props.color};
  @media screen and (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 12px;
  }
`

interface INFTImage {
  color?: string;
}
const NFTImage = styled.img<INFTImage>`
  width: 90px;
  height: 90px;
  border-radius: 2.4px;
  color: ${(props) => props.color && props.color};
  @media screen and (max-width: 768px) {
    width: 76px;
    height: 76px;
  }
`

interface ICollectionName {
  color?: string;
}
const CollectionName = styled(Link) <ICollectionName>`
  font-family: Open Sans;
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; 
  max-width: 170px;
  /* width: 100%; */
  white-space: nowrap;
  overflow: hidden!important;
  text-overflow: ellipsis;
  text-decoration: none;
  color: ${(props) => props.color && props.color};
  &:hover{
    color: #e75737;
  }
  strong{
    font-weight: 700;
  }
  @media screen and (max-width: 768px) {
    font-size: 15px;
    max-width: 100px;
    /* width: 100%; */
  }
`

interface INFTName {
  color?: string;
}
const NFTName = styled(Link) <INFTName>`
  font-family: Open Sans;
  font-size: 17px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; 
  max-width: 310px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden!important;
  text-overflow: ellipsis;
  text-decoration: none;
  color: ${(props) => props.color && props.color};
  &:hover{
    color: #e75737;
  }
  strong{
    font-weight: 700;
  }
  @media screen and (max-width: 768px) {
    font-size: 15px;
    max-width: 170px;
    width: 100%;
  }
`

const NFTContentsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 300px;
  width: 100%;
  @media screen and (max-width: 768px) {
    max-width: 120px;
  }
`

const BadgeIcon = styled.img`
  width: 22px;
  height: 21px;
  @media screen and (max-width: 768px) {
    width: 16px;
    height: 16px;
  }
`

interface INFTPrice {
  color?: string;
}
const NFTPrice = styled.div<INFTPrice>`
  font-family: Open Sans;
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; 
  color: ${(props) => props.color && props.color};
  
  @media screen and (max-width: 768px) {
    font-size: 17px;
  } 
`

const ScrollFlex = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 23px;
  max-height: 350px;
  overflow: auto;
  margin-bottom: 36px;
  &::-webkit-scrollbar {
    width: 10px; /* set width of scrollbar */
    height: 150px;
  }
  
  &::-webkit-scrollbar-track {
    background:none; /* set background color of track */
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #9e9e9e; /* set background color of thumb */
    border-radius: 6px; /* set border radius of thumb */
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* set background color of thumb on hover */
  }
`

const RemoveButton = styled.div`
    color: #fe6126;
    text-align: right;
    width: 100%;
    font-family: Open Sans;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    cursor: pointer;
    text-decoration: underline;
    &:hover{
        color: #a71717;
    }
`

export {
  ModalTitle,
  ModalNote,
  ItemLength,
  NFTImage,
  NFTName,
  CollectionName,
  NFTContentsGroup,
  BadgeIcon,
  NFTPrice,
  ScrollFlex,
  RemoveButton,
  ListedBadge,
  NFTImageCardComp
}