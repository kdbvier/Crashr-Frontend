import { FlexBox } from '@/components/common/FlexBox';
import React, { useEffect, useState } from 'react'
import * as S from './index.styled'

const ceil = 96;
const floor = 86;



const SkeletonTxCard = () => {
  const [number, setNumber] = useState(floor);
  const [increasing, setIncreasing] = useState<boolean>(true)

  useEffect(() => {
    const interval = setInterval(() => {
      if (increasing) {
        if (number < ceil) {
          setNumber(number + 0.1);
        } else {
          setIncreasing(false);
        }
      } else {
        if (number > floor) {
          setNumber(number - 0.1);
        } else {
          setIncreasing(true);
        }
      }
    }, 10);

    return () => clearInterval(interval);
  }, [number, increasing]);
  return (
    <FlexBox justifyContent='space-between' alignItems='center' padding='10px 20px' bgColor='#f6f6f6' gap="20px" width='280px' smDirection='row' smWidth='280px' smPadding='10px 20px'>
      <S.Image bgColor={`hsl(0, 0%, ${number}%)`} />
      <FlexBox justifyContent='start' direction='column' gap="6px" smWidth='250px'>
        <S.Text bgColor={`hsl(0, 0%, ${number}%)`} />
        <S.Text bgColor={`hsl(0, 0%, ${number}%)`} />
        <S.Text bgColor={`hsl(0, 0%, ${number}%)`} />
      </FlexBox>

    </FlexBox>
  )
}

export default SkeletonTxCard