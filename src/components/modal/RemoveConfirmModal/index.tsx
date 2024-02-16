import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import { device } from '@/styles/Breakpoints';
import { FlexBox } from '@/components/common/FlexBox';
import CustomButton from '@/components/common/CustomButton';
import CustomText from '@/components/common/CustomText';
import { useGlobalContext } from '@/context/GlobalContext';

import CustomBorderButton from '@/components/common/CustomBorderButton';

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
      width: 100vw;
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
      width: 100vw;
      height: 100vh;
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

  
  &.modal-body{
    @media ${device.sm} {
      padding-top: 224x;
      padding-left: 24px;
      padding-right: 24px;
      padding-bottom: 24px;
    }
  }
`

interface Props {
  show: boolean;

  onClose: () => void;
  confirmText: string;
  infoText?: string;
  confirm: () => void;
}

const RemoveConfirmModal = ({ show, onClose, confirmText, confirm, infoText }: Props) => {
  const { colorMode } = useGlobalContext()

  return (
    <StyledModal show={show} onHide={onClose} centered contentClassName="connect-success-content" colorMode={colorMode}>
      <Modal.Header closeButton>
      </Modal.Header>
      <ModalBody>
        <CustomText
          text={confirmText}
          fontSize='33px'
          fontWeight='600'
          textAlign='center'
          smFontSize='25px'
        />
        {
          infoText &&
          <CustomText
            text={infoText}
            fontSize='17px'
            fontWeight='400'
            lineHeight='140%'
            textAlign='center'
            color='#1eb4c1'
            marginTop='24px'
            maxWidth='394px'
            smFontSize='15px'
          />
        }
        <FlexBox direction='column' alignItems='center' gap="16px" marginTop='87px'>
          <CustomBorderButton
            text='Confirm'
            width='286px'
            onClick={() => {
              confirm()
            }}
            smWidth='100%'
          />
          <CustomButton
            text='Cancel'
            width='286px'
            height='48px'
            onClick={onClose}
            smWidth='100%'
          />
        </FlexBox>
      </ModalBody >
    </StyledModal >
  )
}

export default RemoveConfirmModal