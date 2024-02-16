import { getNFTImageByAsset } from '@/api/api';
import CustomImage from '@/components/common/CustomImage';
import { FlexBox } from '@/components/common/FlexBox';
import { CommonText } from '@/components/modal/RaffleDetailModal/index.styled';
import { TOKEN_ARRAY } from '@/constants/document';
import React, { useEffect, useState } from 'react'
import * as S from '../index.styled'

const ActivityRow = (item: any) => {
    console.log("activity row", item)
    const [hero, setHero] = useState<string>();

    useEffect(() => {
        getHero()
    }, [])

    const getHero = async () => {
        setHero(await getNFTImageByAsset(""))
    }
    return (
        <FlexBox justifyContent='space-between' alignItems='center' padding='16px 54px 16px 16px' bgColor='rgba(255, 255, 255, 0.50)'>
            <CustomImage
                image={`https://imagesstorag.s3.eu-west-2.amazonaws.com/default_collection.png`}
                width='64px'
                height='64px'
                marginRight='16px'
                borderRadius='3px'
            />
            {
                item.offer &&
                <FlexBox justifyContent='start' >
                    <S.BoldText>He</S.BoldText>
                    {
                        Object.values(item.offer).length === 1 &&
                        <CommonText>&nbsp;made an ADA offer on&nbsp;
                            {/* {parseInt(item.offer.lovelace) / 1000000 + 'ADA'} */}

                            <S.LinkText href={'/nfts/' + item.unit}>
                                {item.unit.slice(0, 10) + "..."}
                            </S.LinkText>

                        </CommonText>


                    }
                    {
                        Object.values(item.offer).length === 2 && Object.keys(TOKEN_ARRAY).includes(Object.keys(item.offer)[1]) &&
                        <CommonText>&nbsp;made a Token offer on&nbsp;
                            {/* {
                // @ts-ignore
                parseInt(Object.values(item.offer)[1]) / Math.pow(10, TOKEN_ARRAY[Object.keys(item.offer)[1]].decimals) + TOKEN_ARRAY[Object.keys(item.offer)[1]].value} */}
                            <S.LinkText href={'/nfts/' + item.unit}>
                                {item.unit.slice(0, 10) + "..."}
                            </S.LinkText>
                        </CommonText>

                    }
                    {
                        Object.values(item.offer).length === 2 && !Object.keys(TOKEN_ARRAY).includes(Object.keys(item.offer)[1]) &&
                        <CommonText>&nbsp;made a NFT offer&nbsp;
                            {/* 
              <LinkText href={'/nfts/' + item.unit}>
                {item.unit.slice(0, 10) + "..."}
              </LinkText> */}
                        </CommonText>
                    }
                    {
                        Object.values(item.offer).length > 2 &&
                        <CommonText>&nbsp;made a NFT Bundle offer&nbsp;
                            {/* 
              <LinkText href={'/nfts/' + item.unit}>
                {item.unit.slice(0, 10) + "..."}
              </LinkText> */}
                        </CommonText>
                    }

                </FlexBox>
            }
            {/* <CustomBorderButton
          text='Cancel Offer'
          onClick={() => {
            setActiveData(item);
            setShowCancelModal(true);
          }}
        /> */}
        </FlexBox>
    )
}

export default ActivityRow