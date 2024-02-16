import axios from "axios";
import CustomRouterLinkButton from "@/components/common/CustomRouterLinkButton";
import CustomText from "@/components/common/CustomText";
import { FlexBox } from "@/components/common/FlexBox";
import {
  COLLECTION_IMAGES,
  MARKET_DOWN_ICON,
  MARKET_UP_ICON,
} from "@/constants/image.constants";
import { getExactImageFormat, getVolumeExpression } from "@/hooks/function";
// import { isArray } from 'lodash';
import { useEffect, useState } from "react";
import { useTheme } from "styled-components";
import {
  TopCollectionRow,
  CollectionTableHeader,
  TimeTab,
  TopCollectionBody,
} from "./index.styled";
import { useMedia } from "react-use";
import CustomImage from "@/components/common/CustomImage";
import { BASE_URL } from "@/constants/document";
import { COLORS } from "@/constants/colors.constants";
import { useGlobalContext } from "@/context/GlobalContext";
import SkeletonCollectionStat from "@/components/skeleton/SkeletonCollectionStat";
// import RecentTransactions from '@/pages/marketplace/shop/components/RecentTransactions';

const tabs = [
  {
    value: "24h",
    tag: "24h",
  },
  {
    value: "7d",
    tag: "7d",
  },
  {
    value: "30d",
    tag: "30d",
  },
  {
    value: "All",
    tag: "all",
  },
];

