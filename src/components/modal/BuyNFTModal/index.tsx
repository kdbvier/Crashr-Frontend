import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import { VERIFIED_ICON_IMAGE } from '@/constants/image.constants';
import { device } from '@/styles/Breakpoints';
import { FlexBox } from '@/components/common/FlexBox';
import CustomButton from '@/components/common/CustomButton';
import CustomText from '@/components/common/CustomText';
import { getExactImageFormat } from '@/hooks/function';
import CustomInput from '@/components/common/CustomInput';
import { useState } from 'react';
import { COLLECTION_DATA } from '@/constants/document';
import { useWalletConnect } from '@/context/WalletConnect';
import { useGlobalContext } from '@/context/GlobalContext';
import { COLORS } from '@/constants/colors.constants';

import * as S from "../PurchaseCartModal/index.styled"

interface IStyledModalProps {
  colorMode?: string;
}
const StyledModal = styled(Modal) <IStyledModalProps>`
  .modal-dialog{
    margin: auto;
    max-width: 620px;
    width: 100%;
    
    background: transparent;
    border-radius: 16px;
    @media screen and (max-width: 550px) {
      max-width: 100%;
      min-height: 100vh;
    }
  }
  .modal-header{
    border-bottom: none;
  }
  .connect-success-content {
    background: ${props => props.colorMode === 'light' ? '#e7e7e7' : '#202020'};
    border-radius: 3px;
    width: 100%;
    overflow: hidden;
    border: none;
    @media screen and (max-width: 550px) {
      height: 100%;
    }
  }
`;

const ModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 66px;
  padding-right: 66px;
  padding-bottom: 72px;
  @media ${device.sm} {
    padding-top: 24x;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 24px;
  }
  &.modal-body{
  }
`

interface Props {
  show: boolean;
  onClose: () => void;
  nftData: NFTDataProps;
  submitBuyNFT: () => Promise<void>;
  price: number;
}
const BuyNFTModal = ({ show, onClose, nftData, submitBuyNFT, price }: Props) => {
  const [inputPrice, setInputPrice] = useState<number>(price)
  const { myWalletAddress } = useWalletConnect()
  const { colorMode } = useGlobalContext()
  return (
    <StyledModal show={show} onHide={onClose} centered contentClassName="connect-success-content" colorMode={colorMode}>
      <Modal.Header closeButton>
      </Modal.Header>
      <ModalBody>
        {/** Modal Header */}
        <FlexBox
          direction='column'
          gap='12px'
          borderBottom='1px #cecece solid'
          paddingBottom='20px'
          smPaddingBottom='14px'
        >
          <S.ModalTitle color={COLORS[colorMode].mainTextColor}>
            Your cart
          </S.ModalTitle>
          <S.ModalNote color={COLORS[colorMode].mainTextColor}>
            Please review all information before submitting.
          </S.ModalNote>
        </FlexBox>
        <FlexBox marginTop='32px' paddingLeft='25px' paddingRight='25px' direction='column'>
          <FlexBox justifyContent='start'
            gap='24px'
            alignItems='center'
            smDirection='row'
            smGap='18px'
            smJustifyContent='start'>

            <S.NFTImage
              src={nftData && getExactImageFormat(nftData.image)}
            />
            <S.NFTContentsGroup>
              <S.NFTName href={`/nfts/${nftData.asset}`} color={COLORS[colorMode].mainTextColor}>
                {
                  nftData && nftData.name
                }
              </S.NFTName>
              <FlexBox justifyContent='start' gap='4px' alignItems='center' smDirection='row' smJustifyContent='start' smGap='4px'>
                {
                  nftData && nftData.asset &&
                  <>
                    <S.CollectionName
                      href={`/collections/${nftData.asset.slice(0, 56)}`}
                      color={COLORS[colorMode].mainTextColor}
                    >
                      {COLLECTION_DATA.hasOwnProperty(nftData.asset.slice(0, 56)) ? COLLECTION_DATA[nftData.asset.slice(0, 56)].name : nftData.asset.slice(0, 56)}
                    </S.CollectionName>
                    {
                      COLLECTION_DATA.hasOwnProperty(nftData.asset.slice(0, 56)) &&
                      <S.BadgeIcon
                        src={VERIFIED_ICON_IMAGE}
                      />
                    }
                  </>

                }
              </FlexBox>
            </S.NFTContentsGroup>
          </FlexBox>
          <FlexBox direction='column' gap="12px" marginTop='12px'>
            <CustomText
              text={`Price`}
              fontFamily='Open Sans'
              fontWeight='600'
              fontSize='17px'
              smFontSize='15px'
            />


            <CustomInput
              placeholder='Enter listing price'
              value={inputPrice}
              type='number'
              disabled={true}

              onChange={(e: any) => {
                setInputPrice(parseFloat(e.target.value));
              }}
            />
          </FlexBox>

          <FlexBox justifyContent='space-between' marginTop='24px' alignItems='center' smDirection='row' smJustifyContent='space-between'>
            <CustomText
              text={`Total Cost:&nbsp;`}
              fontFamily='Open Sans'
              fontWeight='600'
              fontSize='17px'
              smFontSize='15px'
            />
            <CustomText
              text={`₳${inputPrice}`}
              fontFamily='Open Sans'
              fontWeight='700'
              fontSize='28px'
              color='#6073F6'
            />
          </FlexBox>

          <FlexBox marginTop='56px'>
            <CustomButton
              text='Purchase Now'
              width='197px'
              height='50px'
              disabled={inputPrice === 0 || !nftData || myWalletAddress === undefined}
              onClick={() => {
                submitBuyNFT()
              }}
              smWidth='146px'
              smHeight='42px'
            />
          </FlexBox>
        </FlexBox>
      </ModalBody>
    </StyledModal>
  )
}

export default BuyNFTModal