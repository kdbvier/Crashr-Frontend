import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import CustomInput from '@/components/common/CustomInput';
import CustomTextArea from '@/components/common/CustomTextarea';
import { useState } from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { H2, H7 } from '@/components/typography';
import SelectCurrencyBox from '@/components/select/SelectCurrencyBox';
import SelectNFTBox from '@/components/select/SelectNFTBox';
import { getExactImageFormat, outputEndTimeRemaining } from '@/hooks/function';
import CustomBorderButton from '@/components/common/CustomBorderButton';
import CustomImage from '@/components/common/CustomImage';
import { SLICK_LEFT_ICON, SLICK_RIGHT_ICON } from '@/constants/image.constants';
import { device } from '@/styles/Breakpoints';
import { FlexBox } from '@/components/common/FlexBox';
import CustomText from '@/components/common/CustomText';
import CustomButton from '@/components/common/CustomButton';
import { AcceptText, CreateRaffleTable, CreateRaffleTableRow, CreateRaffleTableSubject, CreateRaffleTableValue } from './index.styled';
import { CustomCheckBox } from '../CreatePollsModal/index.styled';
import { CustomDatePicker } from '@/styles/GlobalStyles';
import { useGlobalContext } from '@/context/GlobalContext';
import { COLORS } from '@/constants/colors.constants';
import { infoAlert } from '@/hooks/alert';
import ErrorText from '@/components/common/ErrorText';
import * as S from "../PurchaseCartModal/index.styled"
interface IStyledModal {
  colorMode?: string;
}

const StyledModal = styled(Modal) <IStyledModal>`
  box-shadow: 0px 5px 50px 9px #242424;
  .modal-dialog{
    margin: auto;
    max-width: 851px;
    width: 100%;
    
    background: transparent;
    border-radius: 16px;
    
    @media screen and (max-width: 550px) {
      max-width: 100%;
    }
  }
  .modal-header{
    border-bottom: none;
    align-items: start;
    &.btn-close{
        font-size: 40px !important;
    }

  }
  .connect-success-content {
    background: ${props => props.colorMode === 'light' ? '#e7e7e7' : '#272727'};
    border-radius: 3px;
    width: 100%;
    overflow: hidden;
    border: none;
    
    @media screen and (max-width: 550px) {
    }
  }
`;

const ModalBody = styled(Modal.Body)`
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
  .small-images{
    display: flex;
    gap: 10px;
    padding: 12px;
    flex-direction: row;
    align-items: center;
    img{
      width: 53px;
      height: 53px;
      border-radius: 10px;
      &.active{
        width: 65px;
        height: 65px;
      }
    }
    @media ${device.sm} {
      img{
        width: 30px;
        height: 30px;
        &.active{
          width: 45px;
          height: 45px;
        }
      }
    }
  }
`

interface Props {
  show: boolean;
  onClose: () => void;
  formData?: any;
  setFormData?: any;
  submit: any;
}

const today = new Date();
// const today_10_min_later = new Date(today);
const today_12_hours_later = new Date(today);
const today_48_hours_later = new Date(today);
const today_24_hours_later = new Date(today);
const endTime = new Date(today);
// today_10_min_later.setMinutes(today.getMinutes() + 10);
today_12_hours_later.setMinutes(today.getMinutes() + 15);
// today_12_hours_later.setHours(today.getHours() + 12);
today_48_hours_later.setHours(today.getHours() + 48);
today_24_hours_later.setHours(today.getHours() + 24);
endTime.setDate(today.getDate() + 14);