const TopCollections = () => {
  const [collectionData, setCollectionData] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState<boolean>(false);

  const isMobile = useMedia("(max-width: 550px)");

  const { colorMode } = useGlobalContext();

  // @ts-ignore
  const theme: ThemeProps = useTheme();

  useEffect(() => {
    getCollectionData();
  }, [activeTab]);

  const getCollectionData = async () => {
    setLoading(true);
    const url = BASE_URL + "collection/top-ones?tab=" + activeTab;
    try {
      const { data } = await axios.get(url);
      console.log("collection data", data);
      if (data) {
        setLoading(false);
        setCollectionData(data);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error getCollectionData", err);
    }
  };

  return (
    <FlexBox direction="column">
      <FlexBox justifyContent="space-between">
        <FlexBox
          smDirection="row"
          smJustifyContent="space-between"
          smAlignItems="center"
          justifyContent="start"
          marginBottom="16px"
          smMarginBottom="13px"
        >
          <CustomText
            text={`Top Collections`}
            fontSize="33px"
            fontFamily="600"
            letterSpacing="-0.825px"
            smFontSize="25px"
            color={COLORS[colorMode].mainTextColor}
          />
          {isMobile && (
            <CustomRouterLinkButton
              text="View All"
              link="/collections"
              fontFamily={theme.fonts.openSans}
              fontSize="18px"
              fontWeight="600"
              color="#6073F6"
              smWidth="61px"
              smFontSize="16px"
            />
          )}
        </FlexBox>
        <FlexBox
          smDirection="row"
          width="default"
          gap="22px"
          alignItems="center"
          smWidth="100%"
        >
          <FlexBox
            smDirection="row"
            width="default"
            padding="6px"
            alignItems="center"
            smMarginBottom="8px"
            smWidth="100%"
            gap="24px"
          >
            {tabs.map((tab, i) => {
              return (
                <TimeTab
                  key={i}
                  active={tab.tag === activeTab}
                  onClick={() => {
                    setActiveTab(tab.tag);
                  }}
                  colorMode={colorMode}
                >
                  {tab.value}
                </TimeTab>
              );
            })}
          </FlexBox>
          {!isMobile && (
            <CustomRouterLinkButton
              text="View All"
              link="/collections"
              fontFamily={theme.fonts.openSans}
              fontSize="17px"
              lineHeight="170%"
              fontWeight="600"
              color="#6073F6"
            />
          )}
        </FlexBox>
      </FlexBox>
      <FlexBox
        gap="40px"
        justifyContent="space-between"
        marginTop="19px"
        smGap="4px"
      >
        <TopCollectionBody>
          <CollectionTableHeader>
            <div></div>
            <div>#</div>
            <div>COLLECTION</div>
            <div>VOLUME</div>
            <div>FLOOR</div>
            {!isMobile && <div>OWNERS</div>}
          </CollectionTableHeader>
          {loading ? (
            <>
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
            </>
          ) : (
            collectionData &&
            collectionData.length > 0 &&
            collectionData.slice(0, 6).map((collection: any, index: number) => {
              return (
                <TopCollectionRow
                  key={index}
                  href={"/collections/" + collection.policies[0]}
                  colorMode={colorMode}
                >
                  <div>
                    <img
                      src={
                        collection &&
                        (COLLECTION_IMAGES.hasOwnProperty(
                          collection.policies[0]
                        )
                          ? COLLECTION_IMAGES[collection.policies[0]].image
                          : getExactImageFormat(collection.thumbnail))
                      }
                      alt="img-collection"
                    />
                  </div>
                  <div>{index + 1}</div>

                  <div>{collection.name}</div>

                  <div>
                    <p>{getVolumeExpression(collection.volume)}</p>
                    <p className="active">
                      <CustomImage
                        image={MARKET_UP_ICON}
                        width="11.7px"
                        height="15.1px"
                        smWidth="8px"
                        smHeight="9.67px"
                      />
                      20.21%
                    </p>
                  </div>
                  <div>
                    <p>₳ {getVolumeExpression(collection.floor_price)}</p>
                    <p>
                      <CustomImage
                        image={MARKET_DOWN_ICON}
                        width="11.7px"
                        height="11.1px"
                        smWidth="8px"
                        smHeight="7.67px"
                      />
                      20.21%
                    </p>
                  </div>
                  {!isMobile && (
                    <div>
                      <p>
                        {Array.isArray(collection.total_owners)
                          ? collection.total_owners[0]
                          : collection.total_owners}
                      </p>
                      <p className="active">
                        <CustomImage
                          image={MARKET_UP_ICON}
                          width="11.7px"
                          height="15.1px"
                          smWidth="8px"
                          smHeight="9.67px"
                        />
                        20.21%
                      </p>
                    </div>
                  )}
                </TopCollectionRow>
              );
            })
          )}
        </TopCollectionBody>
        <TopCollectionBody>
          {!isMobile && (
            <CollectionTableHeader>
              <div></div>
              <div>#</div>
              <div>COLLECTION</div>
              <div>VOLUME</div>
              <div>FLOOR</div>
              {!isMobile && <div>OWNERS</div>}
            </CollectionTableHeader>
          )}
          {loading ? (
            <>
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
            </>
          ) : (
            collectionData &&
            collectionData.length > 0 &&
            collectionData.slice(6, 12).map((collection: any, index) => {
              return (
                <TopCollectionRow
                  key={index}
                  href={"/collections/" + collection.policies[0]}
                  colorMode={colorMode}
                >
                  <div>
                    <img
                      src={
                        collection &&
                        (COLLECTION_IMAGES.hasOwnProperty(
                          collection.policies[0]
                        )
                          ? COLLECTION_IMAGES[collection.policies[0]].image
                          : getExactImageFormat(collection.thumbnail))
                      }
                      alt="img-collection"
                    />
                  </div>
                  <div>{index + 7}</div>

                  <div>{collection.name}</div>

                  <div>
                    <p>{getVolumeExpression(collection.volume)}</p>
                    <p className="active">
                      <CustomImage
                        image={MARKET_UP_ICON}
                        width="11.7px"
                        height="15.1px"
                        smWidth="8px"
                        smHeight="9.67px"
                      />
                      20.21%
                    </p>
                  </div>
                  <div>
                    <p>₳ {getVolumeExpression(collection.floor_price)}</p>
                    <p>
                      <CustomImage
                        image={MARKET_DOWN_ICON}
                        width="11.7px"
                        height="11.1px"
                        smWidth="8px"
                        smHeight="7.67px"
                      />
                      20.21%
                    </p>
                  </div>
                  {!isMobile && (
                    <div>
                      <p>
                        {Array.isArray(collection.total_owners)
                          ? collection.total_owners[0]
                          : collection.total_owners}
                      </p>
                      <p className="active">
                        <CustomImage
                          image={MARKET_UP_ICON}
                          width="11.7px"
                          height="15.1px"
                          smWidth="8px"
                          smHeight="9.67px"
                        />
                        20.21%
                      </p>
                    </div>
                  )}
                </TopCollectionRow>
              );
            })
          )}
        </TopCollectionBody>
      </FlexBox>
    </FlexBox>
  );
};

export default TopCollections;
