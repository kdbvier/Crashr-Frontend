import { getNFTImageByAsset } from '@/api/api';
import CustomImage from '@/components/common/CustomImage';
import { FlexBox } from '@/components/common/FlexBox';
import React, { useEffect, useState } from 'react'
import * as S from '../index.styled'
import { getExactImageFormat } from '@/hooks/function';
import CustomButton from '@/components/common/CustomButton';
interface IOtherOfferActivityRow {
    item: any;
    setActiveData: any;
    setShowOfferModal: any;
}
const OtherOfferActivityRow = ({ item, setActiveData, setShowOfferModal }: IOtherOfferActivityRow) => {
    console.log("activity row", item)
    const [hero, setHero] = useState<string>();

    useEffect(() => {
        if (item && item.unit) {
            getHero()
        }
    }, [item])

    const getHero = async () => {
        const image = await getNFTImageByAsset(item.unit);
        setHero(image)
    }
    return (
        <FlexBox justifyContent='space-between' alignItems='center' padding='16px 54px 16px 16px' bgColor='rgba(255, 255, 255, 0.50)'>
            <CustomImage
                image={hero && getExactImageFormat(hero)}
                width='64px'
                height='64px'
                marginRight='16px'
                borderRadius='3px'
            />
            <S.ActivityFlex>
                <S.LinkText href={'/users/' + item.buyer}>
                    {item?.buyer.slice(0, 10) + "..."}
                </S.LinkText>
                <S.CommonText>&nbsp;made an offer on&nbsp;</S.CommonText>

                <S.LinkText href={'/nfts/' + item.unit}>
                    {item?.unit.slice(0, 10) + "..."}
                </S.LinkText>
            </S.ActivityFlex>
            <CustomButton
                width='200px'
                text='View Offer'
                onClick={() => {
                    setActiveData(item);
                    setShowOfferModal(true);
                }}
            />
        </FlexBox>
    )
}

export default OtherOfferActivityRow