import React from 'react';
import styled from 'styled-components';

// Import your custom components as needed
import CustomButton from '@/components/common/CustomButton';
import CustomImage from '@/components/common/CustomImage';
import CustomText from '@/components/common/CustomText';
import { FlexBox } from '@/components/common/FlexBox';
import { useWalletConnect } from '@/context/WalletConnect';
import { useGlobalContext } from '@/context/GlobalContext';

// Define the component's props interface
interface NFTCardType {
  image: string;
  onClick: () => void;
  name: string;
  isSelected?: boolean;
  setSelect: () => void;
}

const NFTCardStyle = styled.div`
  position: relative;
  border-radius: 3px;
  max-width: 256px;
  width: 100%;
  
  @media screen and (max-width: 768px) {
    max-width: 156px;
  }
`;

interface NFTBodyStyleProps {
  isSelected?: boolean; // Ensure isSelected is optional
}

const NFTBody = styled.div<NFTBodyStyleProps>`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  outline: ${props => props.isSelected ? '6px solid #6073F6' : 'none'};
  border-radius: 3px;
`;


const NFTCard = ({
  image,
  onClick,
  name,
  isSelected,
  setSelect
}: NFTCardType) => {
  const { myWalletAddress } = useWalletConnect()
  const { colorMode } = useGlobalContext();
  if (typeof window === "undefined") return;
  const user_addr = window.location.href.split("/users/")[1];

  return (
    <NFTCardStyle>
      <NFTBody isSelected={isSelected} onClick={setSelect}>
        <CustomImage
          image={image}
          width='256px'
          height='256px'
          borderRadius='3px 3px 0px 0px'
          smWidth='156px'
          smHeight='156px'
        />
        <FlexBox
          bgColor={colorMode === 'light' ? 'white' : '#363636'}
          borderRadius='0px 0px 3px 3px'
          padding='10px'
          direction='column'
          alignItems='center'
          gap='4px'
          width='256px'
          height='79px'
          smWidth='156px'
          smHeight='59px'
        >
          <CustomText
            text={name}
            fontSize='21px'
            fontWeight='700'
            maxWidth='236px'
            className='three-dots'
            display='block'
            smFontSize='16px'
            smMaxWidth='139px'
          />
        </FlexBox>
      </NFTBody>
      {!user_addr && !isSelected && (
        <CustomButton
          text='Sell NFT'
          fontSize='18px'
          fontWeight='600'
          fontFamily='Open Sans'
          width='100%'
          marginTop='24px'
          height='48px'
          onClick={onClick}
          smWidth='100%'
        />
      )}
    </NFTCardStyle>
  );
}

export default NFTCard;
