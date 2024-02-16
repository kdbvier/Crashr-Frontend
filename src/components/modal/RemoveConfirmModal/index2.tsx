import styled from 'styled-components';
import { Modal } from 'react-bootstrap';


import { device } from '@/styles/Breakpoints';

import { useState } from 'react';
import { useWalletConnect } from '@/context/WalletConnect';
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
  padding-top: 142px;
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
  confirmText: string;
  infoText?: string;
  confirm: () => void;
}
const RemoveConfirmModal = ({ show, onClose, confirmText, confirm, infoText }: Props) => {
  const [inputPrice, setInputPrice] = useState<number>(0)
  const { myWalletAddress, lucid } = useWalletConnect();
  const { colorMode } = useGlobalContext()

  return (
    <StyledModal show={show} onHide={onClose} centered contentClassName="connect-success-content" colorMode={colorMode}>
      <Modal.Header closeButton>
      </Modal.Header>
      <ModalBody>
        what?
        {/* <CustomText
          text={confirmText}
          fontSize='28px'
          fontWeight='700'
          textAlign='center'
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
          />
        }
        <FlexBox direction='column' alignItems='center' gap="16px" marginTop='87px'>
          <CustomBorderButton
            text='Confirm'
            width='286px'
            onClick={() => {
              confirm()
            }}
          />
          <CustomButton
            text='Cancel'
            width='286px'
            height='48px'
            onClick={onClose}
          />
        </FlexBox> */}

      </ModalBody>
    </StyledModal >
  )
}

export default RemoveConfirmModal