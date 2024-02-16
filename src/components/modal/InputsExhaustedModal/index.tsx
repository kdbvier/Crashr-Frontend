import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import CustomImage from '@/components/common/CustomImage';
import { YELLOW_EXCLAMATION_ICON } from '@/constants/image.constants';
import { device } from '@/styles/Breakpoints';
import CustomButton from '@/components/common/CustomButton';
import CustomText from '@/components/common/CustomText';

import { useCallback, useEffect, useState } from 'react';
import { useWalletConnect } from '@/context/WalletConnect';
import { getNFTDetailByAsset } from '@/api/api';
import { useCart } from '@/context/CartContext';
import { useGlobalContext } from '@/context/GlobalContext';
interface IStyledModalProps {
  colorMode?: string;
}
const StyledModal = styled(Modal) <IStyledModalProps>`

  background: rgba(50, 50, 50, 0.4);
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
      min-height: 100vh;
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
    padding-top: 144px;
    padding-left: 31px;
    padding-right: 31px;
  }
  &.modal-body{
  }
`

interface Props {
  show: boolean;
  onClose: () => void;
}
const InputsExhaustedModal = ({ show, onClose }: Props) => {
  // const [cartData, setCartData] = useLocalStorage('cart-data', []);
  const [nftData, setNFTData] = useState<any[]>([])
  const [totalPrice, setTotalPrice] = useState<number>()
  const { myWalletAddress } = useWalletConnect()
  const { cartData, addToCart, removeFromCart } = useCart()
  const { colorMode } = useGlobalContext()
  useEffect(() => {
    if (cartData.length > 0) {
      getNFTData()
    } else {
      setTotalPrice(0)
      setNFTData([])
    }
  }, [cartData])

  const getNFTData = useCallback(async () => {
    const nfts: any[] = [];
    let price = 0;
    for (let i = 0; i < cartData.length; i++) {
      console.log("cartData", cartData)
      // get detail data of one specific nft
      const response = await getNFTDetailByAsset(Object.keys(cartData[i].nfts)[0])
      price += parseInt(cartData[i].amount) / 1000000
      nfts.push({
        name: response.onchain_metadata.name,
        asset: response.asset,
        image: response.onchain_metadata.image,
        price: parseInt(cartData[i].amount) / 1000000,
        utxo: cartData[i].utxo,
        isBundle: Object.values(cartData[i].nfts).length > 1
      })
    }
    setNFTData(nfts)
    setTotalPrice(price)
  }, [cartData])

  return (
    <StyledModal show={show} onHide={onClose} centered contentClassName="connect-success-content" colorMode={colorMode}>
      <Modal.Header closeButton>
      </Modal.Header>
      <ModalBody>

        <CustomImage
          image={YELLOW_EXCLAMATION_ICON}
          width='80px'
          height='80px'
        />
        <CustomText
          text="Inputs Exhausted"
          fontSize='50px'
          fontWeight='700'
          marginTop='37px'
        />
        <CustomText
          text="You have exhausted your inputs to cover this transaction, meaning that you either have insufficient funds, don’t hold the asset in your wallet or have other pending transactions. "
          fontFamily='Open Sans'
          fontWeight='400'
          marginTop='16px'
          textAlign='center'
          width='410px'
          fontSize='14px'
        />
        <CustomButton
          text='Close'
          width='286px'
          height='48px'
          bgColor='#EEDE02'
          marginTop='60px'
          color='#767676'
          fontFamily='Open Sans'
          fontWeight='600'
          fontSize='18px'
          border='none'
          onClick={() => onClose()}
        />


      </ModalBody>
    </StyledModal >
  )
}

export default InputsExhaustedModal