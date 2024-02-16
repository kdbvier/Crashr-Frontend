import { CartProvider } from "@/context/CartContext";
import { GlobalProvider } from "@/context/GlobalContext";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter, Inconsolata, Open_Sans } from "next/font/google";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/styles/Theme";
import { WalletConnectProvider } from "@/context/WalletConnect";
import MainLayout from "@/components/layout";

// import "@/styles/globals.css";
// import "@/styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });
const inconsolata = Inconsolata({ subsets: ["latin"] });
const openSans = Open_Sans({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <Suspense fallback={<Loading />}>
    <ThemeProvider theme={lightTheme}>
      <WalletConnectProvider>
        <GlobalProvider>


          <CartProvider>
            {/* <Head>
              <title>CRASHR</title>
              <meta
                name="description"
                content="The Ultimate Platform. Providing the tools on the Cardano Blockchain for NFT Traders."
              />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
            </Head> */}
            <GlobalStyles />
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
            <Toaster />
          </CartProvider>


        </GlobalProvider>
      </WalletConnectProvider>
    </ThemeProvider >
  );
}
