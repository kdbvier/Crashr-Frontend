import axios from 'axios'
import RecentTxCard from '@/components/card/RecentTxCard'
import CustomImage from '@/components/common/CustomImage'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import SkeletonTxCard from '@/components/skeleton/SkeletonTxCard'
import { COLORS } from '@/constants/colors.constants'
import { NEXT_ICON, PREV_ICON } from '@/constants/image.constants'
import { useGlobalContext } from '@/context/GlobalContext'
import { useEffect, useState } from 'react'
import { useMedia } from 'react-use'
import { SwiperSlide } from "swiper/react";
import { Swiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// import './styles.css';
import { FreeMode, Pagination, Navigation, EffectFade } from 'swiper/modules';
const RecentTransactions = () => {
  const isMobile = useMedia('(max-width: 768px)');
  const [transactions, setTransactions] = useState<any[]>()
  const [loading, setLoading] = useState<boolean>(true)
  const [activeNum, setActiveNum] = useState<number>(0)
  const { colorMode } = useGlobalContext()

  useEffect(() => {
    getTransactions()
  }, [])

  const getTransactions = async () => {
    try {
      const { data } = await axios.get("https://s2tajjfb1f.execute-api.us-west-2.amazonaws.com/items")
      console.log("tx data", data.data)
      if (data.data) {
        setTransactions(data.data)
        setLoading(false)
      }
    } catch (err) {
      console.log("err", err)
    }
  }
  const onSlideChange = (swiper: any) => {
    setActiveNum(swiper.activeIndex)
  }

  return (
    <FlexBox direction='column' smWidth='100%'>
      <CustomText
        text={`Recent Activity`}
        fontSize='33px'
        fontFamily='600'
        letterSpacing='-0.825px'
        marginBottom='21px'
        smFontSize='25px'
        color={COLORS[colorMode].mainTextColor}
        smMarginBottom='14px'
      />
      <FlexBox gap="48px" alignItems='center' smWidth='100%'>
        {
          !isMobile &&
          <CustomImage
            image={PREV_ICON}
            cursor='pointer'
            onClick={() => {
              if (activeNum !== 0) setActiveNum(activeNum - 1)
            }}
          />
        }
        <FlexBox width='1256px' gap="48px" justifyContent='start' smAlignItems='center' smJustifyContent='center' smGap='12px' smWidth='100%'>
          {
            loading ?
              <>
                <SkeletonTxCard />
                <SkeletonTxCard />
                <SkeletonTxCard />
                <SkeletonTxCard />
              </>
              :
              (
                !isMobile ?

                  transactions && transactions.length > 0 && transactions.slice(3 * activeNum, 3 * (activeNum + 1)).map((item, index) => (
                    <RecentTxCard
                      key={index}
                      txData={item}
                    />
                  ))
                  :
                  transactions && transactions.length > 0 && transactions.slice(3 * activeNum, 3 * (activeNum + 1)).map((item, index) => (
                    <RecentTxCard
                      key={index}
                      txData={item}
                    />
                  ))
              )
          }
        </FlexBox>
        {
          !isMobile &&
          <CustomImage
            image={NEXT_ICON}
            cursor='pointer'
            onClick={() => {
              if (activeNum !== 2) setActiveNum(activeNum + 1)
            }}
          />
        }
      </FlexBox>
    </FlexBox>
  )
}

export default RecentTransactions