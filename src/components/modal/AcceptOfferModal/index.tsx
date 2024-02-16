import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import CustomImage from '@/components/common/CustomImage';
import { VERIFIED_ICON_IMAGE } from '@/constants/image.constants';
import { device } from '@/styles/Breakpoints';
import { FlexBox } from '@/components/common/FlexBox';
import CustomButton from '@/components/common/CustomButton';
import CustomText from '@/components/common/CustomText';
import { getExactImageFormat } from '@/hooks/function';
import { useEffect, useState } from 'react';
import { COLLECTION_DATA, TOKEN_ARRAY } from '@/constants/document';
import CustomBorderButton from '@/components/common/CustomBorderButton';
import { getNFTDetailByAsset } from '@/api/api';
import { useGlobalContext } from '@/context/GlobalContext';
import axios from 'axios';
import * as S from '../PurchaseCartModal/index.styled'
import { COLORS } from '@/constants/colors.constants';
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
  data: any;
  acceptOffer: (listingUtxoValue: string, offerUtxoValue: string, assetValue: string) => Promise<void>;
}
const AcceptOfferModal = ({ show, onClose, data, acceptOffer }: Props) => {
  const [inputPrice, setInputPrice] = useState<number>(5)
  const [formData, setFormData] = useState({
    currency: 'ADA',
    selectedNFTs: []
  })
  const [nftData, setNFTData] = useState<any>();
  const [nftUxo, setNftUtxo] = useState<string>();
  const [offerType, setOfferType] = useState<string>('')
  const [offerOption, setOfferOption] = useState<number>(0);
  const [nftImages, setNftImages] = useState<string[]>([]);

  const { listedAllNFTs, colorMode } = useGlobalContext()




  useEffect(() => {
    if (Object.keys(data.offer).length === 1) {
      setOfferType("ada")
    }
    if (Object.keys(data.offer).length > 1) {
      if (Object.keys(TOKEN_ARRAY).includes(Object.keys(data.offer)[1])) {
        setOfferType("token")
      } else {
        setOfferType("nft")
      }
    }
  }, [data])

  useEffect(() => {
    if (data.unit !== '' && listedAllNFTs) {
      getNFTData()
      const utxo: any = getUtxoByAsset(listedAllNFTs, data.unit)
      setNftUtxo(utxo)
    }
  }, [data.unit, listedAllNFTs])


  useEffect(() => {
    const fetchNftImages = async () => {
      const images = await Promise.all(
        Object.keys(data.offer).slice(1).map(async (nft: string) => {
          const { data } = await axios.get("https://fk6vsmvml8.execute-api.eu-west-2.amazonaws.com/default/getNFTinfo?unit=" + nft);
          console.log("response data", data)

          if (data) {
            return getExactImageFormat(data.onchain_metadata.image);
          }
        })
      );
      console.log("fetch images", images)
      setNftImages(images);
    };

    if (offerType && offerType === "nft") {

      fetchNftImages();
    }
  }, [offerType])

  function getUtxoByAsset(data: ListedNFTList, asset: string) {
    for (let key in data) {
      if (data[key].nfts.hasOwnProperty(asset)) {
        return key;
      }
    }
    return null; // return null if tokenId does not exist in any nft object
  }


  const getNFTData = async () => {
    const response = await getNFTDetailByAsset(data.unit)
    console.log("response", response)
    setNFTData({
      name: response.onchain_metadata.name,
      asset: response.asset,
      image: response.onchain_metadata.image
    })
  }
  return (

    <StyledModal show={show} onHide={onClose} centered contentClassName="connect-success-content" colorMode={colorMode}>
      <Modal.Header closeButton>
      </Modal.Header>
      <ModalBody>
        <FlexBox
          direction='column'
          gap='12px'
          borderBottom='1px #cecece solid'
          paddingBottom='20px'
          smPaddingBottom='14px'
        >
          <S.ModalTitle color={COLORS[colorMode].mainTextColor}>
            Accept this offer?
          </S.ModalTitle>
          <S.ModalNote color={COLORS[colorMode].mainTextColor}>
            Please review all information before submitting.
          </S.ModalNote>
          <CustomText
            text={`<strong>*</strong>Please note that there is a service fee of 1.99% to accept an NFT offer.`}
            fontFamily='Open Sans'
            fontWeight='400'
            fontSize='15px'
            display='block'
            smFontSize='13px'
          />
        </FlexBox>
        <FlexBox marginTop='32px' paddingLeft='25px' paddingRight='25px' direction='column'>
          {
            <CustomText
              text={`Item`}
              fontFamily='Open Sans'
              fontWeight='600'
              fontSize='17px'
              smFontSize='15px'
              marginBottom='23px'
            />
          }
          {
            nftData ?
              <FlexBox
                justifyContent='start'
                gap='24px'
                alignItems='center'
                smDirection='row'
                smGap='18px'
                smJustifyContent='start'>

                <S.NFTImage
                  src={nftData && getExactImageFormat(nftData.image)}
                />
                <S.NFTContentsGroup>

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
                      {nftData && (COLLECTION_DATA.hasOwnProperty(nftData.asset.slice(0, 56)) ? COLLECTION_DATA[nftData.asset.slice(0, 56)].name : nftData.asset.slice(0, 56))}
                    </S.CollectionName>
                    {
                      nftData && COLLECTION_DATA.hasOwnProperty(nftData.asset.slice(0, 56)) &&
                      <S.BadgeIcon
                        src={VERIFIED_ICON_IMAGE}
                      />
                    }
                  </FlexBox>

                </S.NFTContentsGroup>
              </FlexBox>
              :
              ''
          }

          {

            <>
              {/*** ADA Offer */}
              {
                offerType && offerType === 'ada' &&
                <>
                  <FlexBox marginTop='32.5px' paddingTop='32.5px' paddingBottom='30px' direction='column' borderTop='#cecece 1px solid' gap="12px">
                    <FlexBox justifyContent='start' alignItems='center' smDirection='row' smJustifyContent='space-between'>
                      <CustomText
                        text={`Offer Type:`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='17px'
                        smFontSize='15px'
                      />
                      &nbsp;
                      <CustomText
                        text={` Currency(₳)`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='17px'
                        smFontSize='15px'
                        color='#6073F6'
                      />
                    </FlexBox>
                    <FlexBox justifyContent='space-between' alignItems='center' smDirection='row' smJustifyContent='space-between'>
                      <CustomText
                        text={`Offer Amount:`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='17px'
                        smFontSize='15px'
                      />
                      <CustomText
                        text={`₳${parseInt(data.offer.lovelace) / 1000000}`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='17px'
                        smFontSize='15px'
                        color='#6073F6'
                      />
                    </FlexBox>
                  </FlexBox>
                  <FlexBox justifyContent='space-between' alignItems='center' gap="12px" paddingTop='12px'
                    borderTop='#cecece 1px solid'
                    smDirection='row' smJustifyContent='space-between'
                  >
                    <CustomText
                      text={`Total Earnings:`}
                      fontFamily='Open Sans'
                      fontWeight='600'
                      fontSize='17px'
                      smFontSize='15px'
                    />
                    <CustomText
                      text={
                        `₳${parseInt(data.offer.lovelace) / 1000000}
                                        `}
                      fontFamily='Open Sans'
                      fontWeight='700'
                      fontSize='28px'
                      color='#6073F6'
                    />
                  </FlexBox>
                </>
              }
              {/*** NFT Offer */}
              {
                offerType && offerType === 'nft' &&
                <>
                  <FlexBox marginTop='32.5px' paddingTop='32.5px' paddingBottom='30px' direction='column' borderTop='#cecece 1px solid' gap="12px">
                    <FlexBox justifyContent='start' alignItems='center' smDirection='row' smJustifyContent='space-between'>
                      <CustomText
                        text={`Offer Type:`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='17px'
                        smFontSize='15px'
                      />
                      &nbsp;
                      <CustomText
                        text={` NFT(s)`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='17px'
                        smFontSize='15px'
                        color='#6073F6'
                      />
                    </FlexBox>
                    <FlexBox justifyContent='space-between' alignItems='center'>
                      <CustomText
                        text={`Offer:`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='17px'
                        smFontSize='15px'
                      />
                      <FlexBox flexWrap='wrap' gap="25px" justifyContent='start' maxWidth='240px'>
                        {
                          nftImages && nftImages.map((image: string) => {
                            return (
                              <CustomImage image={image} width="48px" height='48px'
                              />
                            )
                          })
                        }
                      </FlexBox>

                    </FlexBox>
                  </FlexBox>
                  <FlexBox justifyContent='space-between' alignItems='center' gap="12px" paddingTop='12px'
                    borderTop='#cecece 1px solid'
                    smDirection='row' smJustifyContent='space-between'
                  >
                    <CustomText
                      text={`Service Fee(flat rate):`}
                      fontFamily='Open Sans'
                      fontWeight='600'
                      fontSize='17px'
                      smFontSize='15px'
                    />
                    <CustomText
                      text={
                        // @ts-ignore
                        `₳5`
                      }
                      fontFamily='Open Sans'
                      fontWeight='700'
                      fontSize='28px'
                      color='#6073F6'
                    />
                  </FlexBox>
                </>
              }
              {/*** Token Offer */}
              {
                offerType && offerType === 'token' &&
                <>
                  <FlexBox marginTop='32.5px' paddingTop='32.5px' paddingBottom='30px' direction='column' borderTop='#cecece 1px solid' gap="12px">
                    <FlexBox justifyContent='start' alignItems='center' smDirection='row' smJustifyContent='space-between'>
                      <CustomText
                        text={`Offer Type:`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='17px'
                        smFontSize='15px'
                      />
                      &nbsp;
                      <CustomText
                        text={` Currency(${TOKEN_ARRAY[Object.keys(data.offer)[1]].symbol})`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='17px'
                        smFontSize='15px'
                        color='#6073F6'
                      />
                    </FlexBox>
                    <FlexBox justifyContent='space-between' alignItems='center' smDirection='row' smJustifyContent='space-between'>
                      <CustomText
                        text={`Offer Amount:`}
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='17px'
                        smFontSize='15px'
                      />
                      <CustomText
                        text={
                          // @ts-ignore
                          `${parseInt(Object.values(data.offer)[1]) / Math.pow(10, TOKEN_ARRAY[Object.keys(data.offer)[1]].decimals)}
                                                    ${TOKEN_ARRAY[Object.keys(data.offer)[1]].symbol}`
                        }
                        fontFamily='Open Sans'
                        fontWeight='600'
                        fontSize='17px'
                        smFontSize='15px'
                        color='#6073F6'
                      />
                    </FlexBox>
                  </FlexBox>
                  <FlexBox justifyContent='space-between' alignItems='center' gap="12px" paddingTop='12px'
                    borderTop='#cecece 1px solid'
                    smDirection='row' smJustifyContent='space-between'
                  >
                    <CustomText
                      text={`Total Earnings:`}
                      fontFamily='Open Sans'
                      fontWeight='600'
                      fontSize='17px'
                      smFontSize='15px'
                    />
                    <CustomText
                      text={
                        // @ts-ignore
                        `${parseInt(Object.values(data.offer)[1]) / Math.pow(10, TOKEN_ARRAY[Object.keys(data.offer)[1]].decimals)}
                                                ${TOKEN_ARRAY[Object.keys(data.offer)[1]].symbol}
                                        `}
                      fontFamily='Open Sans'
                      fontWeight='700'
                      fontSize='28px'
                      color='#6073F6'
                    />
                  </FlexBox>
                </>
              }

              <FlexBox marginTop='56px' justifyContent='space-between' smJustifyContent='space-between' smDirection='row'>
                <CustomBorderButton
                  text="Decline Offer"
                  onClick={() => {
                    onClose()
                  }}
                  width='197px'
                  height='50px'
                  smWidth='146px'
                  smHeight='42px'
                />
                <CustomButton
                  text='Accept Offer'
                  disabled={!nftUxo && nftUxo === ''}
                  width='197px'
                  height='50px'
                  onClick={() => {
                    if (!nftUxo) return;
                    acceptOffer(nftUxo, data.utxo, data.unit)
                  }}
                  smWidth='146px'
                  smHeight='42px'
                />

              </FlexBox>
            </>
          }

        </FlexBox>
      </ModalBody>
    </StyledModal>
  )
}

export default AcceptOfferModal