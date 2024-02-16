import styled from 'styled-components';
import { Modal } from 'react-bootstrap';

import { VERIFIED_ICON_IMAGE } from '@/constants/image.constants';
import { device } from '@/styles/Breakpoints';
import { FlexBox } from '@/components/common/FlexBox';
import CustomButton from '@/components/common/CustomButton';
import CustomText from '@/components/common/CustomText';
import { getExactImageFormat } from '@/hooks/function';
import CustomInput from '@/components/common/CustomInput';
import { useEffect, useState } from 'react';
import { useWalletConnect } from '@/context/WalletConnect';
import { COLLECTION_DATA } from '@/constants/document';
import { COLLECTIONS_ROYALTIES_CONSTANT } from '@/constants/collections.royalties.constant';
import { useGlobalContext } from '@/context/GlobalContext';
import { COLORS } from '@/constants/colors.constants';
import * as S from './index.styled';

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
      /* min-height: 100vh; */
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
  padding-left: 48px;
  padding-right: 48px;
  padding-bottom: 52px;
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
  submitSellNFT: (assets: string[], price: number, nftArray: NFTDataProps[], royaltyAmount: number) => Promise<void>;
}

const SellNFTModal = ({ show, onClose, nftData, submitSellNFT }: Props) => {
  console.log("nftData", nftData)
  const [inputPrice, setInputPrice] = useState<number>(5)
  const [royaltyAmount, setRoyaltyAmount] = useState<number>(10)
  const [feeAmount, setFeeAmount] = useState<number>(1);
  const { colorMode } = useGlobalContext()
  const { myWalletAddress, lucid } = useWalletConnect();

  useEffect(() => {
    if ((inputPrice * 0.0199) < 1) {
      setFeeAmount(1)

    } else {
      const fee = inputPrice * 0.0199
      setFeeAmount(fee)
    }
  }, [inputPrice])

  useEffect(() => {
    // console.log("nftData.asset.slice(0, 56)", nftData.asset.slice(0, 56))
    // @ts-ignore
    if (!COLLECTIONS_ROYALTIES_CONSTANT[nftData.asset.slice(0, 56)]) {
      setRoyaltyAmount(0)
    }
  }, [nftData])

  useEffect(() => {
    console.log("royaltyAmount", royaltyAmount)
  }, [royaltyAmount])


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
            Sell NFT
          </S.ModalTitle>
          <S.ModalNote color={COLORS[colorMode].mainTextColor}>
            Please review all information before submitting.
          </S.ModalNote>
        </FlexBox>

        <FlexBox marginTop='32px' paddingLeft='25px' paddingRight='25px' direction='column'>
          <FlexBox
            justifyContent='start' gap='24px'
            alignItems='center'
            smDirection='row'
            smGap='18px'
            smJustifyContent='start'>
            <S.NFTImage
              src={nftData && getExactImageFormat(nftData.image)}
            />
            <S.NFTContentsGroup>

              <S.NFTName href={`/nfts/${nftData.asset}`} color={COLORS[colorMode].mainTextColor}>
                {nftData && nftData.name}
              </S.NFTName>
              <FlexBox
                justifyContent='start' gap='4px' alignItems='center' smDirection='row' smJustifyContent='start' smGap='4px'
              >
                <S.CollectionName
                  // @ts-ignore
                  href={`/collections/${nftData.asset.slice(0, 56)}`}
                  color={COLORS[colorMode].mainTextColor}
                >
                  {
                    // @ts-ignore
                    COLLECTION_DATA.hasOwnProperty(nftData.asset.slice(0, 56)) ? COLLECTION_DATA[nftData.asset.slice(0, 56)].name : nftData.asset.slice(0, 56)}
                </S.CollectionName>

                {
                  // @ts-ignore
                  COLLECTION_DATA.hasOwnProperty(nftData.asset.slice(0, 56)) &&
                  <S.BadgeIcon
                    src={VERIFIED_ICON_IMAGE}
                  />
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
              min={5}
              onChange={(e: any) => {
                setInputPrice(parseFloat(e.target.value));
              }}
            />
            {
              nftData && nftData.asset && COLLECTIONS_ROYALTIES_CONSTANT[nftData.asset.slice(0, 56)] &&
              <>
                <CustomText
                  text={`Optional Royalty (%)`}
                  fontFamily='Open Sans'
                  fontWeight='600'
                  fontSize='17px'
                  smFontSize='15px'
                />
                <CustomInput
                  placeholder='Enter royalty percentage'
                  value={royaltyAmount}
                  type='number'
                  disabled={!COLLECTIONS_ROYALTIES_CONSTANT[nftData.asset.slice(0, 56)]}
                  onChange={(e: any) => {
                    if (e.target.value > 0 && e.target.value <= 30) {
                      setRoyaltyAmount(parseFloat(e.target.value));
                    }
                  }}
                />
              </>
            }


          </FlexBox>
          <FlexBox justifyContent='space-between' marginTop='24px' smDirection='row' smJustifyContent='space-between'>
            <CustomText
              text={`Service Fee (1.99%)`}
              fontFamily='Open Sans'
              fontWeight='600'
              fontSize='17px'
              smFontSize='15px'
            />
            <CustomText
              text={`₳ ${inputPrice ? feeAmount.toFixed(2) : 0}`}
              fontFamily='Open Sans'
              fontWeight='600'
              fontSize='17px'
              color='#9e9e9e'
              smFontSize='15px'
            />
          </FlexBox>
          <FlexBox justifyContent='space-between' marginTop='24px' smDirection='row' smJustifyContent='space-between'>
            <CustomText
              text={`Total Earnings:`}
              fontFamily='Open Sans'
              fontWeight='600'
              fontSize='17px'
              smFontSize='15px'
            />
            <CustomText
              text={`~₳${inputPrice ?
                (
                  royaltyAmount
                    ?
                    (inputPrice - feeAmount - inputPrice * royaltyAmount / 100).toFixed(2)
                    :
                    (inputPrice - feeAmount).toFixed(2)
                )
                : 0}`}
              fontFamily='Open Sans'
              fontWeight='700'
              fontSize='28px'
              color='#6073F6'
            />
            {/* <CustomText
              text={`~₳${inputPrice ?
                (
                  royaltyAmount
                  &&
                  (inputPrice - feeAmount).toFixed(2)
                )
                : 0}`}
              fontFamily='Open Sans'
              fontWeight='700'
              fontSize='28px'
              color='#6073F6'
            /> */}
          </FlexBox>

          <FlexBox marginTop='56px'>
            <CustomButton
              text='Submit Listing'
              width='286px'
              height='48px'
              disabled={!inputPrice || inputPrice < 5 || !nftData || myWalletAddress === undefined}
              onClick={() => {
                // @ts-ignore
                submitSellNFT([nftData.asset], inputPrice, [nftData], royaltyAmount)
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

export default SellNFTModal