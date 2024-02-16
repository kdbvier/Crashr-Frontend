import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { H1 } from '@/components/typography'
import { COLORS } from '@/constants/colors.constants'
import { useGlobalContext } from '@/context/GlobalContext'
import React from 'react'

const AboutText = () => {
  const { colorMode } = useGlobalContext()
  return (
    <FlexBox direction='column' gap='25px'>
      <H1 color={COLORS[colorMode].mainTextColor}>
        About Crashr
      </H1>
      <CustomText
        fontFamily='Open Sans'
        fontSize='21px'
        fontWeight='400'
        color={COLORS[colorMode].mainTextColor}
        text={
          `Crashr bridges traders and users on one unified platform. We call it web3 commerce.
            <br /><br />
            We offer advanced trading tools for both newcomers and seasoned web3 enthusiasts, propelling the growth of Blockchain applications. Having a robust community and platform are key to our vision of success.
            <br /><br />
            Our goal is to stand out as the go-to platform while continuously innovating in this domain.
            `
        }
      />
    </FlexBox>
  )
}

export default AboutText