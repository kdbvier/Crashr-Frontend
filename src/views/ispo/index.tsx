import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { H1 } from '@/components/typography'
import React, { useEffect, useState } from 'react'
import { Container, PageWrapper } from '@/styles/GlobalStyles'
import StatsCard from './StatsCard'
import CurrentRewards from './CurrentRewards'
import CalculateRewards from './CalculateRewards'
import { useGlobalContext } from '@/context/GlobalContext'
import { COLORS } from '@/constants/colors.constants'
import axios from 'axios'
import parse from 'html-react-parser';
import { useWalletConnect } from '@/context/WalletConnect'

interface IStake {
  live_delegators: number;
  fixed_cost: number;
  margin: number;
  block_count: number;
  live_stake: number;
}

const ISPO: React.FC = () => {
  const [stakedData, setStakedData] = useState<IStake>()
  const { colorMode } = useGlobalContext()
  const { myWalletAddress, lucid } = useWalletConnect()
  useEffect(() => {
    // getRewards("stake1uy4kkw2f6wq0afktrsw03pysafqt9swwsachmauxnjcu8rsnrxgfy", "pool1j8zhlvakd29yup5xmxtyhrmeh24udqrgkwdp99d9tx356wpjarn")
    getStakePoolInfo()
  }, [])

  const getStakePoolInfo = async () => {
    const url = "https://mainnet.gomaestro-api.org/v1/pools/pool1j8zhlvakd29yup5xmxtyhrmeh24udqrgkwdp99d9tx356wpjarn/info"
    const apiKey = "PdWqWqI3mamC6VcAUBop74xhyHUnYqFN"
    const { data } = await axios.get(
      url,
      {
        headers: {
          'api-key': apiKey,
          "Accept": "application/json",
        }
      }
    );
    if (data.data) {
      setStakedData(data.data)
    }
  }


  return (
    <PageWrapper colorMode={colorMode}>
      <Container paddingTop='92px' smPaddingTop='40px'>
        <FlexBox direction='column' marginBottom='33px'>
          <H1 color={COLORS[colorMode].mainTextColor}>
            ISPO
          </H1>

          {/*** Stats */}
          <FlexBox justifyContent='center' marginTop='37px' flexWrap='wrap' alignItems='center' gap="35px" smDirection='row' smGap='6px'>
            <StatsCard
              title="Staked"
              value={stakedData && stakedData.live_stake ? parse('<span>₳</span>' + (stakedData.live_stake / 1000000000000).toFixed(2) + 'M') : ' '}
            />

            <StatsCard
              title="Blocks"
              value={stakedData && stakedData.block_count ? stakedData.block_count : ' '}
            />
            <StatsCard
              title="Delegators"
              value={stakedData && stakedData.live_delegators ? stakedData.live_delegators : ' '}
            />
            <StatsCard
              title="Fixed Fee"
              value={stakedData && stakedData.fixed_cost ? parse('<span>₳</span>' + stakedData.fixed_cost / 1000000) : ' '}
            />
            <StatsCard
              title="Margin Fee"
              value={stakedData && stakedData.margin ? stakedData.margin * 100 + '%' : " "}
            />

          </FlexBox>

          <CustomText
            text={`Check your rewards`}
            fontFamily='Inconsolata'
            fontWeight='600'
            lineHeight='120%'
            fontSize='33px'
            marginTop='51px'
            letterSpacing='-0.825px'
            color={COLORS[colorMode].mainTextColor}
            smFontSize='25px'
          />

          <CustomText
            text={`To check your rewards, enter your wallet address! You can also calculate your rewards. `}
            fontFamily='Open Sans'
            fontWeight='400'
            lineHeight='130%'
            fontSize='17px'
            marginTop='14px'
            color={COLORS[colorMode].mainTextColor}
            smFontSize='15px'

          />
          {/*** INPUT / SUBMIT */}
          {/* <FlexBox justifyContent='start' marginTop='18px' gap='15px' flexWrap='wrap'>
            <CustomInput
              maxWidth='554px'
              height='64px'
              padding='12px 16px'
              placeholder='Enter your wallet address'
              bgColor='white'
              fontSize='16px'
              smFontSize='16px'
            />

            <CustomButton
              text='Submit'
              height='64px'
              width='187px'
              smWidth='87px'
              smHeight='42px'
            />

          </FlexBox> */}
          {/*** Rewards */}
          <FlexBox justifyContent='start' gap='36px' marginTop='43px' flexWrap='wrap' smAlignItems='center' direction='column'>
            <CurrentRewards />
            <CalculateRewards />
          </FlexBox>
        </FlexBox>
      </Container>
    </PageWrapper>
  )
}

export default ISPO