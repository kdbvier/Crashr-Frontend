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

import axios from 'axios';
import CancelOfferModal from '@/components/modal/CancelOfferModal';

import MyOfferActivityRow from './MyOfferActivityRow';
import OtherOfferActivityRow from './OtherOfferActivity';
import { useGlobalContext } from '@/context/GlobalContext';
import SkeletonActivity from '@/components/skeleton/SkeletonActivity';
// import { SearchFilterTab } from '@/pages/collections/[id]';
const tabData = ["NFT Offers", "Collection Offers"]
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
  const [activeTab, setActiveTab] = useState<string>("NFT Offers");
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

  const getMyActs = async () => {

  }

  const getMyActivitiesData = async () => {
    if (!myWalletAddress || !lucid) return;
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
    if (!myWalletAddress || !lucid) return;
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
      <FlexBox gap="20px" justifyContent='start'>
        <FlexBox
          smDirection='row' justifyContent='start'
          gap="12px"
          padding='6px'
          borderRadius='3px'
          border='2px solid #8896F8' width='default'
          smPadding='6px'
          smWidth='100%'
        >
          {/* {
            tabData.map((tab, j) => {
              return (
                <SearchFilterTab
                  active={tab === activeTab}
                  onClick={() => setActiveTab(tab)}
                  colorMode={colorMode}
                >
                  {tab}
                </SearchFilterTab>
              )

            })
          } */}
        </FlexBox>
        <CustomSearchInput
          input={search}
          setInput={setSearch}
          placeholder='Search NFTs'
        />
      </FlexBox>
      <FlexBox>
        {
          loading &&
          <FlexBox direction='column' gap='2px'>

            <SkeletonActivity />
            <SkeletonActivity />

          </FlexBox>
        }
      </FlexBox>
      <FlexBox direction='column' gap='2px'>

        {myActivities && Object.values(myActivities).length > 0 &&
          Object.values(myActivities).reverse().map((item: any, index: number) => {
            return (
              <MyOfferActivityRow
                key={index}
                item={item}
                setActiveData={setActiveData}
                setShowCancelModal={setShowCancelModal}
              />
            )
          }
          )}

        {offerActivities && Object.values(offerActivities).length > 0 &&
          Object.values(offerActivities).reverse().map((activity: any, index: number) => {
            if (Object.values(activity.offer).length > 0) {
              if (Object.keys(activity.offer)[0] === "message") return;
              return Object.values(activity.offer).map((item: any, j: number) => (
                <OtherOfferActivityRow
                  item={item}
                  setActiveData={setActiveData}
                  setShowOfferModal={setShowOfferModal}
                />
              ));
            }
            return null; // Added to satisfy map function return requirement
          })}
        {activities &&
          activities.map((activity: any, index: number) => {


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
