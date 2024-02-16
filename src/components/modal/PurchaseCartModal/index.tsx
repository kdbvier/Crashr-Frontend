import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import CustomImage from '@/components/common/CustomImage';
import { BLUE_EXCLAMATION_ICON, PARTNER_ICON, VERIFIED_ICON_IMAGE } from '@/constants/image.constants';
import { device } from '@/styles/Breakpoints';
import { FlexBox } from '@/components/common/FlexBox';
import CustomButton from '@/components/common/CustomButton';
import CustomText from '@/components/common/CustomText';
import { getExactImageFormat } from '@/hooks/function';
import { useCallback, useEffect, useState } from 'react';
import { COLLECTION_DATA } from '@/constants/document';
import { useWalletConnect } from '@/context/WalletConnect';
import { getNFTDetailByAsset } from '@/api/api';
import { useCart } from '@/context/CartContext';
import { ThreeDots } from 'react-loader-spinner';
import { useGlobalContext } from '@/context/GlobalContext';
import { COLORS } from '@/constants/colors.constants';
import { CustomCheckBox } from '../CreatePollsModal/index.styled';
import { AcceptText } from '../CreateRaffleModal/index.styled';

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
  purchaseCarts: () => Promise<void>;
}

const PurchaseCartModal = ({ show, onClose, purchaseCarts }: Props) => {
  // const [cartData, setCartData] = useLocalStorage('cart-data', []);
  const [nftData, setNFTData] = useState([])
  const [totalPrice, setTotalPrice] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)
  const [isChecked, setIsChecked] = useState<boolean>(false)

  const { myWalletAddress } = useWalletConnect()
  const { colorMode } = useGlobalContext()
  const { cartData, addToCart, removeFromCart } = useCart()

  useEffect(() => {
    if (cartData.length > 0) {
      setLoading(true)
      getNFTData()
    } else {
      setLoading(false)
      setTotalPrice(0)
      setNFTData([])
    }
  }, [cartData])

  const getNFTData = useCallback(async () => {
    const nfts: any = [];
    let price = 0;
    for (let i = 0; i < cartData.length; i++) {
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
    setLoading(false)
    setTotalPrice(price)
  }, [cartData])

  return (
    <StyledModal show={show} onHide={onClose} centered contentClassName="connect-success-content" colorMode={colorMode}>
      <Modal.Header closeButton>
      </Modal.Header>
      <ModalBody>
        {
          loading &&
          <FlexBox smJustifyContent='center' smAlignItems='center'>
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#f73737"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              visible={true}
            />
          </FlexBox>
        }
        {
          // if there is no added nfts in cart
          !loading && nftData.length === 0 &&
          <>
            <CustomImage
              image={BLUE_EXCLAMATION_ICON}
              width='80px'
              height='80px'
            />
            <CustomText
              text="Uh oh!"
              fontSize='50px'
              fontWeight='700'
              marginTop='37px'
            />
            <CustomText
              text="Your cart is empty. Please add one or more NFTs to proceed to check out. "
              fontSize='Open Sans'
              fontWeight='400'
              marginTop='16px'
              textAlign='center'
              width='410px'
              color={COLORS[colorMode].mainTextColor}
            />
            <CustomButton
              text='Close'
              width='286px'
              height='48px'
              bgColor='#1b78af'
              marginTop='73px'
              onClick={() => onClose()}
            />
          </>
        }
        {
          // if there is 1+ added nfts in cart
          !loading && nftData.length > 0 &&
          <>
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
            {/** Modal Content */}
            <FlexBox marginTop='32px' direction='column'>
              <S.ItemLength color={COLORS[colorMode].mainTextColor}>
                {`${nftData.length} item(s)`}
              </S.ItemLength>
              <S.ScrollFlex>
                {
                  nftData && nftData.map((nft: any, index: number) => {
                    return (
                      <FlexBox
                        key={index}
                        justifyContent='space-between'
                        gap='24px'
                        alignItems='center'
                        smDirection='row'
                        smGap='18px'
                        smJustifyContent='space-between'
                      >
                        <S.NFTImageCardComp>
                          {
                            nft.isBundle &&
                            <S.ListedBadge>
                              Bundle
                            </S.ListedBadge>
                          }

                          <S.NFTImage
                            src={getExactImageFormat(nft.image)}
                          />
                        </S.NFTImageCardComp>

                        {/*** NFTContentsGroup */}
                        <S.NFTContentsGroup>
                          <S.NFTName href={`/nfts/${nft.asset}`} color={COLORS[colorMode].mainTextColor}>
                            {
                              nft.name
                            }
                          </S.NFTName>

                          <FlexBox
                            justifyContent='start' gap='4px' alignItems='center' smDirection='row' smJustifyContent='start' smGap='4px'
                          >
                            <S.CollectionName
                              href={`/collections/${nft.asset.slice(0, 56)}`}
                              color={COLORS[colorMode].mainTextColor}
                            >
                              {COLLECTION_DATA.hasOwnProperty(nft.asset.slice(0, 56)) ? COLLECTION_DATA[nft.asset.slice(0, 56)].name : nft.asset.slice(0, 56)}
                            </S.CollectionName>
                            {
                              COLLECTION_DATA.hasOwnProperty(nft.asset.slice(0, 56)) &&
                              <S.BadgeIcon
                                src={VERIFIED_ICON_IMAGE}
                              />
                            }
                            {
                              nft.asset.slice(0, 56) === "848838af0c3ab2e3027d420e320c90eb217f25b8b097efb4378e90f5" &&
                              <S.BadgeIcon
                                src={PARTNER_ICON}
                              />
                            }

                          </FlexBox>
                        </S.NFTContentsGroup>
                        <FlexBox direction='column' width='auto' gap="4px" paddingRight='10px' smWidth='51px'>
                          <CustomText
                            text={`₳${nft.price}`}
                            color='#6073F6'
                            fontFamily='Inconsolata'
                            fontSize='21px'
                            fontWeight='700'
                            width='100%'
                            justifyContent='end'
                          />

                          <S.RemoveButton onClick={() => {
                            removeFromCart(nft)
                          }}>
                            Remove
                          </S.RemoveButton>
                        </FlexBox>
                      </FlexBox>
                    )
                  })
                }
              </S.ScrollFlex>

              {/** Royalty */}
              {/* <FlexBox marginBottom='16px' justifyContent='space-between' smDirection='row'>
                <FlexBox direction='column' gap="6px">
                  <CustomText
                    text={`Royalty (10%)`}
                    fontFamily='Open Sans'
                    fontWeight='600'
                    fontSize='17px'
                    lineHeight='120%'
                    smFontSize='15px'
                  />
                  <CustomText
                    text={`*This amount goes directly to the project`}
                    color="#1eb4c1"
                    fontFamily='Open Sans'
                    fontWeight='400'
                    fontSize='15px'
                    smFontSize='13px'
                  />
                </FlexBox>
                <CustomText
                  text={`₳8`}
                  fontFamily='Open Sans'
                  fontWeight='400'
                  fontSize='17px'
                  lineHeight='130%'
                />
              </FlexBox> */}

              <FlexBox
                justifyContent='space-between'
                alignItems='center'
                borderTop='1px solid #B2B2B2'
                paddingTop='16px'
                smDirection='row'
                smJustifyContent='space-between'
                smPaddingTop='14px'
              >
                <CustomText
                  text={`Total Cost:`}
                  fontFamily='Open Sans'
                  fontWeight='600'
                  fontSize='17px'
                  smFontSize='15px'
                />
                {
                  totalPrice &&
                  <CustomText
                    text={`₳${totalPrice}`}
                    fontFamily='Open Sans'
                    fontWeight='700'
                    fontSize='28px'
                    color='#6073F6'
                  />
                }
              </FlexBox>


              <FlexBox gap="10px" justifyContent='start' marginTop='39.5px' smDirection='row'>
                <CustomCheckBox type="checkbox"
                  onClick={() => {
                    setIsChecked(!isChecked)
                  }}
                  name="agree2" checked={isChecked}
                />
                <AcceptText color={COLORS[colorMode].mainTextColor}>
                  <b>*&nbsp;</b>I agree and accept the terms and services
                </AcceptText>
              </FlexBox>


              <FlexBox marginTop='56px' justifyContent='end' smJustifyContent='end'>
                <CustomButton
                  text='Purchase'
                  width='197px'
                  height='50px'
                  disabled={myWalletAddress === undefined}
                  onClick={() => {
                    if (isChecked) {
                      purchaseCarts()
                    }
                  }}
                  smWidth='146px'
                  smHeight='42px'
                />
              </FlexBox>
            </FlexBox>
          </>
        }
      </ModalBody >
    </StyledModal >
  )
}

export default PurchaseCartModal