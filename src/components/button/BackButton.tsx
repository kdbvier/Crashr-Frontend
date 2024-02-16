import CustomImage from '@/components/common/CustomImage'
import { BACK_ICON } from '@/constants/image.constants'
import React from 'react'
import styled from 'styled-components'

const BackButtonStyle = styled.a`
  padding: 3.89px;
`

interface IBackButton {
  link?: string;
}

const BackButton = (
  {
    link
  }: IBackButton
) => {
  return (
    <BackButtonStyle href={link ? link : "/marketplace"}>
      <CustomImage
        image={BACK_ICON}
        width='15px'
        height='28px'
      />
    </BackButtonStyle>
  )
}

export default BackButton