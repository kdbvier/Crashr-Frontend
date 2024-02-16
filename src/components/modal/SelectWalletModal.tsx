import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import { FlexBox } from '../common/FlexBox';
import CustomButton from '../common/CustomButton';
import CustomImage from '@/components/common/CustomImage';
import { SUCCESS_ICON } from '@/constants/image.constants';
import CustomBorderButton from '@/components/common/CustomBorderButton';
import { device } from '@/styles/Breakpoints';
import { useGlobalContext } from '@/context/GlobalContext';

interface IStyledModalProps {
  colorMode?: string;
}
const StyledModal = styled(Modal) <IStyledModalProps>`

  .modal-dialog{
    margin: auto;
    max-width: 1351px;
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
    border-radius: 3px;
    width: 100%;
    overflow: hidden;
    border: none;
    height: 900px;
    @media screen and (max-width: 550px) {
      height: 100%;
    }
  }
`;

const ModalBody = styled(Modal.Body)`
  padding-top: 160px;
 
  height: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media ${device.sm} {
    padding-top: 48px;
  }
  &.modal-body{

  }
`

const ThanksText = styled.div`
  color: #000;
  text-align: center;
  font-family: Inconsolata;
  font-size: 67px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -1.005px;
  margin-top: 54px;
  @media ${device.sm} {
    font-size: 28px;
    letter-spacing: -0.42px;
    margin-top: 36px;
  }
`
const NoteText = styled.div`
  color: var(--true-black, #000);
  text-align: center;
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 28px;
  @media ${device.sm} {
    font-size: 14px;
    margin-top: 20px;
  }
`



interface Props {
  show: boolean;
  onClose: () => void;
  message: string;

}
const SelectWalletModal = ({ show, onClose, message }: Props) => {
  const { colorMode } = useGlobalContext()
  return (

    <StyledModal show={show} onHide={onClose} centered contentClassName="connect-success-content" colorMode={colorMode}>
      <Modal.Header closeButton>


      </Modal.Header>
      <ModalBody>
        <FlexBox
          direction='column'
          justifyContent='center'
          alignItems='center'
          smJustifyContent='center'
          smAlignItems='center'
        >
          <CustomImage
            image={SUCCESS_ICON}
            width='130px'
            height='130px'
            smHeight='78px'
            smWidth='78px'
          />
          <ThanksText>
            Thank you!
          </ThanksText>
          <NoteText>
            {message}
          </NoteText>


        </FlexBox>
        <FlexBox
          direction='column'
          marginTop='74px'
          gap='16px'
          alignItems='center'
        >
          <CustomBorderButton
            text="Go to Wallet"
            width='400px'
            height="58px"
            fontSize='18px'
            fontWeight='600'
            fontFamily='Open Sans'
            bgColor='none'
            color='#40A140'
            border='1px solid #40A140'
            smWidth='100%'
          />
          <CustomButton
            text="Close"
            width='400px'
            height="58px"
            fontSize='18px'
            fontWeight='600'
            fontFamily='Open Sans'
            bgColor='#40A140'
            onClick={onClose}
            smWidth='100%'
          />
        </FlexBox>


      </ModalBody>
    </StyledModal>
  )
}

export default SelectWalletModal