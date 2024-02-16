import CustomButton from '@/components/common/CustomButton'
import CustomInput from '@/components/common/CustomInput'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { useGlobalContext } from '@/context/GlobalContext'
import React, { useEffect, useState } from 'react'

const CalculateRewards = () => {
  const [totalRewards, setTotalRewards] = useState<number>()
  const [epoch, setEpoch] = useState<number>()
  const [showRewards, setShowRewards] = useState<boolean>(false)
  const [adaAmount, setAdaAmount] = useState<number>()
  const { colorMode } = useGlobalContext()



  const calculate = () => {
    if (epoch && adaAmount && epoch > 0 && adaAmount > 0) {
      setTotalRewards(epoch * adaAmount * 0.01)
      setShowRewards(true)
    }
  }

  return (
    <FlexBox direction='column' gap='32px' maxWidth='603px' padding='42px' paddingLeft='45px' height='391px' smGap='21px' smPadding='30px' smHeight='274px' smWidth='318px' bgColor={colorMode === 'light' ? '#f7f7f7' : '#363636'}>
      <CustomText
        text={`Calculate Your Rewards`}
        fontFamily='Open Sans'
        fontSize='24px'
        fontWeight='600'
        lineHeight='120%'
        smFontSize='19px'
      />
      <FlexBox direction='column' gap="16px">
        <CustomInput
          placeholder='Enter Total Epochs'
          maxWidth='100%'
          height='58px'
          padding='18px 22px'
          bgColor='#e5e5e5'
          fontWeight='400'
          fontSize='17px'
          value={epoch}
          onChange={(e: any) => {
            setEpoch(e.target.value)
          }}
        />
        <CustomInput
          placeholder='Enter ADA Amount'
          maxWidth='100%'
          height='58px'
          padding='18px 22px'
          bgColor='#e5e5e5'
          fontWeight='400'
          fontSize='17px'
          smFontSize='15px'
          value={adaAmount}
          onChange={(e: any) => {
            setAdaAmount(e.target.value)
          }}
        />
      </FlexBox>
      {
        !showRewards &&
        <CustomButton
          text='Calculate'
          width='100%'
          height='50px'
          bgColor='#4556ca'
          fontFamily='Open Sans'
          fontWeight='600'
          lineHeight='130%'
          fontSize='17px'
          smHeight='42px'
          smWidth='100%'
          smFontSize='15px'
          onClick={() => {
            calculate()
          }}
        />
      }
      {
        showRewards &&
        <CustomText
          text={`${totalRewards} $CRASH`}
          color='#b92929'
          fontSize='41px'
          fontWeight='700'
          lineHeight='120%'
          letterSpacing='-1.025px'
          textAlign='right'
          width='100%'
          justifyContent='end'
        />
      }
    </FlexBox>
  )
}

export default CalculateRewards