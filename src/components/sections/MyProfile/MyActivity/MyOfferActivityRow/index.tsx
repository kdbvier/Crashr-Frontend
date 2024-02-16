import { getNFTImageByAsset } from '@/api/api';
import CustomImage from '@/components/common/CustomImage';
import { FlexBox } from '@/components/common/FlexBox';
import { TOKEN_ARRAY } from '@/constants/document';
import React, { useEffect, useState } from 'react'
import * as S from '../index.styled'
import { getExactImageFormat } from '@/hooks/function';
import CustomBorderButton from '@/components/common/CustomBorderButton';
interface IMyOfferActivityRow {
    item: any;
    setActiveData: any;
    setShowCancelModal: any;
}
const MyOfferActivityRow = ({ item, setActiveData, setShowCancelModal }: IMyOfferActivityRow) => {
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
            {
                item.offer &&
                <FlexBox justifyContent='start' >
                    <S.BoldText>I</S.BoldText>
                    {
                        Object.values(item.offer).length === 1 &&
                        <S.CommonText>&nbsp;made an ADA offer on&nbsp;
                            {/* {parseInt(item.offer.lovelace) / 1000000 + 'ADA'} */}

                            <S.LinkText href={'/nfts/' + item.unit}>
                                {item.unit.slice(0, 10) + "..."}
                            </S.LinkText>

                        </S.CommonText>


                    }
                    {
                        Object.values(item.offer).length === 2 && Object.keys(TOKEN_ARRAY).includes(Object.keys(item.offer)[1]) &&
                        <S.CommonText>&nbsp;made a Token offer on&nbsp;
                            {/* {
                // @ts-ignore
                parseInt(Object.values(item.offer)[1]) / Math.pow(10, TOKEN_ARRAY[Object.keys(item.offer)[1]].decimals) + TOKEN_ARRAY[Object.keys(item.offer)[1]].value} */}
                            <S.LinkText href={'/nfts/' + item.unit}>
                                {item.unit.slice(0, 10) + "..."}
                            </S.LinkText>
                        </S.CommonText>

                    }
                    {
                        Object.values(item.offer).length === 2 && !Object.keys(TOKEN_ARRAY).includes(Object.keys(item.offer)[1]) &&
                        <S.CommonText>&nbsp;made a NFT offer&nbsp;

                            <S.LinkText href={'/nfts/' + item.unit}>
                                {item.unit.slice(0, 10) + "..."}
                            </S.LinkText>
                        </S.CommonText>
                    }
                    {
                        Object.values(item.offer).length > 2 &&
                        <S.CommonText>&nbsp;made a NFT Bundle offer&nbsp;

                            <S.LinkText href={'/nfts/' + item.unit}>
                                {item.unit.slice(0, 10) + "..."}
                            </S.LinkText>
                        </S.CommonText>
                    }

                </FlexBox>
            }
            <CustomBorderButton
                text='Cancel Offer'
                width='200px'
                onClick={() => {
                    setActiveData(item);
                    setShowCancelModal(true);
                }}

            />
        </FlexBox>
    )
}

export default MyOfferActivityRow