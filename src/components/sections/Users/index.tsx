import React, { useEffect, useState } from 'react'
import { Container, PageWrapper } from '@/styles/GlobalStyles'
import styled from 'styled-components'
import { FlexBox } from '@/components/common/FlexBox'
import CustomText from '@/components/common/CustomText'
import CustomImage from '@/components/common/CustomImage'
import { DEFAULT_NFT_IMAGE, DEFAULT_WALLET_NFT_IMAGE, QUESTION_ICON, } from '@/constants/image.constants'
// import MyNFTs from './MyNFTs'
import MyTokens from './MyTokens'
import MyActivity from './MyActivity'
import MyRaffles from './MyRaffles'
import MyPolls from './MyPolls'
import CopyBoard from '@/components/CopyBoard'
import { useGlobalContext } from '@/context/GlobalContext'
import { useMedia } from 'react-use'
import { JPGAssetsNote, JPGAssetsNoteHover, Question_Image } from './index.styled'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { getUserDatabyAddress } from '@/api/api'
import axios from 'axios'
import { BASE_URL } from '@/constants/document'

const ProfileHeaderBanner = styled.div`
  background-image: url('/assets/images/background/my_profile_header.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 276px;
  @media screen and (max-width: 768px) {
    height: 114px;
  }
`
const tabs = [
  "NFTs", "Tokens", "Raffles", "Polls", "Activity"
]
interface ProfileTabProps {
  active: boolean;
}
const ProfileTab = styled.div<ProfileTabProps>`
  text-align: center;
  cursor: pointer;
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  background-color: ${props => props.active ? '#afb9fa' : ''};
  padding: 6px 12px;
  border-radius: 3px;
  &:hover{
    background-color: #6073F6;
  }
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;


const User = () => {
  const isMobile = useMedia('(max-width: 768px)');
  const [activeTab, setActiveTab] = useState<string>('NFTs');

  const [isHovered, setIsHovered] = useState(false);
  // const { myBalance, userData } = useGlobalContext()
  // const { myWalletAddress } = useWalletConnect()
  const [userData, setUserData] = useState<UserDataType>({
    username: '',
    avatar: '',
    temp_avatar: '',
    points: 0,
    bomber_username: '',
    bomber_avatar: '',
    crashr: '',
    twitter: '',
    discord: '',
    wallet: '', // Make sure to include the 'wallet' property.
    friends: [],
    user_location: '',
    user_bio: ''
  });
  const [myBalance, setMyBalance] = useState({
    ADA: '',
    USD: '',
    loading: true
  });

  const { colorMode } = useGlobalContext()

  if (typeof window === "undefined") return;
  const user_addr = window.location.href.split("/users/")[1];

  useEffect(() => {
    if (user_addr !== '') {
      getUserData()
      getMyBalance()
    }
  }, [user_addr])

  const getUserData = async () => {
    try {
      const _userData = await getUserDatabyAddress(user_addr);
      if (_userData) {

        setUserData(_userData);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }

  const getMyBalance = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}users/my-balance?address=${user_addr}`
      );


      let obj: any = {};

      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.name) {
          obj[element.name.value] = parseInt(element.quantity);
        }
      }

      obj['ADA'] = parseInt(data[data.length - 1].lovelace);
      obj['loading'] = false;
      // obj['USD'] = (parseInt(data[data.length - 1].lovelace) / 1000000 * parseFloat(exchangeRate)).toFixed(0).toString()

      // @ts-ignore
      setMyBalance(obj)
      //console.log("token data", Object.values(data))
      // @ts-ignore
      setMyTokens(Object.values(data).slice(0, -1))
    } catch (err) {
      // console.log("err", err)
    }
  }



  const tooltip = (
    <JPGAssetsNoteHover>
      The “migrate” button below allows you to import listings from other platforms onto the Crashr marketplace!
    </JPGAssetsNoteHover>
  );
  return (
    <PageWrapper colorMode={colorMode}>
      <ProfileHeaderBanner />
      <Container smPaddingBottom='30px'>
        {
          !isMobile &&
          <FlexBox marginBottom='69px' position='relative' justifyContent='space-between' paddingTop='27px'>
            <FlexBox maxWidth='429px' justifyContent='space-between' lgMaxWidth='auto' lgJustifyContent='start'>
              <FlexBox direction='column' gap='10px' alignItems='center' width='auto'>
                <CustomText
                  fontSize='16px'
                  fontWeight='600'
                  text={`USD ($)`}
                  fontFamily='Open Sans'
                  className='text-nowrap'
                />
                {
                  myBalance && !myBalance.loading &&
                  <CustomText
                    fontSize='28px'
                    fontWeight='700'
                    color='#B92929'
                    text={`0`}
                    fontFamily='Open Sans'
                  />
                }
              </FlexBox>
              <FlexBox direction='column' gap='10px' alignItems='center' width='default'>
                <CustomText
                  fontSize='16px'
                  fontWeight='600'
                  text={`ADA (₳)`}
                  fontFamily='Open Sans'
                />
                {
                  myBalance && !myBalance.loading &&
                  <CustomText
                    fontSize='28px'
                    fontWeight='700'
                    color='#B92929'
                    text={(parseInt(myBalance.ADA) / 1000000).toFixed(0)}
                    fontFamily='Open Sans'
                  />
                }

              </FlexBox>
              <FlexBox direction='column' gap='10px' alignItems='center' width='default'>
                <CustomText
                  fontSize='16px'
                  fontWeight='600'
                  text={`Country`}
                  fontFamily='Open Sans'
                />
                <CustomText
                  fontSize='28px'
                  fontWeight='700'
                  color='#B92929'
                  text={userData && userData.user_location ? userData.user_location : ''}
                  fontFamily='Open Sans'
                />
              </FlexBox>
            </FlexBox>

            <FlexBox width='472px' direction='row' justifyContent='space-between'>
              <FlexBox direction='column' gap='12px' alignItems='center'>
                <CustomText
                  text={`Wallet Address`}
                  fontSize='16px'
                  fontWeight='600'
                  fontFamily='Open Sans'
                />
                <CopyBoard
                  addr={
                    user_addr && user_addr
                  }
                  maxWidth='174px'
                />
              </FlexBox>
            </FlexBox>
          </FlexBox>
        }
        {
          isMobile &&
          <>
            <FlexBox smDirection='row' smGap='14px' smMarginTop='-47px'>
              <CustomImage
                image={DEFAULT_WALLET_NFT_IMAGE}
                smWidth='94px'
                smHeight='94px'
              />
              <FlexBox smGap='8px' smMarginTop='50px'>
                <CustomText
                  text={userData && userData.username && userData.username}
                  smFontSize='18px'
                  smFontWeight='700'
                  fontFamily='Inconsolata'
                  smMaxWidth='179px'
                  className='three-dots'
                  smDisplay='block'
                />
                <CustomText
                  text={userData && userData.user_bio ? userData.user_bio : ''}
                  smFontSize='12px'
                  smFontWeight='600'
                  fontFamily='Open Sans'
                  color='#9e9e9e'
                  smMaxWidth='179px'
                  className='three-dots'
                  smDisplay='block'
                />
              </FlexBox>
            </FlexBox>
            <FlexBox smJustifyContent='space-between' smAlignItems='center' smDirection='row' smMarginTop='16px'>
              <FlexBox direction='column' gap='10px' alignItems='center' smWidth='auto'>
                <CustomText
                  smFontSize='12px'
                  fontWeight='600'
                  text={`USD ($)`}
                  fontFamily='Open Sans'
                />
                {
                  myBalance && !myBalance.loading &&
                  <CustomText
                    smFontSize='16px'
                    fontWeight='700'
                    color='#B92929'
                    text={`0`}
                    fontFamily='Open Sans'
                  />
                }

              </FlexBox>
              <FlexBox direction='column' gap='10px' alignItems='center' smWidth='auto'>
                <CustomText
                  smFontSize='12px'
                  fontWeight='600'
                  text={`ADA (₳)`}
                  fontFamily='Open Sans'
                />
                {
                  myBalance && !myBalance.loading &&
                  <CustomText
                    smFontSize='16px'
                    fontWeight='700'
                    color='#B92929'
                    text={(parseInt(myBalance.ADA) / 1000000).toFixed(0)}
                    fontFamily='Open Sans'
                  />
                }

              </FlexBox>
              <FlexBox direction='column' gap='10px' alignItems='center' smWidth='auto'>
                <CustomText
                  smFontSize='12px'
                  fontWeight='600'
                  text={`Country`}
                  fontFamily='Open Sans'
                />
                <CustomText
                  smFontSize='16px'
                  fontWeight='700'
                  color='#B92929'
                  text={userData && userData.user_location ? userData.user_location : ''}
                  fontFamily='Open Sans'
                  maxWidth='63px'
                  smDisplay='block'
                  className='three-dots'
                />
              </FlexBox>
              <FlexBox direction='column' gap='10px' alignItems='center' smWidth='auto'>
                <CustomText
                  smFontSize='12px'
                  fontWeight='600'
                  text={`Wallet Address`}
                  fontFamily='Open Sans'
                />

                <CopyBoard
                  addr={
                    user_addr && user_addr
                  }
                  maxWidth='100px'
                />
              </FlexBox>
            </FlexBox>
          </>
        }
        {
          !isMobile &&
          <FlexBox>
            <FlexBox width='376px' direction='column' alignItems='center' justifyContent='center' position='absolute' marginTop='-350px'>
              <CustomImage
                image={userData && userData?.avatar ? userData?.avatar : DEFAULT_NFT_IMAGE}
                borderRadius='3px'
                width='253px'
                height='253px'
              />
              <CustomText
                text={userData && userData.username && userData.username}
                fontSize='38px'
                fontWeight='700'
                marginTop='20px'
                marginBottom='8px'
                maxWidth='259px'
                display='block'
                className='three-dots'
              />
              <CustomText
                text={userData && userData.user_bio ? userData.user_bio : ''}
                color='#767676'
                fontSize='21px'
                fontWeight='600'
                fontFamily='Open Sans'
                maxWidth='259px'
                display='block'
                className='three-dots'
              />
            </FlexBox>
          </FlexBox>
        }
        <FlexBox gap="40px" padding='14px' borderBottom='2px solid #8D8D8D' width='fit-content' className='mx-auto' marginBottom='32px' smDirection='row' smWidth='100%' smGap='0px' smPaddingBottom='8px' smMarginBottom='16px' smMarginTop='33px'>
          {
            tabs.map((tab: string, index: number) => {
              return (
                <ProfileTab key={index} active={tab === activeTab} onClick={() => { setActiveTab(tab) }}>
                  {tab}
                </ProfileTab>
              )
            })
          }
        </FlexBox>
        {
          activeTab === "NFTs" &&
          <JPGAssetsNote>
            <div className='topic'>
              Have assets listed elsewhere?
            </div>
            <div className='content'>
              Migrate assets to Crashr!


              <OverlayTrigger placement="bottom" overlay={tooltip}>
                <span className='d-flex align-items-center'>
                  <CustomImage
                    image={QUESTION_ICON}
                    alt="img-question"
                    width='24px'
                    height='24px'
                  />
                  &nbsp;&nbsp;&nbsp;
                </span>
              </OverlayTrigger>
            </div>


          </JPGAssetsNote>
        }

      </Container>

      <Container>
        {/* {
          activeTab === "NFTs" &&
          <MyNFTs />
        } */}

        {
          activeTab === "Tokens" &&
          <MyTokens />
        }
        {
          activeTab === "Raffles" &&
          <MyRaffles />
        }

        {
          activeTab === "Polls" &&
          <MyPolls />
        }
        {
          activeTab === "Activity" &&
          <MyActivity />
        }

      </Container>
    </PageWrapper>
  )
}

export default User