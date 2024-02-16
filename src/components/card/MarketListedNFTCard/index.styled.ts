import Link from 'next/link'
import styled from 'styled-components'
const MarketListedNFTCardStyle = styled(Link)`
  position: relative;
  border-radius: 3px;
  max-width: 240px;
  width: 100%;
  cursor: pointer;
  text-decoration: none;
  border-radius: 3px;
  .image-container {
    /* z-index: 1; */
    /* position: relative; */
    max-width: 240px; /* Adjust the width and height according to your needs */
    width: 100%;
    height: 240px;
    overflow: hidden;
  }

  .image-wrapper {
    max-width: 240px; /* Adjust the width and height according to your needs */
    width: 100%;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
  }

  .image-raffle {
    border-radius: 3px;
    -webkit-transition: -webkit-transform 3s;
    transition: transform 3s;
    max-width: 240px;
    width: 100%;
    max-height: 240px;
    height: 100%;

  }
  &:hover{
    .image-raffle{
      -webkit-transform: scale(1.5) rotate(0.01deg);
      transform: scale(1.5) rotate(0.01deg);
    }
  }
  @media screen and (max-width: 768px) {
    max-width: 172px;
    width: 100%;
    .image-wrapper {
      width: 172px;
      height: 172px;
    }
    .image-container {
      width: 172px;
      height: 172px;
    }
    .image-raffle{
      width: 172px;
      height: 172px;
    }
  }
`

const ListedBadge = styled.div`
  position: absolute;
  right: 0px;
  z-index: 10;
  top: 8px;
  background: #8896f8;
  width: 110px;
  height: 26px;
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

const BundleBadge = styled.div`
  position: absolute;
  right: 0px;
  z-index: 10;
  top: 34px;
  background: #afb9fa;
  width: 110px;
  height: 26px;
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

export {
  MarketListedNFTCardStyle,
  ListedBadge,
  BundleBadge
}