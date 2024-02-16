import CustomImage from '@/components/common/CustomImage'
import CustomText from '@/components/common/CustomText'
import { FlexBox } from '@/components/common/FlexBox'
import { JpgStoreBadge, BundleBadge, MyJpgStoreNFTCardStyle } from './index.styled';
import CustomButton from '@/components/common/CustomButton';

import { useGlobalContext } from '@/context/GlobalContext';


interface MyJpgStoreNFTCardType {
    data: any;
    setActiveMigratingData: any;
    setShowMigratingModal: any;
}


const MyJpgStoreNFTCard = ({
    data,
    setActiveMigratingData,
    setShowMigratingModal
}: MyJpgStoreNFTCardType) => {
    const { colorMode } = useGlobalContext()
    if (typeof window === "undefined") return;
    const user_addr = window.location.href.split("/users/")[1];
    return (
        <MyJpgStoreNFTCardStyle>
            {/* <JpgStoreBadge
                src={`/assets/images/icons/jpg-logo.svg`}
            /> */}
            {
                data.bundled_assets.length > 0 &&
                <BundleBadge>
                    Bundle
                </BundleBadge>
            }

            <CustomImage
                image={`https://image-optimizer.jpgstoreapis.com/${data.source}`}
                width='256px'
                height='256px'
                borderRadius='3px 3px 0px 0px'
                smWidth='156px'
                smHeight='156px'
            />
            <FlexBox
                bgColor={colorMode === "light" ? "white" : "#3e3e3e"}
                borderRadius='0px 0px 3px 3px'
                padding='10px'
                direction='column'
                alignItems='center'
                gap='4px'
                width='256px'
                height='79px'
                smWidth='156px'
                smHeight='59px'
            >
                <CustomText
                    text={data && data.display_name}
                    fontSize='21px'
                    fontWeight='700'
                    maxWidth='236px'
                    className='three-dots'
                    display='block'
                    smFontSize='16px'
                    smMaxWidth='139px'
                    smDisplay='block'
                />
                <CustomText
                    text={`₳${parseInt(data.price_lovelace) / 1000000}`}
                    fontSize='28px'
                    fontWeight='600'
                    color='#6073F6'
                    fontFamily='Open Sans'
                    smFontSize='16px'
                />

            </FlexBox>
            {
                !user_addr && data &&
                <CustomButton
                    text='Migrate'
                    fontSize='18px'
                    fontWeight='600'
                    fontFamily='Open Sans'
                    width='100%'
                    marginTop='24px'
                    height='48px'
                    smWidth='100%'
                    bgColor='linear-gradient(to right, #4454c8 , #96374e)'
                    hoverBgColor='linear-gradient(to right, #1154c8 , #63374e)'
                    boxShadow='0px 2px 10px 0px rgba(255, 255, 255, 0.30)'
                    onClick={() => {
                        // migrateAssets(myWalletAddress, lucid, data.utxo.replace(/#0$/, ''), data.bundled_assets.length > 0 ? data.bundled_assets.map((item) => item.asset_id) : [data.asset_id], parseInt(data.price_lovelace) / 1000000)

                        setActiveMigratingData(data)
                        setShowMigratingModal(true)
                    }}
                />
            }


        </MyJpgStoreNFTCardStyle>
    )
}

export default MyJpgStoreNFTCard