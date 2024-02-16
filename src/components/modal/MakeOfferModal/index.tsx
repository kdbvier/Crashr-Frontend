import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import CustomImage from '@/components/common/CustomImage';
import { VERIFIED_ICON_IMAGE } from '@/constants/image.constants';
import { device } from '@/styles/Breakpoints';
import { FlexBox } from '@/components/common/FlexBox';
import CustomButton from '@/components/common/CustomButton';
import CustomText from '@/components/common/CustomText';
import { getExactImageFormat } from '@/hooks/function';
import CustomInput from '@/components/common/CustomInput';
import { useEffect, useState } from 'react';
import { COLLECTION_DATA } from '@/constants/document';
import SelectCurrencyBox from '@/components/select/SelectCurrencyBox';
import SelectNFTBox from '@/components/select/SelectNFTBox';
import CustomBorderButton from '@/components/common/CustomBorderButton';
import { useGlobalContext } from '@/context/GlobalContext';
import { COLORS } from '@/constants/colors.constants';
import { COLLECTIONS_ROYALTIES_CONSTANT } from '@/constants/collections.royalties.constant';
import * as S from '../PurchaseCartModal/index.styled'
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
      /* height: 100vh; */
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

const Radio = styled.input`
    border: 1px solid #6073F6;
    width: 24px;
    height: 24px;
`

