import CustomImage from '@/components/common/CustomImage'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { H1 } from '@/components/typography'
import { COLORS } from '@/constants/colors.constants'
import { FAQ_DATA } from '@/constants/document'
import { BLACK_DOWN_ICON, BLACK_UP_ICON } from '@/constants/image.constants'
import { useGlobalContext } from '@/context/GlobalContext'
import React, { useState } from 'react'
import { Container, PageWrapper } from '@/styles/GlobalStyles'


const FAQ = () => {
  const [toggle, setToggle] = useState(FAQ_DATA);
  const { colorMode } = useGlobalContext()
  const updateToggleState = (index: number) => {
    let newArr = toggle;
    newArr[index].visible = !newArr[index].visible;
    setToggle([...newArr]);
  };
  return (
    <PageWrapper colorMode={colorMode}>
      <Container paddingTop='100px'>
        <H1 color={COLORS[colorMode].mainTextColor}>Frequently Asked Questions</H1>
        <FlexBox direction='column' marginTop='72px' gap='29px'>
          {
            toggle.map((faq, index) => {
              return (
                <FlexBox key={index} direction='column'>
                  <FlexBox
                    borderBottom='#B6B6B6 1px solid' padding='20px' justifyContent='space-between' alignItems='center' smJustifyContent='space-between' smDirection='row'>
                    <CustomText
                      text={faq.question}
                      fontSize='28px'
                      fontWeight='700'
                      fontFamily='Open Sans'
                      color={COLORS[colorMode].mainTextColor}
                    />
                    {
                      faq.visible ?
                        <CustomImage
                          image={BLACK_UP_ICON[colorMode]}
                          width='24px'
                          height='15px'
                          smWidth='12px'
                          smHeight='7px'
                          cursor='pointer'
                          onClick={() => updateToggleState(index)}
                        />
                        :
                        <CustomImage
                          image={BLACK_DOWN_ICON[colorMode]}
                          width='24px'
                          height='15px'
                          smWidth='12px'
                          smHeight='7px'
                          cursor='pointer'
                          onClick={() => updateToggleState(index)}
                        />
                    }
                  </FlexBox>
                  {
                    faq.visible &&
                    <CustomText
                      fontSize='21px'
                      fontWeight='400'
                      fontFamily='Open Sans'
                      text={faq.answer}
                      padding='26px 20px'
                      color={COLORS[colorMode].mainTextColor}
                    />
                  }
                </FlexBox>
              )
            })
          }
        </FlexBox>
      </Container>
    </PageWrapper>
  )
}

export default FAQ