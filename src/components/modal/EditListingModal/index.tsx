import styled from 'styled-components';
import { Modal } from 'react-bootstrap';

import CustomImage from '@/components/common/CustomImage';
import { LINK_ICON, SUCCESS_ICON, VERIFIED_ICON_IMAGE } from '@/constants/image.constants';
import { device } from '@/styles/Breakpoints';
import { FlexBox } from '@/components/common/FlexBox';
import CustomButton from '@/components/common/CustomButton';
import CustomText from '@/components/common/CustomText';
import { H3, H8 } from '@/components/typography';
import { getExactImageFormat } from '@/hooks/function';
import CustomInput from '@/components/common/CustomInput';
import { useEffect, useState } from 'react';
import { useWalletConnect } from '@/context/WalletConnect';
import { COLLECTION_DATA } from '@/constants/document';
import { useGlobalContext } from '@/context/GlobalContext';
import { COLORS } from '@/constants/colors.constants';
import * as S from '../PurchaseCartModal/index.styled';
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
  activeEditData: any;
  editNFT?: (price: number, assets: string[], utxoValue: any, nftArr: NFTDataProps[], royaltyAmount?: number) => Promise<void>;
}
const EditListingModal = ({ show, onClose, activeEditData, editNFT }: Props) => {
  console.log("activeEditData", activeEditData)
  const [inputPrice, setInputPrice] = useState<number>(
    parseInt(activeEditData.data.amount) / 1000000
  )
  const [feeAmount, setFeeAmount] = useState<number>(1);
  const [royaltyAmount, setRoyaltyAmount] = useState<number>()
  const { myWalletAddress, lucid } = useWalletConnect();
  const { colorMode } = useGlobalContext()

  useEffect(() => {
    if ((inputPrice * 0.0199) < 1) {
      setFeeAmount(1)
    } else {
      const fee = inputPrice * 0.0199
      setFeeAmount(fee)
    }
  }, [inputPrice])

  useEffect(() => {
    if (activeEditData) {
      if (activeEditData.data.royalty) {
        setRoyaltyAmount(Math.ceil((parseInt(activeEditData.data.royalty) / 1000000) / inputPrice * 100))
      }

    }
  }, [activeEditData])
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
            Edit NFT
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
            smJustifyContent='startn'>
            <S.NFTImage
              src={activeEditData && getExactImageFormat(activeEditData.assets[0].image)}
            />
            <S.NFTContentsGroup>

              <S.NFTName href={`/nfts/${activeEditData.assets[0].asset}`} color={COLORS[colorMode].mainTextColor}>
                {activeEditData && activeEditData.assets[0].name}
              </S.NFTName>
              <FlexBox
                justifyContent='start' gap='4px' alignItems='center' smDirection='row' smJustifyContent='start' smGap='4px'
              >

                <S.CollectionName
                  href={`/collections/${activeEditData.assets[0].asset.slice(0, 56)}`}
                  color={COLORS[colorMode].mainTextColor}
                >
                  {COLLECTION_DATA.hasOwnProperty(activeEditData.assets[0].asset.slice(0, 56)) ? COLLECTION_DATA[activeEditData.assets[0].asset.slice(0, 56)].name : activeEditData.assets[0].asset.slice(0, 56)}
                </S.CollectionName>

                {
                  COLLECTION_DATA.hasOwnProperty(activeEditData.assets[0].asset.slice(0, 56)) &&
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
              onChange={(e: any) => {
                if (e.target.value > 0 && e.target.value <= 30) {
                  setRoyaltyAmount(parseFloat(e.target.value));
                }
              }}
            />
          </FlexBox>
          <FlexBox justifyContent='space-between' marginTop='24px' smJustifyContent='space-between' smDirection='row'>
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
          <FlexBox justifyContent='space-between' marginTop='24px' smJustifyContent='space-between' smDirection='row'>
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
          </FlexBox>

          <FlexBox marginTop='56px'>
            <CustomButton
              text='Submit Listing'
              width='197px'
              height='50px'
              disabled={!inputPrice || inputPrice < 5 || !activeEditData || myWalletAddress === undefined}
              onClick={() => {
                // @ts-ignore
                editNFT(inputPrice, activeEditData.assets.map((item: any) => item.asset), activeEditData.data.utxo, activeEditData.assets, royaltyAmount)
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

export default EditListingModal