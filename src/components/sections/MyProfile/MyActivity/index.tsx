import React, { useEffect, useState } from 'react';
import CustomText from '@/components/common/CustomText';
import CustomSearchInput from '@/components/common/CustomSearchInput';
import CustomButton from '@/components/common/CustomButton';
import AcceptOfferModal from '@/components/modal/AcceptOfferModal';
import SuccessModal from '@/components/modal/SuccessModal';
import { useWalletConnect } from '@/context/WalletConnect';
import styled from 'styled-components';
import { FlexBox } from '@/components/common/FlexBox';
import { getMyOffering } from '@/api/marketplace/getMyOffering';
import { acceptAnOffer } from '@/api/marketplace/acceptAnOffer';
import { cancelOffer } from '@/api/marketplace/cancelOffer';
import { getMyActivities, getNFTDetailByAsset } from '@/api/api';
import CustomImage from '@/components/common/CustomImage';
import { getExactImageFormat } from '@/hooks/function';
import axios from 'axios';
import CancelOfferModal from '@/components/modal/CancelOfferModal';
import { ThreeDots } from 'react-loader-spinner';

import { useGlobalContext } from '@/context/GlobalContext';

const BoldText = styled.span`
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`


const LinkText = styled.a`
  text-decoration: none;
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: #6073F6;
`

const CommonText = styled.div`
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: #9E9E9E;
`

