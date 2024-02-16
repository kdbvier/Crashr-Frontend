import styled from 'styled-components';
import { Modal } from 'react-bootstrap';

import CustomBorderButton from '@/components/common/CustomBorderButton';
import { FlexBox } from '@/components/common/FlexBox';
import CustomButton from '@/components/common/CustomButton';
import CustomText from '@/components/common/CustomText';

import { useGlobalContext } from '@/context/GlobalContext';
import { device } from '@/styles/Breakpoints';

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
  padding-top: 142px;
  @media ${device.sm} {
    padding-top: 48px;
  }
  &.modal-body{

  }
`



interface Props {
  show: boolean;
  onClose: () => void;
  data: any;
  cancelMyOffer: (utxoValue: string) => void;
}
const CancelOfferModal = ({ show, onClose, data, cancelMyOffer }: Props) => {

  const { colorMode } = useGlobalContext()
  return (
    <StyledModal show={show} onHide={onClose} centered contentClassName="connect-success-content" colorMode={colorMode}>
      <Modal.Header closeButton>
      </Modal.Header>
      <ModalBody>
        <CustomText
          text={`Are you sure you want to cancel this offer?`}
          fontSize='33px'
          fontWeight='600'
          textAlign='center'
          smFontSize='25px'
        />
        <FlexBox direction='column' alignItems='center' gap="16px" marginTop='87px'>
          <CustomBorderButton
            text='Confirm'
            width='286px'
            onClick={() => {
              cancelMyOffer(data.utxo)
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

      </ModalBody>
    </StyledModal>
  )
}

export default CancelOfferModal