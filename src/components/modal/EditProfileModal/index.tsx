import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import { device } from '@/styles/Breakpoints';
import { H2 } from '@/components/typography';
import { FlexBox } from '@/components/common/FlexBox';
import CustomImage from '@/components/common/CustomImage';
import { useGlobalContext } from '@/context/GlobalContext';
import CustomInput from '@/components/common/CustomInput';
import CustomButton from '@/components/common/CustomButton';
import { useWalletConnect } from '@/context/WalletConnect';
import { InputRequiredText } from './index.styled';
import { updateUserProfile } from '@/api/api';
import { CAMERA_ICON } from '@/constants/image.constants';
import { useEffect, useState } from 'react';
import CustomTextArea from '@/components/common/CustomTextarea';
import SelectNFTModal from '../SelectNFTModal';
import { getExactImageFormat } from '@/hooks/function';
import { COLORS } from '@/constants/colors.constants';

interface IStyledModalProps {
  colorMode?: string;
}
const StyledModal = styled(Modal) <IStyledModalProps>`
  background: rgba(50, 50, 50, 0.4);
  .modal-dialog{
    margin: auto;
    max-width: 1351px;
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
  padding: 18px 145px 92px 145px; 
  @media ${device.sm} {
    padding: 18px 31px 54px 31px; 
  }
  &.modal-body{
  }
`

const EditProfileButton = styled.div`
  position: absolute;
  border-radius: 3px;
  background: rgba(231, 231, 231, 0.95);
  display: inline-flex;
  padding: 3px 6px;
  bottom: 0px;
  margin-bottom: 16px;
  justify-content: center;
  margin-left: 100px;
  gap: 6px;
  cursor: pointer;

  div{
    font-family: Open Sans;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    strong{
      color: #F73737;
    }
  }
`

interface Props {
  show: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ show, onClose }: Props) => {
  const [showSelectNFTModal, setShowSelectNFTModal] = useState<boolean>(false)
  const [formData, setFormData] = useState<any[]>([])
  const { userData, setUserData, colorMode } = useGlobalContext()
  const { myWalletAddress } = useWalletConnect()

  // update user table data
  const updateUserData = async () => {
    if (!userData) return;
    let reqData: any = {
      id: myWalletAddress,
      username: userData.username,
      user_location: userData.user_location,
      user_bio: userData.user_bio,
    };
    if (formData[0] && formData[0].image) {
      reqData['avatar'] = getExactImageFormat(formData[0].image)
    }
    try {
      const response = await updateUserProfile(reqData);
      console.log("response", response)

      return response;
    } catch (err) {
      console.log("err", err)
    }
  }



  return (
    <StyledModal show={show} onHide={onClose} centered contentClassName="connect-success-content" colorMode={colorMode}>
      <Modal.Header closeButton>
      </Modal.Header>
      <ModalBody>
        <H2 color={COLORS[colorMode].mainTextColor}>Edit your profile</H2>
        <FlexBox marginTop='48px' justifyContent='space-between'>
          <FlexBox direction='column' position='relative' width='default'>
            <InputRequiredText>
              Profile Image
            </InputRequiredText>
            <CustomImage
              width='330px'
              height='330px'
              image={
                formData.length > 0 ? (formData[0].image && getExactImageFormat(formData[0].image)) :
                  (userData && userData.avatar && userData.avatar)
              }
              borderRadius='3px'
              marginTop='6px'
            />
            <EditProfileButton onClick={() => {
              setShowSelectNFTModal(true)
            }}>
              <CustomImage
                image={CAMERA_ICON}
                width='23.23px'
                height='20.5px'
              />
              <div>Edit Image<strong>*</strong></div>
            </EditProfileButton>
          </FlexBox>
          <FlexBox direction='column' maxWidth='570px'>
            <InputRequiredText>
              Username<b>*</b>
            </InputRequiredText>
            <CustomInput
              height='58px'
              border='#767676 1px solid'
              placeholder='Write username'
              fontSize='16px'
              fontWeight='400'
              marginTop='12px'
              marginBottom='16px'
              bgColor='none'
              value={userData && userData.username && userData.username}
              onChange={(e: any) => {
                setUserData((prevFormData: any) => ({
                  ...prevFormData,
                  username: e.target.value
                }));
              }}
            />
            <InputRequiredText>
              Location
            </InputRequiredText>
            <CustomInput
              height='58px'
              bgColor='none'
              border='#767676 1px solid'
              placeholder='Write location'
              fontSize='16px'
              fontWeight='400'
              marginTop='12px'
              marginBottom='16px'
              value={userData && userData.user_location && userData.user_location}
              onChange={(e: any) => {
                setUserData((prevFormData: any) => ({
                  ...prevFormData,
                  user_location: e.target.value
                }));
              }}
            />
            <InputRequiredText>
              Bio
            </InputRequiredText>
            <CustomTextArea
              height='116px'
              placeholder='Write bio'
              fontSize='16px'
              fontWeight='400'
              marginTop='12px'
              border='#767676 1px solid'
              bgColor='none'
              value={userData && userData.user_bio && userData.user_bio}
              onChange={(e: any) => {
                setUserData((prevFormData: any) => ({
                  ...prevFormData,
                  user_bio: e.target.value
                }));
              }}
            />
            <FlexBox justifyContent='end' marginTop='77px'>
              <CustomButton
                text='Save Edits'
                onClick={() => {
                  updateUserData()
                }}
              />
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </ModalBody>
      {
        showSelectNFTModal &&
        <SelectNFTModal
          show={showSelectNFTModal}
          onClose={() => {
            setShowSelectNFTModal(false)
          }}
          formData={formData}
          setFormData={setFormData}
        />
      }

    </StyledModal>
  )
}

export default EditProfileModal