const MyActivity = () => {
  const [search, setSearch] = useState<string>('');
  const [activities, setActivities] = useState<any>();
  const [offerActivities, setOfferActivities] = useState<any>();
  const [myActivities, setMyActivities] = useState<any>();
  const [activeData, setActiveData] = useState<any>();
  const [showOfferModal, setShowOfferModal] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [message, setMessage] = useState('You have successfully accepted this offer.')
  const [loading, setLoading] = useState<boolean>(false)
  const { myWalletAddress, lucid } = useWalletConnect();
  const { colorMode } = useGlobalContext()

  const getOfferingData = async () => {
    setLoading(true)
    try {
      if (!myWalletAddress) return;
      const response = await getMyOffering(myWalletAddress);
      const response2 = await axios("https://3cbsxnq9cb.execute-api.eu-west-2.amazonaws.com/default/get-my-offers?address=" + myWalletAddress)
      console.log("response2", response2)
      if (response) {
        setOfferActivities(response);
      }

      if (response2) {
        setMyActivities(response2.data)
      }

    } catch (err) {
      console.log("Error fetching offering data:", err);
    }
  };

  const getMyActivitiesData = async () => {
    if (!myWalletAddress) return;
    try {
      const response = await getMyActivities(myWalletAddress);
      if (response) {
        setActivities(response.entries.slice().reverse());
      }
    } catch (err) {
      console.log("Error fetching offering data:", err);
    }
  }

  const acceptOffer = async (
    listingUtxoValue: string, offerUtxoValue: string, assetValue: string
  ) => {
    if (!myWalletAddress || !lucid) return;
    try {
      const result = await acceptAnOffer(myWalletAddress, lucid, listingUtxoValue, offerUtxoValue, assetValue);
      if (result) {
        setShowSuccessModal(true);
      } else {
        console.log("Failed to accept the offer.");
      }
    } catch (err) {
      console.log("Error accepting the offer:", err);
    }
  }
  const cancelMyOffer = async (
    utxoValue: string
  ) => {
    if (!lucid) return;
    if (!myWalletAddress) return;
    try {
      const result = await cancelOffer(lucid, myWalletAddress, utxoValue, []);
      if (result) {
        setMessage('You have successfully cancelled your offer.')
        setShowSuccessModal(true);
      } else {
        console.log("Failed to cancel the offer.");
      }
    } catch (err) {
      console.log("Error accepting the offer:", err);
    }
  }

  useEffect(() => {
    if (myWalletAddress !== '') {
      getMyActivitiesData();
      getOfferingData()
    }
  }, [myWalletAddress]);

  useEffect(() => {
    if (offerActivities && myActivities) {
      setLoading(false)
    }
  }, [offerActivities, myActivities])

  return (
    <FlexBox direction='column' gap="24px">
      <CustomText
        text={`All Account Activity`}
        fontSize='28px'
        fontWeight='700'
      />
      <CustomSearchInput
        input={search}
        setInput={setSearch}
        placeholder='Search Activity'
      />
      <FlexBox>
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
      </FlexBox>
      <FlexBox direction='column' gap='2px'>
        {activities &&
          activities.map((activity: any, index: number) => {

            if (activity.type === "list-nft") {
              return (
                <FlexBox key={index} alignItems='center' padding='16px 54px 16px 16px' bgColor='rgba(255, 255, 255, 0.50)' justifyContent='start'>
                  <CustomImage
                    image={activity.nfts.length > 0 ? getExactImageFormat(activity.nfts[0].image) : `https://imagesstorag.s3.eu-west-2.amazonaws.com/default_collection.png`}
                    width='64px'
                    height='64px'
                    marginRight='16px'
                    borderRadius='3px'
                  />
                  <BoldText>You</BoldText>
                  <CommonText>
                    &nbsp;listed NFT
                    {activity.nfts.length > 1 && ' Bundle'}
                    &nbsp;
                  </CommonText>
                  {
                    activity.nfts.length > 0 &&
                    <LinkText href={'/nfts/' + activity.nfts[0].asset}>
                      {activity.nfts[0].name.slice(0, 10) + "..."}
                    </LinkText>
                  }
                </FlexBox>
              )
            }
            if (activity.type === "cancel-nft") {
              return (
                <FlexBox key={index} alignItems='center' padding='16px 54px 16px 16px' bgColor='rgba(255, 255, 255, 0.50)' justifyContent='start'>
                  <CustomImage
                    image={`https://imagesstorag.s3.eu-west-2.amazonaws.com/default_collection.png`}
                    width='64px'
                    height='64px'
                    marginRight='16px'
                    borderRadius='3px'
                  />
                  <BoldText>You</BoldText>
                  <CommonText>
                    &nbsp;cancelled NFT

                    &nbsp;</CommonText>
                  {
                    activity.nfts && activity.nfts.length > 0 &&
                    <LinkText href={'/nfts/' + activity.nfts[0].asset}>
                      {activity.nfts[0].name.slice(0, 10) + "..."}
                    </LinkText>
                  }
                </FlexBox>
              )
            }
            if (activity.type === "edit-nft") {
              return (
                <FlexBox key={index} alignItems='center' padding='16px 54px 16px 16px' bgColor='rgba(255, 255, 255, 0.50)' justifyContent='start'>
                  <CustomImage
                    image={activity.nfts.length > 0 ? getExactImageFormat(activity.nfts[0].image) : `https://imagesstorag.s3.eu-west-2.amazonaws.com/default_collection.png`}
                    width='64px'
                    height='64px'
                    marginRight='16px'
                    borderRadius='3px'
                  />
                  <BoldText>You</BoldText>
                  <CommonText>
                    &nbsp;edited NFT
                    {activity.nfts.length > 1 && ' Bundle'}
                    &nbsp;

                  </CommonText>
                  {
                    activity.nfts.length > 0 &&
                    <LinkText href={'/nfts/' + activity.nfts[0].asset}>
                      {activity.nfts[0].name.slice(0, 10) + "..."}
                    </LinkText>
                  }
                </FlexBox>
              )
            }
            if (activity.type === "buy-nft") {
              return (

                <FlexBox key={index} alignItems='center' padding='16px 54px 16px 16px' bgColor='rgba(255, 255, 255, 0.50)' justifyContent='start'>
                  <CustomImage
                    image={activity.nfts.length > 0 ? getExactImageFormat(activity.nfts[0].image) : `https://imagesstorag.s3.eu-west-2.amazonaws.com/default_collection.png`}
                    width='64px'
                    height='64px'
                    marginRight='16px'
                    borderRadius='3px'
                  />
                  {
                    activity.address === myWalletAddress ?
                      <>
                        <BoldText>You</BoldText>
                        <CommonText>&nbsp;bought NFT
                          {activity.nfts.length > 1 && ' Bundle'}
                          &nbsp;
                        </CommonText>
                      </>
                      :
                      <>
                        <BoldText>You</BoldText>
                        <CommonText>&nbsp;sold NFT
                          {activity.nfts.length > 1 && ' Bundle'}
                          &nbsp;
                        </CommonText>
                      </>
                  }

                  {
                    activity.nfts.length > 0 &&
                    <LinkText href={'/nfts/' + activity.nfts[0].asset}>
                      {activity.nfts[0].name.slice(0, 10) + "..."}
                    </LinkText>
                  }
                </FlexBox>
              )
            }

            if (activity.type === "migrate-nft") {
              return (
                <FlexBox key={index} alignItems='center' padding='16px 54px 16px 16px' bgColor='rgba(255, 255, 255, 0.50)' justifyContent='start'>
                  <CustomImage
                    image={activity.nfts.length > 0 ? getExactImageFormat(activity.nfts[0].image) : `https://imagesstorag.s3.eu-west-2.amazonaws.com/default_collection.png`}
                    width='64px'
                    height='64px'
                    marginRight='16px'
                    borderRadius='3px'
                  />
                  <BoldText>You</BoldText>
                  <CommonText>&nbsp;migrated NFT
                    {activity.nfts.length > 1 && ' Bundle'}&nbsp;
                  </CommonText>
                  {
                    activity.nfts.length > 0 &&
                    <LinkText href={'/nfts/' + activity.nfts[0].asset}>
                      {activity.nfts[0].name.slice(0, 10) + "..."}
                    </LinkText>
                  }
                </FlexBox>
              )
            }
            if (activity.type === "buy-cart") {
              return (
                <FlexBox key={index} alignItems='center' padding='16px 54px 16px 16px' bgColor='rgba(255, 255, 255, 0.50)' justifyContent='start'>
                  <BoldText>You</BoldText>
                  <CommonText>&nbsp;migrated NFT&nbsp;</CommonText>
                  {
                    activity.nfts.length > 0 &&
                    <LinkText href={'/nfts/' + activity.nfts[0].asset}>
                      {activity.nfts[0].name.slice(0, 10) + "..."}
                    </LinkText>
                  }
                </FlexBox>
              )
            }
          })}
      </FlexBox>
      {showOfferModal && (
        <AcceptOfferModal
          show={showOfferModal}
          onClose={() => {
            setShowOfferModal(false);
          }}
          data={activeData}
          acceptOffer={acceptOffer}
        />
      )}
      {showCancelModal && (
        <CancelOfferModal
          show={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
          }}
          data={activeData}
          cancelMyOffer={cancelMyOffer}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setShowOfferModal(false)
            setShowCancelModal(false)
          }}
          message={message}
        />
      )
      }
    </FlexBox>
  );
};

export default MyActivity;
