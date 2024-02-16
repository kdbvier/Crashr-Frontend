"use client";
import { Container, PageWrapper } from "@/styles/GlobalStyles";
import TrendingRaffles from "./components/TrendingRaffles";
import GlobalStats from "./components/GlobalStats";
import { FlexBox } from "@/components/common/FlexBox";
import { useEffect } from "react";
import { useWalletConnect } from "@/context/WalletConnect";
import { postTransaction } from "@/api/api";
import Slogan from "./components/Slogan";
import { useGlobalContext } from "@/context/GlobalContext";
import RecentTransactions from "../marketplace/components/RecentTransactions";
import TopCollections from "@/components/sections/TopCollections";
import HeroSlideShow from "@/components/sections/HeroSlideShow";

const Home: React.FC = () => {
  const { myWalletAddress, lucid } = useWalletConnect();
  const { colorMode } = useGlobalContext();

  useEffect(() => {
    if (myWalletAddress && lucid) {
    }
  }, [myWalletAddress, lucid]);

  return (
    <PageWrapper colorMode={colorMode}>
      <HeroSlideShow />
      <Container>
        <FlexBox gap="44px" direction="column">
          <GlobalStats />
          <RecentTransactions />
          <TopCollections />
          <TrendingRaffles />
        </FlexBox>
      </Container>
    </PageWrapper>
  );
};

export default Home;
