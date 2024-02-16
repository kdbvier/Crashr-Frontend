import CustomImage from '@/components/common/CustomImage'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { ACT_OFFER_ICON } from '@/constants/image.constants';
import { useGlobalContext } from '@/context/GlobalContext';
import { getActivityTag, getExactImageFormat, getPassedTime } from '@/hooks/function';
import React from 'react'
import Link from 'next/link';
import styled from 'styled-components';

interface IRecentTxCard {
  txData
  : any;
}

const RecentTxCardStyle = styled(Link)`
  display: flex;
  text-decoration: none;
`

const RecentTxCard = ({
  txData
}: IRecentTxCard) => {
  const { id, data } = txData
  const { colorMode } = useGlobalContext()
  console.log("data", txData)
  return (
    <>
      {
        data && data.entries &&
        <RecentTxCardStyle href={`/nfts/${data.entries.nfts[0].asset}`}>
          <CustomImage
            width='118px'
            height='118px'
            borderRadius='3px 0px 0px 3px'
            image={getExactImageFormat(data.entries.nfts[0].image)}
          />
          <FlexBox direction='column' padding='12px 16px' justifyContent="space-between" borderRadius='0px 3px 3px 0px' bgColor={colorMode === "light" ? '#F8F8F8' : '#363636'} width='240px' height='118px' smPadding='12px 16px' smWidth='200px' smJustifyContent='space-between'>
            {
              data && data.entries && data.entries.type &&
              <FlexBox bgColor='#FDCDCD' color="#b92929" fontSize='15px' borderRadius='3px' height="28px" alignItems='center' fontWeight='400' gap="6px" smDirection='row' justifyContent='start' padding='5px 8px' width="auto" smFontSize='13px' smWidth='auto'>
                <CustomImage
                  image={ACT_OFFER_ICON}
                  width="18px"
                  height='14.4px'
                />
                {
                  getActivityTag(data.entries.type)
                }
              </FlexBox>
            }
            <CustomText
              text={data.entries.nfts[0].name}
              fontSize='15px'
              fontWeight='400'
              lineHeight='120%'
              fontFamily='Open Sans'
              maxWidth='111px'
              className='text-nowrap three-dots'
              display='block'
              color=" #808080"
              smWidth='175px'
              smFontSize='13px'
            />

            <CustomText
              text={getPassedTime(id)}
              fontSize='15px'
              fontWeight='400'
              fontFamily='Open Sans'
              color=" #808080"
              lineHeight='120%' textAlign='left'
              smFontSize='13px'
              smWidth='175px'
            />

          </FlexBox>
        </RecentTxCardStyle>
      }
    </>
  )
}

export default RecentTxCard