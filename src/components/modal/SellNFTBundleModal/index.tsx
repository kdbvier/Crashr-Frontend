import styled from 'styled-components';
import { Modal } from 'react-bootstrap';

import CustomImage from '@/components/common/CustomImage';
import { VERIFIED_ICON_IMAGE } from '@/constants/image.constants';
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
    padding: 42px 31.5px 53px 31.5px;
  }
  &.modal-body{
  }
`

interface Props {
  show: boolean;
  onClose: () => void;
  nftData: NFTDataProps[];
  submitSellNFT: (assets: string[], price: number, nftArr: NFTDataProps[]) => Promise<void>;
}
const SellNFTBundleModal = ({ show, onClose, nftData, submitSellNFT }: Props) => {
  console.log("nftData", nftData)
  const [inputPrice, setInputPrice] = useState<number>(5)
  const [feeAmount, setFeeAmount] = useState<number>(1);
  const { myWalletAddress } = useWalletConnect();
  const { colorMode } = useGlobalContext()

  useEffect(() => {
    if ((inputPrice * 0.0199) < 1) {
      setFeeAmount(1)
    } else {
      const fee = inputPrice * 0.0199
      setFeeAmount(fee)
    }
  }, [inputPrice])
  return (
    <StyledModal show={show} onHide={onClose} centered contentClassName="connect-success-content" colorMode={colorMode}>
      <Modal.Header closeButton>
      </Modal.Header>
      <ModalBody>
        <FlexBox direction='column' gap='12px' borderBottom='1px #cecece solid'
          padding='12px 25px'
        >
          <H3>Sell NFT bundle</H3>
          <H8>
            Please review all information before submitting.
          </H8>
        </FlexBox>
        <FlexBox marginTop='32px' paddingLeft='25px' paddingRight='25px' direction='column'>
          <CustomText
            fontFamily='Open Sans'
            fontSize='16px'
            fontWeight='600F'
            marginBottom='23px'
            text={`${nftData.length} Items`}
          />
          <FlexBox direction='column' gap='24px'>
            {
              nftData.map((nft, index) => {
                return (
                  <FlexBox justifyContent='start' gap='28px' alignItems='center'>
                    <CustomImage
                      image={nft && getExactImageFormat(nft.image)}
                      width='100px'
                      height='100px'
                      borderRadius='2.4px'
                    />
                    <FlexBox direction='column' gap='8px'>
                      <CustomText
                        text={nft && nft.name}
                        fontWeight='700'
                        fontSize='21px'
                      />
                      <FlexBox justifyContent='start' gap='10px' alignItems='center'>
                        <CustomText
                          fontSize='14px'
                          fontWeight='400'
                          color='#f73737'
                          maxWidth='310px'
                          className='three-dots'
                          display='block'
                          text={
                            // @ts-ignore
                            COLLECTION_DATA.hasOwnProperty(nft.asset.slice(0, 56)) ? COLLECTION_DATA[nft.asset.slice(0, 56)].name : nft.asset.slice(0, 56)}
                        />
                        {
                          // @ts-ignore
                          COLLECTION_DATA.hasOwnProperty(nft.asset.slice(0, 56)) &&
                          <CustomImage
                            image={VERIFIED_ICON_IMAGE}
                            width='22px'
                            height='21px'
                          />
                        }
                      </FlexBox>
                    </FlexBox>
                  </FlexBox>
                )
              })
            }
          </FlexBox>
          <FlexBox direction='column' gap="12px" marginTop='12px'>
            <CustomText
              text={`Price`}
              fontFamily='Open Sans'
              fontWeight='600'
              fontSize='16px'
            />
            <CustomInput
              placeholder='Enter listing price'
              value={inputPrice}
              type='number'

              onChange={(e: any) => {
                setInputPrice(parseFloat(e.target.value));
              }}
            />
          </FlexBox>
          <FlexBox justifyContent='space-between' marginTop='24px'>
            <CustomText
              text={`Service Fee (1.99%)`}
              fontFamily='Open Sans'
              fontWeight='600'
              fontSize='16px'
            />
            <CustomText
              text={`₳ ${inputPrice ? feeAmount.toFixed(2) : 0}`}
              fontFamily='Open Sans'
              fontWeight='600'
              fontSize='16px'
              color='#9e9e9e'
            />
          </FlexBox>
          <FlexBox justifyContent='space-between' marginTop='24px'>
            <CustomText
              text={`Total Earnings:`}
              fontFamily='Open Sans'
              fontWeight='600'
              fontSize='16px'
            />
            <CustomText
              text={`~₳${inputPrice ? (inputPrice - feeAmount).toFixed(2) : 0}`}
              fontFamily='Open Sans'
              fontWeight='700'
              fontSize='28px'
              color='#6073F6'
            />
          </FlexBox>

          <FlexBox marginTop='56px'>
            <CustomButton
              text='Submit Listing'
              width='286px'
              height='48px'
              smWidth='100%'
              disabled={!inputPrice || inputPrice < 5 || nftData.length === 0 || myWalletAddress === undefined}
              onClick={() => {
                // @ts-ignore
                submitSellNFT(nftData.map(item => item.asset), inputPrice, nftData)
              }}
            />
          </FlexBox>
        </FlexBox>
      </ModalBody>
    </StyledModal>
  )
}

export default SellNFTBundleModal