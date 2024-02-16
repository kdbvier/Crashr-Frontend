import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import Navigation from "./navigation";
import Footer from "./footer";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/styles/Theme";
import Slogan from "@/views/home/components/Slogan";
import { useWalletConnect } from "@/context/WalletConnect";
import VERIFIED_COLLECTIONS from "@/constants/verified.collections.constant";
import Loading from "@/components/Loading";
const LayoutStyle = styled.div`
  min-height: 100vh;
  position: relative;
`;

interface MainLayoutProps {
  children: ReactNode;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  // const router = useRouter();
  // if (typeof window === "undefined") return;
  // const currentUrl = window.location.href;
  // console.log("router: ", router, currentUrl);
  const { enableWallet } = useWalletConnect();

  useEffect(() => {
    getVeri();
    // set timer
    setTimeout(() => {
      setIsLoading(false);
      // if (currentUrl.includes("crashr.io")) return;
      doAction();
    }, 1000);
  }, []);

  const doAction = async () => {
    await enableWallet("eternl");
  };
  const getVeri = () => {
    let data: any = Object.values(VERIFIED_COLLECTIONS);
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].verify) {
        arr.push(data[i].name);
      }
    }
    console.log("arr", arr);
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <LayoutStyle>
          <Navigation />
          <Slogan />
          {children}
          <Footer />
        </LayoutStyle>
      )}
    </>
  );
};

export default MainLayout;