interface Props {
  show: boolean;
  onClose: () => void;
  nftData: NFTDataProps;
  listedData: ListedData;
  submitOffer: (price: number, policyId: string, asset: string, tokenType: string, nftAssets: string[], royaltyAmount?: number) => Promise<void>;
}
const MakeOfferModal = ({ show, onClose, nftData, listedData, submitOffer }: Props) => {

  console.log("nftData", nftData.asset)
  const [inputPrice, setInputPrice] = useState<number>(5)
  const [step, setStep] = useState<number>(1)
  const [royaltyAmount, setRoyaltyAmount] = useState<number>(Math.ceil(1 / inputPrice * 100))
  const [formData, setFormData] = useState({
    currency: 'ADA',
    selectedNFTs: []
  })
  const [offerOption, setOfferOption] = useState<number>(0);
  const handleOfferTypeChange = (e: any) => {
    setOfferOption(Number(e.target.value));
    if (Number(e.target.value) === 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectedNFTs: []
      }));
    }
  };
  const { colorMode } = useGlobalContext()
  useEffect(() => {
    setRoyaltyAmount(Math.ceil(1 / inputPrice * 100))

  }, [inputPrice])

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
            Make an offer
          </S.ModalTitle>
          <S.ModalNote color={COLORS[colorMode].mainTextColor}>
            Please review all information before submitting.
          </S.ModalNote>
        </FlexBox>
        {/** Modal Content */}
        <FlexBox marginTop='32px' paddingLeft='25px' paddingRight='25px' direction='column'>
          {
            step === 2 &&
            <CustomText
              text={`Item`}
              fontFamily='Open Sans'
              fontWeight='600'
              fontSize='16px'
              marginBottom='23px'
            />
          }
          <FlexBox justifyContent='start'
            gap='24px'
            alignItems='center'
            smDirection='row'
            smGap='18px'
            smJustifyContent='start'>
            <S.NFTImage
              src={
                nftData && getExactImageFormat(nftData.image)}
            />
            <S.NFTContentsGroup>

              {
                nftData && nftData.asset &&
                <>
                  <S.NFTName href={`/nfts/${nftData.asset}`} color={COLORS[colorMode].mainTextColor}>
                    {
                      nftData && nftData.name
                    }
                  </S.NFTName>
                  <FlexBox justifyContent='start' gap='4px' alignItems='center' smDirection='row' smJustifyContent='start' smGap='4px'>

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
                  </FlexBox>
                </>
              }

              <CustomText
                text={`Owned by: ${listedData && listedData.seller ? listedData.seller : ''}`}
                fontWeight='400'
                fontSize='15px'
                maxWidth='250px'
                display='block'
                className='three-dots'
                smMaxWidth='248px'
                smFontSize='13px'
              />
            </S.NFTContentsGroup>
          </FlexBox>
          {/* <CustomText
                        text={`Select how you would like to make your offer:`}
                        fontSize='17px'
                        fontWeight='600'
                        lineHeight='130%'
                        fontFamily='Open Sans'
                        smFontSize='15px'
                        marginTop='36px'
                        smMarginTop='36px'
                    /> */}
          {
            step === 1 &&
            <>
              <FlexBox marginTop='36px' smDirection='row' gap='12px'>
                <Radio
                  type="radio"
                  name="offerType"
                  value={0}
                  checked={offerOption === 0}
                  onChange={handleOfferTypeChange}
                />
                <FlexBox direction='column' gap="12px"
                  className={
                    offerOption !== 0 ? 'disabled' : ''
                  }>
                  <CustomText
                    text={`Select Currency`}
                    fontFamily='Open Sans'
                    fontWeight='600'
                    fontSize='16px'
                    smFontSize='14px'
                  />
                  <SelectCurrencyBox
                    formData={formData}
                    setFormData={setFormData}
                  />
                  {/* {
                                        offerOption === 0 && formData.currency === "ADA" && nftData && nftData.asset && COLLECTIONS_ROYALTIES_CONSTANT[nftData.asset.slice(0, 56)] &&
                                        <CustomText
                                            color="#1E84C1"
                                            text={`*The fields below are optional.`}
                                            fontFamily='Open Sans'
                                            fontSize='16px'
                                            fontWeight='600' />
                                    } */}

                  <CustomText
                    text={`Offer Amount`}
                    fontFamily='Open Sans'
                    fontWeight='600'
                    fontSize='16px'
                    smFontSize='14px'
                  />
                  <CustomInput
                    placeholder='Enter offer price'
                    value={inputPrice}
                    type='number'
                    min={5}
                    onChange={(e: any) => {
                      setInputPrice(parseFloat(e.target.value));
                    }}
                  />

                  {/* {
                                        offerOption === 0 && formData.currency === "ADA" && nftData && nftData.asset && COLLECTIONS_ROYALTIES_CONSTANT[nftData.asset.slice(0, 56)] &&
                                        <>
                                            <CustomText
                                                text={`Optional Royalty (%)`}
                                                fontFamily='Open Sans'
                                                fontWeight='600'
                                                fontSize='16px'
                                            />
                                            <CustomInput
                                                placeholder='Enter royalty percentage'
                                                value={royaltyAmount}
                                                type='number'
                                                min={Math.ceil(1 / inputPrice * 100)}
                                                onChange={(e: any) => {
                                                    setRoyaltyAmount(parseFloat(e.target.value))
                                                }}
                                            />
                                        </>
                                    } */}

                </FlexBox>
              </FlexBox>
              <FlexBox marginTop='12px' smDirection='row' gap='12px'>
                <Radio
                  type="radio"
                  name="offerType"
                  value={1}
                  checked={offerOption === 1}
                  onChange={handleOfferTypeChange}
                // disabled = {true}
                />
                <FlexBox
                  direction='column' gap="12px" className={
                    offerOption !== 1 ? 'disabled' : ''
                  }
                >
                  <CustomText
                    text={`Offer NFT`}
                    fontFamily='Open Sans'
                    fontWeight='600'
                    fontSize='16px'
                    smFontSize='14px'
                  />
                  <SelectNFTBox
                    formData={formData}
                    setFormData={setFormData}
                  />
                </FlexBox>
              </FlexBox>
              <FlexBox marginTop='56px'>
                <CustomButton
                  text='Next'
                  width='286px'
                  height='48px'
                  disabled={
                    offerOption === 0
                      ?
                      (inputPrice < 5 || !inputPrice)
                      :
                      (formData.selectedNFTs.length === 0 && true)
                  }
                  onClick={() => {
                    setStep(2)
                  }}
                />
              </FlexBox>
            </>
          }
          {
            step === 2 &&
            <>
              {
                offerOption === 0 &&
                <>
                  <FlexBox marginTop='32.5px' paddingTop='32.5px' paddingBottom='30px' direction='column' borderTop='#cecece 1px solid' gap="12px" smPaddingBottom='10px'>
                    <FlexBox justifyContent='start' alignItems='center' smDirection='row' smJustifyContent='start'>
                      <CustomText
                        text={`Offer Type: `}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='16px'
                        smFontSize='14px'
                      />
                      &nbsp;
                      <CustomText
                        text={`Currency(${formData.currency})`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='16px'
                        color='#6073F6'
                        smFontSize='14px'
                      />
                    </FlexBox>
                    <FlexBox justifyContent='space-between' alignItems='center' smDirection='row' smJustifyContent='start'>
                      <CustomText
                        text={`Offer Amount:&nbsp;`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='16px'
                        smFontSize='14px'
                      />
                      {
                        formData.currency === 'ADA' ?
                          <CustomText
                            text={`₳${inputPrice ? inputPrice : 0}`}
                            fontFamily='Open Sans'
                            fontWeight='600'
                            fontSize='16px'
                            color='#6073F6'
                          />
                          :
                          <CustomText
                            text={`${inputPrice ? inputPrice : 0}&nbsp;${formData.currency}`}
                            fontFamily='Open Sans'
                            fontWeight='600'
                            fontSize='16px'
                            color='#6073F6'
                          />
                      }


                    </FlexBox>
                  </FlexBox>

                  <FlexBox justifyContent='space-between'
                    alignItems='center' gap="12px" paddingTop='12px'
                    borderTop='#cecece 1px solid'
                    smDirection='row'
                    smJustifyContent='start'
                  >
                    <CustomText
                      text={`Total Cost:`}
                      fontFamily='Open Sans'
                      fontWeight='600'
                      fontSize='16px'
                      smFontSize='14px'
                    />
                    {
                      formData.currency === 'ADA' ?
                        <CustomText
                          text={`₳${inputPrice ? inputPrice : 0}`}
                          fontFamily='Open Sans'
                          fontWeight='700'
                          fontSize='28px'
                          color='#6073F6'
                        />
                        :
                        <CustomText
                          text={`${inputPrice ? inputPrice : 0}&nbsp;${formData.currency}`}
                          fontFamily='Open Sans'
                          fontWeight='700'
                          fontSize='28px'
                          color='#6073F6'
                        />
                    }

                  </FlexBox>
                </>
              }
              {
                offerOption === 1 &&
                <>
                  <FlexBox marginTop='32.5px' paddingTop='32.5px' paddingBottom='30px' direction='column' borderTop='#cecece 1px solid' gap="12px" smPaddingBottom='10px'>
                    <FlexBox justifyContent='start' alignItems='center' smJustifyContent='start' smDirection='row'>
                      <CustomText
                        text={`Offer Type:`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='16px'
                        smFontSize='14px'
                      />
                      &nbsp;
                      <CustomText
                        text={`NFT(s)`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='16px'
                        color='#6073F6'
                        smFontSize='14px'
                      />
                    </FlexBox>
                    <FlexBox justifyContent='start' alignItems='start'>
                      <CustomText
                        text={`Offer:`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='16px'
                        width='75px'
                        smFontSize='14px'
                      />
                      <FlexBox gap="25px" flexWrap='wrap'>
                        {
                          formData.selectedNFTs.map((item: any, index: number) => {
                            return (
                              <CustomImage
                                image={getExactImageFormat(item.image)}
                                width='48px'
                                height='48px'
                                key={index}
                              />
                            )
                          })
                        }
                      </FlexBox>

                    </FlexBox>
                    <FlexBox justifyContent='space-between' alignItems='center' smDirection='row' smJustifyContent='start'>
                      <CustomText
                        text={`Service Fee (flat rate):`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='16px'
                        smFontSize='14px'
                      />
                      <CustomText
                        text={`₳5`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='16px'
                        color='#6073F6'
                        smFontSize='14px'
                      />
                    </FlexBox>
                  </FlexBox>
                  <FlexBox
                    justifyContent='space-between'
                    alignItems='center'
                    gap="12px"
                    paddingTop='12px'
                    borderTop='#cecece 1px solid'
                    smPaddingTop='10px'
                    smJustifyContent='start' smDirection='row'
                  >
                    <CustomText
                      text={`Total Cost:`}
                      fontFamily='Open Sans'
                      fontWeight='600'
                      fontSize='16px'
                      smFontSize='14px'
                    />
                    <CustomText
                      text={`₳5`}
                      fontFamily='Open Sans'
                      fontWeight='700'
                      fontSize='28px'
                      color='#6073F6'
                      smFontSize='14px'
                    />
                  </FlexBox>
                </>
              }

              <FlexBox marginTop='56px' justifyContent='space-between' smJustifyContent='space-between' smDirection='row'>
                <CustomBorderButton
                  text="Back"
                  onClick={() => {
                    setStep(1)
                  }}
                />
                <CustomButton
                  text='Make Offer'
                  width='197px'
                  height='50px'
                  smWidth='146px'
                  smHeight='42px'
                  disabled={
                    offerOption === 0
                      ?
                      (inputPrice < 5 || !inputPrice)
                      :
                      (formData.selectedNFTs.length === 0 && true)
                  }
                  onClick={() => {
                    if (nftData && nftData.asset && COLLECTIONS_ROYALTIES_CONSTANT[nftData.asset.slice(0, 56)]) {
                      submitOffer(
                        inputPrice,
                        nftData.asset.slice(0, 56),
                        nftData.asset.slice(56),
                        formData.currency,
                        formData.selectedNFTs.map((item: any) => item.asset),
                        royaltyAmount
                      )
                    } else {
                      submitOffer(
                        inputPrice,
                        // @ts-ignore
                        nftData.asset.slice(0, 56),
                        // @ts-ignore
                        nftData.asset.slice(56),
                        formData.currency,
                        formData.selectedNFTs.map((item: any) => item.asset)
                      )
                    }
                  }}
                />
              </FlexBox>
            </>
          }

        </FlexBox>
      </ModalBody>
    </StyledModal >
  )
}

export default MakeOfferModal