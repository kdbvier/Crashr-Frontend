import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />

        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />

        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css?family=Inconsolata:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&display=swap"
          rel="stylesheet"
        />
        <script src="chrome-extension://lpfcbjknijpeeillifnkikgncikgfhdo/injected.bundle.js"></script>
        <script src="https://ipfs.io/ipfs/QmdZwDrQckKBbSStbTKCFiGtc8zaQTtstevN9wo5Kwn6BP"></script>
        <script type="text/javascript" src="./bridge/cardano-dapp-connector-bridge.js"></script>
        <script type="text/javascript" src="./dapp/cardano-dapp-connector-bridge-init-bare.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
