import axios from 'axios'
import CustomButton from '@/components/common/CustomButton'
import CustomInput from '@/components/common/CustomInput'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { useGlobalContext } from '@/context/GlobalContext'
import { useWalletConnect } from '@/context/WalletConnect'
import React from 'react'

const CurrentRewards = () => {
  const { colorMode } = useGlobalContext()
  const { lucid, myWalletAddress } = useWalletConnect()

  const stake = async () => {
    const { data } = await axios.get(`https://cardano-mainnet.blockfrost.io/api/v0/addresses/${myWalletAddress}`,
      {
        headers: {
          'project_id': 'mainnetIqzT8aKHzUxW3UNhpaLXsLf8stn3KuCt'
        }
      }
    )
    if (data) {
      const rewardAddr = data.stake_address
      if (!lucid) return;
      try {
        const tx = await lucid
          .newTx()
          .registerStake(rewardAddr)
          .delegateTo(rewardAddr,
            "pool1j8zhlvakd29yup5xmxtyhrmeh24udqrgkwdp99d9tx356wpjarn")
          .validTo(Date.now() + 1000000).complete()
        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();
        console.log("txHash", txHash)
      } catch (err) {
        console.log("err", err)
      }
    }
  }

  return (
    <FlexBox direction='column' gap='32px' padding='42px' bgColor={colorMode === 'light' ? '#f7f7f7' : '#363636'} smWidth='318px' smPaddingTop='31px' smPaddingLeft='27px' smPadding='24px' smPaddingBottom='23px' smGap='8px' maxWidth='878px'>
      <CustomText
        text={`Your Current Rewards`}
        fontFamily='Open Sans'
        fontSize='24px'
        fontWeight='600'
        lineHeight='120%'
        smFontSize='19px'
      />
      <FlexBox borderRadius='3px' gap="36px">
        <FlexBox direction='column' gap="16px" justifyContent='end'>
          <CustomInput
            maxWidth='519px'
            height='58px'
            padding='18px 22px'
            placeholder='Enter your wallet address'
            fontSize='17px'
            bgColor="#e5e5e5"
            smFontSize='15px'
          />
          <CustomButton
            text={`Check My Rewards`}
            width='308px'
            height='50px'
            fontSize='17px'
            fontWeight='600'
            lineHeight='130%'
            color='white'
            bgColor='#999999'
            smWidth='100%'
            smHeight='42px'
          />
        </FlexBox>
        <FlexBox direction='column' gap="16px" maxWidth='238px' smWidth='100%'>
          <CustomText
            text={`0.00   $CRASH`}
            letterSpacing='-1.025px'
            lineHeight='120%'
            fontWeight='700'
            fontSize='41px'
            fontFamily='Inconsolata'
            color='#B92929'
            maxWidth='238px'
            height='58px'
            smFontSize='43px'
            smMaxWidth='auto'
          />
          {
            lucid && myWalletAddress &&
            <CustomButton
              text={`Stake`}
              width='238px'
              height='50px'
              fontSize='17px'
              fontFamily='Open Sans'
              smHeight='42px'
              smWidth='100%'

              onClick={() => {
                stake()
              }}
            />
          }
        </FlexBox>
      </FlexBox>

    </FlexBox>
  )
}

export default CurrentRewards