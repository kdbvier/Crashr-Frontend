import styled from "styled-components";
import { device } from "@/styles/Breakpoints";
import { SwiperSlide } from "swiper/react";
import { Swiper } from 'swiper/react';
interface SlideShowSymbolProps {
  active: boolean;
}
const SlideShowSymbol = styled.div<SlideShowSymbolProps>`
  width: 36px;
  height: 6px;
  border-radius: 10px;
  background-color: ${props => props.active ? '#CECECE' : '#767676'};
  cursor: pointer;
  transition: 0.6s ease;
  &:hover{
    background-color: #ddd;
  }
`;

const SlideShow = styled.div`
  display: flex;
  align-items: start;
  gap: 82px;
  @media ${device.sm} {
    flex-direction: column;
    gap: 21px;
  }
`;

const HeroSlideShowStyle = styled.div`
  padding-top: 54px;
  @media ${device.sm} {
    padding-top: 0px;
  }
  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;

    /* Center slide text vertically */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CustomSwiperSlide = styled(SwiperSlide)``;

const CustomSwiper = styled(Swiper)``;

export {
  SlideShowSymbol,
  SlideShow,
  HeroSlideShowStyle,
  CustomSwiperSlide,
  CustomSwiper
};
