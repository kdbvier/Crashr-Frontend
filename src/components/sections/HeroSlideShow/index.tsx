import { useState } from "react";
import { Container } from "@/styles/GlobalStyles";
import {
  CustomSwiper,
  CustomSwiperSlide,
  HeroSlideShowStyle,
  SlideShow,
  SlideShowSymbol,
} from "./index.styled";
import { useMedia } from "react-use";
import { SLIDE_SHOW_DATA } from "@/constants/slideshow.constants";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import CustomText from "@/components/common/CustomText";
import CustomImage from "@/components/common/CustomImage";
import { FlexBox } from "@/components/common/FlexBox";
import { H1 } from "@/components/typography";
import CustomLinkButton from "@/components/common/CustomLinkButton";
import { useGlobalContext } from "@/context/GlobalContext";
import { COLORS } from "@/constants/colors.constants";

const HeroSlideShow = () => {
  const [activeShow, setActiveShow] = useState<number>(0);
  const isMobile = useMedia("(max-width: 600px)");

  const { colorMode } = useGlobalContext();

  const onSlideChange = (swiper: any) => {
    setActiveShow(swiper.activeIndex);
  };

  return (
    <HeroSlideShowStyle>
      <Container
        maxWidth="1320px"
        marginBottom="44px"
        bgColor={colorMode === "light" ? "#f3f3f3" : "#363636"}
        borderRadius="3px"
        paddingTop="50px"
        paddingBottom="50px"
        paddingLeft="50px"
        paddingRight="50px"
        smPaddingLeft="0px"
        smPaddingRight="0px"
        smPaddingTop="0px"
        smPaddingBottom="0px"
        className="mx-auto"
        smMarginTop="0px"
      >
        <Container
          maxWidth="1320px"
          paddingLeft="0px"
          paddingRight="0px"
          smPaddingLeft="0px"
          smPaddingRight="0px"
          smPaddingTop="0px"
          smPaddingBottom="0px"
        >
          <CustomSwiper
            spaceBetween={30}
            // effect={'fade'}
            centeredSlides={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            // pagination={{
            //   clickable: true,
            // }}
            navigation={false}
            modules={[EffectFade, Autoplay, Pagination, Navigation]}
            className="mySwiper"
            onSlideChange={onSlideChange}
          >
            {SLIDE_SHOW_DATA.map((item, index) => {
              return (
                <CustomSwiperSlide>
                  <SlideShow>
                    <FlexBox direction="column" maxWidth="578px">
                      <FlexBox maxWidth="578px" height="400px" smHeight="auto">
                        <CustomImage
                          image={isMobile ? item.mobileImage : item.image}
                          width="500px"
                          height="400px"
                          smHeight="auto"
                          borderRadius="10px"
                          smBorderRadius="0px"
                        />
                      </FlexBox>

                      <FlexBox
                        gap="12px"
                        smDirection="row"
                        justifyContent="start"
                        marginTop="25px"
                        smHeight="default"
                        smJustifyContent="start"
                        smPaddingLeft="16px"
                      >
                        {SLIDE_SHOW_DATA.map((slide, index) => {
                          return (
                            <SlideShowSymbol
                              active={index === activeShow}
                              onClick={() => {
                                setActiveShow(index);
                              }}
                            />
                          );
                        })}
                      </FlexBox>
                    </FlexBox>
                    <FlexBox
                      direction="column"
                      gap="33px"
                      smGap="12px"
                      smPadding="16px"
                      paddingTop="29.5px"
                      maxWidth="640px"
                      paddingLeft="0px"
                      paddingRight="0px"
                    >
                      <CustomText
                        text={`FEATURE UPDATE`}
                        color="#B92929"
                        fontWeight="700"
                        lineHeight="120%"
                        letterSpacing=" 0.17px"
                        fontSize="17px"
                        fontFamily="Inconsolata"
                        smFontSize="14px"
                      />
                      <H1
                        color={COLORS[colorMode].mainTextColor}
                        fontSize="52px"
                        smFontSize="43px"
                      >
                        {item.title}
                      </H1>
                      <CustomText
                        text={item.desc}
                        maxWidth="622px"
                        height="140px"
                        fontSize="17px"
                        fontWeight="400"
                        lineHeight="180%"
                        fontFamily="Open Sans"
                        smFontSize="15px"
                        smLineHeight="150%"
                        alignItems="start"
                        color={COLORS[colorMode].mainTextColor}
                      />
                      <CustomLinkButton
                        text="Learn More"
                        fontSize="17px"
                        fontWeight="600"
                        lineHeight="130%"
                        width="250px"
                        height="50px"
                        smFontSize="15px"
                        smWidth="100%"
                        smHeight="42px"
                        fontFamily="Open Sans"
                        link={item.link}
                      />
                    </FlexBox>
                  </SlideShow>
                </CustomSwiperSlide>
              );
            })}
          </CustomSwiper>
        </Container>
      </Container>
    </HeroSlideShowStyle>
  );
};

export default HeroSlideShow;
