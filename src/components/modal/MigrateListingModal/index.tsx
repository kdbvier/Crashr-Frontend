import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import CustomImage from '@/components/common/CustomImage';
import { device } from '@/styles/Breakpoints';
import { FlexBox } from '@/components/common/FlexBox';
import CustomButton from '@/components/common/CustomButton';
import CustomText from '@/components/common/CustomText';
import CustomInput from '@/components/common/CustomInput';
import { useEffect, useState } from 'react';
import { useWalletConnect } from '@/context/WalletConnect';
import { infoAlert } from '@/hooks/alert';
import { COLORS } from '@/constants/colors.constants';
import { useGlobalContext } from '@/context/GlobalContext';

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
  activeMigratingData: any;
  migrateNFT?: (utxo: string, assets: [], price: number, nftArr: any[], royaltyAmount: number) => Promise<void>;
}
const MigrateListingModal = ({ show, onClose, activeMigratingData, migrateNFT }: Props) => {
  console.log("activeMigratingData", activeMigratingData)
  const [inputPrice, setInputPrice] = useState<number>(
    parseInt(activeMigratingData.price_lovelace) / 1000000
  )
  const [feeAmount, setFeeAmount] = useState<number>(1);
  const [royaltyAmount, setRoyaltyAmount] = useState<number>(Math.ceil(1 / inputPrice * 100))
  const { myWalletAddress, lucid } = useWalletConnect();
  const { colorMode } = useGlobalContext()
  useEffect(() => {
    // setRoyaltyAmount(Math.ceil(1 / inputPrice * 100))
    if ((inputPrice * 0.0199) < 1) {
      setFeeAmount(1)
    } else {
      const fee = inputPrice * 0.0199
      setFeeAmount(fee)
    }
  }, [inputPrice])

  useEffect(() => {
    // if (!COLLECTIONS_ROYALTIES_CONSTANT[activeMigratingData.asset_id.slice(0, 56)]) {
    //     setRoyaltyAmount(0)
    // }
  }, [activeMigratingData])
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
          <FlexBox justifyContent='start' gap='28px' alignItems='center' smDirection='center'>
            <CustomImage
              image={activeMigratingData && 'https://image-optimizer.jpgstoreapis.com/' + activeMigratingData.source}
              width='100px'
              height='100px'
              borderRadius='2.4px'
            />
            <FlexBox direction='column' gap='8px'>
              <CustomText
                text={activeMigratingData && activeMigratingData.display_name}
                fontWeight='700'
                fontSize='21px'
              />

            </FlexBox>
          </FlexBox>
          <FlexBox direction='column' gap="12px" marginTop='12px'>
            {/* <CustomText
                            color="#1E84C1"
                            text={`*The fields below are optional.`}
                            fontFamily='Open Sans'
                            fontSize='16px'
                            fontWeight='600' /> */}
            <CustomText
              text={`New Price`}
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
              // disabled={true}
              onChange={(e: any) => {
                setInputPrice(parseFloat(e.target.value));
              }}
            />
            {
              // activeMigratingData && activeMigratingData.asset_id && COLLECTIONS_ROYALTIES_CONSTANT[activeMigratingData.asset_id.slice(0, 56)] &&
              // <>
              //     <CustomText
              //         text={`Optional Royalty (%)`}
              //         fontFamily='Open Sans'
              //         fontWeight='600'
              //         fontSize='16px'
              //     />
              //     <CustomInput
              //         placeholder='Enter royalty percentage'
              //         value={royaltyAmount}
              //         type='number'
              //         min={Math.ceil(1 / inputPrice * 100)}
              //         onChange={(e) => {
              //             if (e.target.value < 0) {

              //             } else {
              //                 setRoyaltyAmount(parseFloat(e.target.value))
              //             }
              //         }}
              //     />
              //     {
              //         royaltyAmount < 0 || royaltyAmount > 30 &&
              //         <ErrorText
              //             text={`Royalty amount should be between 0 and 30.`}
              //         />
              //     }
              // </>
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
              color='#9e9e9e'
              fontSize='17px'
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
            {/* <CustomText
                            text={`~₳${inputPrice ?
                                (
                                    royaltyAmount
                                        ?
                                        (inputPrice - feeAmount - inputPrice * royaltyAmount / 100).toFixed(2)
                                        :
                                        (inputPrice - feeAmount).toFixed(2)
                                )
                                : 0}`}
                        /> */}
            <CustomText
              text={`~₳${inputPrice ?
                (
                  royaltyAmount
                  &&
                  (inputPrice - feeAmount).toFixed(2)
                )
                : 0}`}
            />
          </FlexBox>

          <FlexBox marginTop='56px'>
            <CustomButton
              text='Migrate Listing'
              width='197px'
              height='50px'
              disabled={!inputPrice || inputPrice < 5 || !activeMigratingData || myWalletAddress === undefined}
              onClick={() => {
                if (inputPrice < 5) {
                  infoAlert("You should set listing price as at least 5 ADA");
                  return;
                }
                if (!royaltyAmount || (royaltyAmount < Math.ceil(1 / inputPrice * 100)) || royaltyAmount > 30) {
                  console.log("err")
                  return;
                }
                // @ts-ignore
                migrateNFT(activeMigratingData.utxo, [activeMigratingData.asset_id], parseInt(activeMigratingData.price_lovelace) / 1000000, activeMigratingData.bundled_assets, royaltyAmount)
              }}
              smWidth='146px'
              smHeight='42px'
            />
          </FlexBox>
        </FlexBox>
      </ModalBody>
    </StyledModal >
  )
}

export default MigrateListingModal