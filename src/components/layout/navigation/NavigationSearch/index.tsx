import React, { useCallback, useEffect, useState } from 'react'
import * as S from './index.styled'
import CustomImage from '@/components/common/CustomImage'
import { VERIFIED_ICON_IMAGE } from '@/constants/image.constants'
import VERIFIED_COLLECTIONS from '@/constants/verified.collections.constant'
import { useGlobalContext } from '@/context/GlobalContext'
import { getNFTDetailByAsset } from '@/api/api'
import { EXCEPTIONAL_NFT_ASSETS } from '@/constants/assets.constants'
import { getExactImageFormat } from '@/hooks/function'

const tabs = ["Collections", "Assets"]

interface IProps {
    search?: string;
    onMouseLeave?: any;
}
const placeholderImage = `https://imagesstorag.s3.eu-west-2.amazonaws.com/default_collection.png`

const NavigationSearch = ({
    search,
    onMouseLeave
}: IProps) => {
    const [activeTab, setActiveTab] = useState("Collections")
    const [filteredCollections, setFilteredCollections] = useState<any>()
    const [filteredNFTs, setFilteredNFTs] = useState<any[]>()
    const { listedAllNFTs } = useGlobalContext();
    useEffect(() => {
        console.log("search", search)
        // @ts-ignore
        let filtered_arr = Object.values(VERIFIED_COLLECTIONS).filter((item: any) => item?.name?.toLowerCase().includes(search.toLocaleLowerCase()));
        console.log("filtered_Arr", filtered_arr)
        setFilteredCollections(filtered_arr.slice(0, 9))


        if (listedAllNFTs && Object.values(listedAllNFTs).length > 0) {
            let dataArray = Object.values(listedAllNFTs);
            dataArray.sort((a, b) => parseInt(a.amount) - parseInt(b.amount));
            setFilteredNFTs(dataArray.slice(0, 9))
        }
    }, [search])
    return (
        <S.Container onMouseLeave={onMouseLeave}>
            <S.TabFlex>
                {
                    tabs.map((tab: string, index: number) => {
                        return (
                            <S.Tab
                                key={index}
                                active={activeTab === tab}
                                onClick={() => {
                                    setActiveTab(tab)
                                }}
                            >
                                {tab}
                            </S.Tab>
                        )
                    })
                }

            </S.TabFlex>
            <S.Body>
                {
                    activeTab === "Collections" &&
                    (
                        filteredCollections && filteredCollections.length > 0 ?
                            filteredCollections.map((collection: any, k: number) => {
                                return (
                                    <S.Row onClick={() => {
                                        if (typeof window === "undefined") return;
                                        window.location.href = `/collections/${collection.id}`
                                    }}>
                                        <S.RowLeft>
                                            <CustomImage image={collection.image} width='22px' height='22px' borderRadius='3px' />
                                            <span>
                                                {collection.name}
                                            </span>
                                            <CustomImage image={VERIFIED_ICON_IMAGE} width='14px' height='14px' />
                                        </S.RowLeft>
                                        <S.RowRight>
                                            {collection.prices[4]} items
                                        </S.RowRight>
                                    </S.Row>
                                )
                            })
                            :
                            <S.Row>
                                <S.RowLeft>
                                    <span>
                                        No collections found
                                    </span>
                                </S.RowLeft>
                            </S.Row>
                    )
                }
                {
                    activeTab === "Assets" &&
                    (
                        // filteredNFTs && filteredNFTs.length > 0 ?
                        //     filteredNFTs.map((nft: any, k: number) => {
                        //         return (
                        //             <NFTLink data={nft} search={search} />
                        //         )
                        //     })
                        //     :
                        <S.Row >
                            <S.RowLeft>
                                <span>
                                    No assets found
                                </span>
                            </S.RowLeft>
                        </S.Row>
                    )
                }

            </S.Body>
        </S.Container>
    )
}

interface NFTLinkProps {
    data: any;
    search: string;
}

const NFTLink = ({
    data,
    search
}: NFTLinkProps) => {
    const [listedNFTs, setListedNFTs] = useState<NFTDataProps[]>()
    const [show, setShow] = useState<boolean>(true)
    useEffect(() => {
        getNFTData()
    }, [])
    const getNFTData = useCallback(async () => {
        const assetKeys = Object.keys(data.nfts);

        // Map asset keys to an array of promises
        const nftPromises = assetKeys.map(async (assetKey) => {
            const response = await getNFTDetailByAsset(assetKey);
            return {
                name: response.onchain_metadata ? (response.onchain_metadata.name ? response.onchain_metadata.name : EXCEPTIONAL_NFT_ASSETS[response.asset].name) : EXCEPTIONAL_NFT_ASSETS[response.asset].name,
                asset: response.asset,
                image: response.onchain_metadata.image
            };
        });

        // Use Promise.all to await all responses
        const nfts = await Promise.all(nftPromises);
        console.log("nfts", nfts)

        setListedNFTs(nfts);
    }, [data]);

    useEffect(() => {
        if (listedNFTs && listedNFTs.length > 0 && search !== '') {
            const names = listedNFTs.map((item) => item.name);


            let namesWithoutHash = names.map(function (text) {
                return text.replace(/#/g, '');
            });

            const result = names.some(element => element.toLowerCase().includes(search.toLowerCase())) || namesWithoutHash.some(element => element.toLowerCase().includes(search.toLowerCase()));

            if (result) {
                setShow(true)
            } else {
                setShow(false)
            }
        }
    }, [search, listedNFTs])
    return (
        <>
            {show &&
                <S.Row onClick={() => {
                    if (typeof window === "undefined") return;
                    window.location.href = `/nfts/${Object.keys(data.nfts)[0]}`
                }}>

                    <S.RowLeft>
                        <CustomImage image={listedNFTs && getExactImageFormat(listedNFTs[0].image) ? getExactImageFormat(listedNFTs[0].image) : placeholderImage} width='22px' height='22px' borderRadius='3px' />
                        <span>
                            {listedNFTs && listedNFTs[0].name ? listedNFTs[0].name : ''}
                        </span>
                        <CustomImage image={VERIFIED_ICON_IMAGE} width='14px' height='14px' />
                    </S.RowLeft>
                    <S.RowRight>
                        Collection Name
                    </S.RowRight>
                </S.Row>
            }

        </>
    )
}

export default NavigationSearch