const CreateRaffleModal = ({ show, onClose, formData, setFormData, submit }: Props) => {
  const [isReview, setIsReview] = useState<boolean>(false)
  const [activeNFT, setActiveNFT] = useState(0);


  const { colorMode } = useGlobalContext()

  return (
    <StyledModal show={show} onHide={onClose} colorMode={colorMode} centered contentClassName="connect-success-content">
      <Modal.Header closeButton>
      </Modal.Header>
      <ModalBody>

        <FlexBox direction='column' gap='10px' marginBottom='36px' borderBottom='1px #cfcfcf solid' paddingBottom='20px' smPaddingBottom='15px'>
          {
            !isReview
              ?
              <H2 color={COLORS[colorMode].mainTextColor}>Create a raffle</H2>
              :
              <H2 color={COLORS[colorMode].mainTextColor}>Review a raffle</H2>
          }
          {
            !isReview
              ?
              <H7 color={COLORS[colorMode].mainTextColor}>Please fill out information below.</H7>
              :
              <H7 color={COLORS[colorMode].mainTextColor}>Please review all information before submitting.</H7>
          }
        </FlexBox>
        {
          !isReview &&
          <FlexBox direction='column' gap="22px" smGap='15px'>
            {/*****  */}
            <FlexBox>
              <FlexBox direction='column' gap='10px' smGap="5px" smMarginBottom='10px'>
                <CustomText
                  text={`Raffle name: `}
                  fontFamily='Open Sans'
                  fontSize='17px'
                  fontWeight='400'
                  smFontSize='15px'
                  smFontWeight='600'
                />
                <CustomInput
                  maxWidth='350px'
                  height='58px'
                  colorMode={colorMode}
                  placeholder='Write raffle name here'
                  value={formData.title}
                  onChange={async (e: any) => {
                    if (e.target.value.length > 20) return;
                    setFormData((prevFormData: any) => ({
                      ...prevFormData,
                      title: e.target.value
                    }));
                  }}
                />
                {
                  formData.title === '' &&
                  <ErrorText text='This input is required' />
                }
              </FlexBox>

              <FlexBox direction='column' gap='10px' smGap="5px" smMarginBottom='10px'>
                <CustomText
                  text={`NFT's `}
                  fontFamily='Open Sans'
                  fontSize='17px'
                  fontWeight='400'
                  smFontSize='15px'
                  smFontWeight='600'
                />
                <SelectNFTBox
                  setFormData={setFormData}
                  formData={formData}
                />
                {
                  formData.selectedNFTs.length === 0 &&
                  <ErrorText text='Need to select at least one NFT' />
                }
              </FlexBox>
            </FlexBox>

            <FlexBox>
              <FlexBox direction='column' gap='10px' smGap="5px" smMarginBottom='10px'>
                <CustomText
                  text={`Description: `}
                  fontFamily='Open Sans'
                  fontSize='17px'
                  fontWeight='400'
                  smFontSize='15px'
                  smFontWeight='600'
                />
                <CustomTextArea
                  maxWidth='350px'
                  height='116px'
                  placeholder='Write raffle description here'
                  value={formData.description}
                  onChange={(e: any) => {
                    if (e.target.value.length > 56) return;
                    setFormData((prevFormData: any) => ({
                      ...prevFormData,
                      description: e.target.value
                    }));
                  }}
                />
                {
                  formData.description.length === 0 &&
                  <ErrorText text='This input is required' />
                }
              </FlexBox>

              <FlexBox>
                <FlexBox direction='column' gap='10px' smGap="5px" smMarginBottom='10px'>
                  <CustomText
                    text={`Minimum tickets: `}
                    fontFamily='Open Sans'
                    fontSize='17px'
                    fontWeight='400'
                    smFontSize='15px'
                    smFontWeight='600'
                  />

                  <CustomInput
                    maxWidth='175px'
                    height='58px'
                    bgColor='#cfcfcf'
                    type='number'
                    placeholder='Select minimum tickets'
                    value={formData.minTicket}
                    onChange={(e: any) => {
                      if (e.target.value < 0) return;
                      setFormData((prevFormData: any) => ({
                        ...prevFormData,
                        minTicket: parseInt(e.target.value)
                      }));
                    }}
                  />
                  {
                    !formData.minTicket &&
                    <ErrorText text='This input is required' />
                  }
                </FlexBox>
                <FlexBox direction='column' gap='10px' smGap="5px" smMarginBottom='10px'>
                  <CustomText
                    text={`Maximum tickets: `}
                    fontFamily='Open Sans'
                    fontSize='17px'
                    fontWeight='400'
                    smFontSize='15px'
                    smFontWeight='600'
                  />
                  <CustomInput
                    maxWidth='175px'
                    height='58px'
                    type='number'
                    colorMode={colorMode}
                    placeholder='Select maximum tickets'
                    min={formData.minTicket}
                    value={formData.maxTicket}
                    onChange={(e: any) => {
                      if (e.target.value < 0) return;
                      setFormData((prevFormData: any) => ({
                        ...prevFormData,
                        maxTicket: parseInt(e.target.value)
                      }));
                    }}
                  />

                  {
                    formData.maxTicket ?
                      (formData.maxTicket < formData.minTicket &&
                        <ErrorText
                          text={`maximum ticket should be higher than mininum ticket`}
                        />
                      )
                      :
                      <ErrorText text='This input is required' />
                  }
                </FlexBox>
              </FlexBox>
            </FlexBox>
            <FlexBox>
              <FlexBox direction='column' gap='10px' smGap="5px" smMarginBottom='10px'>
                <CustomText
                  text={`Currency `}
                  fontFamily='Open Sans'
                  fontSize='17px'
                  fontWeight='400'
                  smFontSize='15px'
                  smFontWeight='600'
                />
                <SelectCurrencyBox
                  setFormData={setFormData}
                  formData={formData}
                />

                {
                  formData.currency === '' &&
                  <ErrorText text='This input is required' />
                }
              </FlexBox>
              <FlexBox justifyContent='start' direction='column' gap='10px' smGap="5px" smMarginBottom='10px'>
                <CustomText
                  text={`End Date: `}
                  fontFamily='Open Sans'
                  fontSize='17px'
                  fontWeight='400'
                  smFontSize='15px'
                  smFontWeight='600'
                />
                <CustomDatePicker
                  selected={formData.endDate}
                  colorMode={colorMode}
                  onChange={(d: Date) => {
                    if (d > today) {
                      let timeRemainingText = outputEndTimeRemaining(d);
                      console.log("timeRemainingText", timeRemainingText)
                      setFormData((prevFormData: any) => ({
                        ...prevFormData,
                        endTimeRemaining: timeRemainingText,
                        endDate: d
                      }));
                    }

                  }}
                  showTimeSelect
                  timeFormat="p"
                  timeIntervals={15}
                  dateFormat="Pp"
                  showTimeInput
                  minDate={today_12_hours_later}
                  maxDate={endTime}
                // style={{
                //   color: 'red'
                // }}
                />
              </FlexBox>
            </FlexBox>

            <FlexBox>
              <FlexBox direction='column' gap='10px' smGap="5px" smMarginBottom='10px'>
                <CustomText
                  text={`Price: `}
                  fontFamily='Open Sans'
                  fontSize='17px'
                  fontWeight='400'
                  smFontSize='15px'
                  smFontWeight='600'
                />
                <CustomInput
                  maxWidth='235px'
                  height='58px'
                  bgColor='#cfcfcf'
                  placeholder='Select price per ticket'
                  value={formData.price}
                  type='number'
                  onChange={(e: any) => {
                    setFormData((prevFormData: any) => ({
                      ...prevFormData,
                      price: e.target.value
                    }));
                  }}
                />
                {
                  !formData.price &&
                  <ErrorText text='This input is required' />
                }
              </FlexBox>
            </FlexBox>

            <FlexBox justifyContent='end'>
              <CustomButton
                text={`Review`}
                width='197px'
                height='50px'

                onClick={() => {
                  if (!formData.title || !formData.description || !formData.currency || !formData.price || !formData.minTicket || !formData.endDate || !formData.endTimeRemaining || formData.selectedNFTs.length === 0 || formData.minTicket > formData.maxTicket) {
                    infoAlert("You need to type inputs exactly")
                  } else {
                    setIsReview(true)
                  }
                }
                }
                smWidth='146px'
                smHeight='42px'
              />
            </FlexBox>

          </FlexBox>
        }
        {
          isReview &&
          <FlexBox maxWidth='1159px' justifyContent='space-between'>
            {/** image slicker*/}
            <FlexBox maxWidth='494px' direction='column'>
              <FlexBox alignItems='center' gap='10px' smDirection='row' justifyContent='start'>
                <CustomImage
                  image={SLICK_LEFT_ICON}
                  width='18.6px'
                  height='37.8px'
                  smWidth='10px'
                  smHeight='18.6px'
                  cursor='pointer'
                  onClick={() => {
                    if (activeNFT !== 0)
                      setActiveNFT(activeNFT => activeNFT - 1)
                  }}
                />
                <CustomImage
                  image={formData.selectedNFTs && formData.selectedNFTs.length > 0 &&
                    getExactImageFormat(formData.selectedNFTs[activeNFT].image)
                  }
                  width='268px'
                  height='268px'
                  smHeight='153px'
                  smWidth='153px'
                  borderRadius='3px'
                />
                <CustomImage
                  image={SLICK_RIGHT_ICON}
                  width='18.6px'
                  height='37.8px'
                  smWidth='10px'
                  smHeight='18.6px'
                  cursor='pointer'
                  onClick={() => {
                    if (activeNFT < formData.selectedNFTs.length - 1) setActiveNFT(activeNFT => activeNFT + 1)
                  }}
                />
              </FlexBox>
              <div className='small-images'>
                {
                  formData.selectedNFTs && formData.selectedNFTs.length > 0 && formData.selectedNFTs.slice(Math.floor(activeNFT / 5) * 5, Math.floor(activeNFT / 5) * 5 + 5).map((item: any, j: number) => {
                    return (
                      <LazyLoadImage
                        src={
                          getExactImageFormat(item.image)
                        }

                        key={j}
                        alt={`img-slick-nft` + j}
                        // @ts-ignore
                        className={(j + Math.floor(activeNFT / 5) * 5) === activeNFT && 'active'}
                        onClick={() => {
                          setActiveNFT(j + Math.floor(activeNFT / 5) * 5)
                        }}
                        style={{
                          'cursor': 'pointer'
                        }}
                      />
                    )
                  })
                }
              </div>

            </FlexBox>
            <FlexBox direction='column' maxWidth='350px'>
              {/** title, description, created by */}
              <FlexBox direction='column' gap="36px" smGap='13px'>
                <FlexBox direction='column' gap='10px' smGap='5px'>
                  <CustomText
                    text={formData.title}
                    fontSize='28px'
                    smFontSize='17px'
                    fontWeight='700'
                    letterSpacing='-0.14px'
                  />
                  <CustomText
                    text={`Created by: Account Name`}
                    fontSize='16px'
                    fontWeight='400'
                    smFontSize='12px'
                  />
                </FlexBox>
                <CustomText
                  text={formData.description}
                  fontWeight='400'
                  fontSize='14px'
                  maxWidth='462px'
                  smFontSize='12px'
                  fontFamily='Open Sans'
                />
              </FlexBox>

              <FlexBox direction='column' marginTop='38px' smMarginTop='15px' color={COLORS[colorMode].mainTextColor}>
                {/**** table */}
                <CreateRaffleTable>
                  <CreateRaffleTableRow>
                    <CreateRaffleTableSubject>
                      Ticket Price:
                    </CreateRaffleTableSubject>

                    <CreateRaffleTableValue>
                      {`₳` + formData.price}
                    </CreateRaffleTableValue>
                  </CreateRaffleTableRow>

                  <CreateRaffleTableRow>
                    <CreateRaffleTableSubject>
                      Min. Tickets:
                    </CreateRaffleTableSubject>
                    <CreateRaffleTableValue>
                      {formData.minTicket}
                    </CreateRaffleTableValue>
                  </CreateRaffleTableRow>

                  <CreateRaffleTableRow>
                    <CreateRaffleTableSubject>
                      Max. Tickets:
                    </CreateRaffleTableSubject>

                    <CreateRaffleTableValue>
                      {formData.maxTicket}
                    </CreateRaffleTableValue>
                  </CreateRaffleTableRow>

                  <CreateRaffleTableRow>
                    <CreateRaffleTableSubject>
                      Ends:
                    </CreateRaffleTableSubject>
                    <CreateRaffleTableValue className='red'>
                      {formData.endTimeRemaining}
                    </CreateRaffleTableValue>

                  </CreateRaffleTableRow>

                </CreateRaffleTable>

              </FlexBox>

              <FlexBox direction='column' marginTop='48px' maxWidth='371px' className='mx-auto' gap='25px'>

                <FlexBox gap="6px" justifyContent='start' smJustifyContent='start' smDirection='row'>
                  <CustomCheckBox type="checkbox" onClick={() => {
                    setFormData((prevFormData: any) => ({
                      ...prevFormData,
                      agree1: !formData.agree1
                    }));
                  }}
                    name="agree1" checked={formData.agree1} />
                  <AcceptText color={COLORS[colorMode].mainTextColor}>
                    <b>*&nbsp;</b>I agree and accept the terms and services
                  </AcceptText>
                </FlexBox>
                <FlexBox gap="6px" justifyContent='start' smJustifyContent='start' smDirection='row'>
                  <CustomCheckBox type="checkbox" onClick={() => {
                    setFormData((prevFormData: any) => ({
                      ...prevFormData,
                      agree2: !formData.agree2
                    }));
                  }}
                    name="agree2" checked={formData.agree2} />
                  <AcceptText color={COLORS[colorMode].mainTextColor}>
                    <b>*&nbsp;</b>I agree and accept there is an Initiation Fee of ₳2 + 3% from the Raffle Ticket Pool
                  </AcceptText>
                </FlexBox>
              </FlexBox>
              {/** submit buttons */}
              <FlexBox marginTop='67px' gap='20px' justifyContent='start' smJustifyContent='end' smDirection='row' smMarginTop='52px'>
                <CustomBorderButton
                  text='Back'
                  onClick={() => {
                    setIsReview(false)
                  }}
                  width='197px'
                  height='50px'
                  smWidth='146px'
                  smHeight='42px'
                />
                <CustomButton
                  text='Submit'
                  width='197px'
                  height='50px'
                  onClick={() => {
                    if (formData.agree2 && formData.agree1) {
                      submit()
                    }
                  }}
                  disabled={!formData.agree1 || !formData.agree2}
                  smWidth='146px'
                  smHeight='42px'
                />
              </FlexBox>
            </FlexBox>
          </FlexBox>
        }
      </ModalBody>

    </StyledModal>
  )
}

export default CreateRaffleModal