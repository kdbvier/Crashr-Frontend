import { getTotalUserNumber } from '@/api/api'
import axios from 'axios'
import { FlexBox } from '@/components/common/FlexBox'
import { COLORS } from '@/constants/colors.constants'
import { useGlobalContext } from '@/context/GlobalContext'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { device } from '@/styles/Breakpoints'

const StatValue = styled.div`
  text-align: center;
  leading-trim: both;

  text-edge: cap;
  font-family: Inconsolata;
  font-size: 41px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 49.2px */
  letter-spacing: -1.025px;
  @media ${device.sm} {
    font-size: 33px;
    letter-spacing: -0.66px;
  }
`

const StatSubject = styled.div`
  text-align: center;
  font-family: Open Sans;
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  @media ${device.sm} {
    font-size: 15px;
    line-height: 120%;
  }
`

const temp_data = [
  {
    subject: "Faster Sweeping",
    value: "10X",
  },
  // {
  //   subject: "Transactions",
  //   value: "500",
  // },
  {
    subject: "Tokens",
    value: 53,
  },
]

const GlobalStats = () => {
  const [totalUser, setTotalUser] = useState<number>()
  const [totalTx, setTotalTx] = useState<number>()
  const { colorMode } = useGlobalContext()
  const getUserData = useCallback(
    async () => {
      const data = await getTotalUserNumber()
      setTotalUser(data)
    }, [])

  const getTotalTx = async () => {
    try {
      const res = await axios.get("https://s2tajjfb1f.execute-api.us-west-2.amazonaws.com/items")
      if (res.data) {
        setTotalTx(res.data.length)
      }
    } catch (err) {
      console.log("err", err)
    }
  }

  useEffect(() => {
    getUserData()
    getTotalTx()
  }, [])
  return (
    <FlexBox smDirection='row' gap="16px" flexWrap='wrap' smGap='6px'>
      {
        temp_data.map((item, index) => {
          return (
            <FlexBox
              key={index}
              width='280px'
              height='128px'
              justifyContent='center'
              alignItems='center'
              direction='column' gap="18px" bgColor={colorMode === 'light' ? '#d7dcfd' : "#4856b9"} boxShadow='0px 0px 4px 0px rgba(0, 0, 0, 0.25)'
              smWidth='45%'
              smHeight='92px'
              color={COLORS[colorMode].mainTextColor}
              borderRadius='3px'
            >
              <StatValue>{item.value}</StatValue>
              <StatSubject>{item.subject}</StatSubject>
            </FlexBox>
          )
        })
      }

      <FlexBox
        width='280px'
        height='128px'
        justifyContent='center'
        alignItems='center'
        direction='column' gap="18px" bgColor={colorMode === 'light' ? '#d7dcfd' : "#4856b9"} boxShadow='0px 0px 4px 0px rgba(0, 0, 0, 0.25)'
        smWidth='45%'
        smHeight='92px'
        color={COLORS[colorMode].mainTextColor}
        borderRadius='3px'

      >
        <StatValue>{totalTx && totalTx}</StatValue>
        <StatSubject>{`Transactions`}</StatSubject>
      </FlexBox>

      <FlexBox
        width='280px'
        height='128px'
        justifyContent='center'
        alignItems='center'
        direction='column' gap="18px" bgColor={colorMode === 'light' ? '#d7dcfd' : "#4856b9"} boxShadow='0px 0px 4px 0px rgba(0, 0, 0, 0.25)'
        smWidth='45%'
        smHeight='92px'
        color={COLORS[colorMode].mainTextColor}
        borderRadius='3px'
      >
        <StatValue>{totalUser ? totalUser : '  '}</StatValue>
        <StatSubject>{`Total Users`}</StatSubject>
      </FlexBox>

    </FlexBox>
  )
}

export default GlobalStats