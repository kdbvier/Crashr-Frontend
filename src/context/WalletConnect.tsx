import { createContext, PropsWithChildren, useState, useEffect, useContext } from 'react';
import { Blockfrost, Lucid, WalletApi } from 'lucid-cardano';
import { useLocalStorage } from 'react-use';
import axios from 'axios';
import { BASE_URL } from '@/constants/document';
import { infoAlert } from '@/hooks/alert';

interface WalletConnectContextValues {
  api: WalletApi | null;
  lucid: Lucid | null;
  activeWallet: string;
  accumulating: boolean;
  myWalletAddress: string | undefined;
  enableWallet: (name: string) => Promise<void> | void;
  disableWalletAddress: () => Promise<void> | void;
  setMyWalletAddress: (newValue: string | undefined) => void;
}

export const WalletConnectContext = createContext<WalletConnectContextValues>({
  api: null,
  lucid: null,
  activeWallet: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  enableWallet: () => { },
  myWalletAddress: '',
  accumulating: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disableWalletAddress: () => { },
  setMyWalletAddress: () => { },
});

export const WalletConnectProvider = ({ children }: PropsWithChildren) => {
  const [api, setApi] = useState<WalletApi | null>(null);
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [accumulating, setAccumulating] = useState(false);
  const [myWalletAddress, setMyWalletAddress] = useState<string | undefined>();

  const [activeWalletName, setActiveWalletName] = useLocalStorage('active-wallet-name', '');

  const disableWalletAddress = () => {
    setMyWalletAddress('');
    setActiveWalletName('');
  };

  const enableWallet = async (name: string) => {
    try {
      if (!window.cardano[name]) return;
      const api = await window.cardano[name].enable();
      if (!api) return;

      const response = await axios.get(BASE_URL + "secure/blockfrost")
      console.log("api response", response)
      if (!response) {
        infoAlert("You are not authorized!!!")
        return;
      }

      const newLucid = await Lucid.new(
        new Blockfrost(
          "https://cardano-mainnet.blockfrost.io/api/v0",
          response.data.key
        ),
        "Mainnet"
      );
      console.log("new lucid", newLucid)
      newLucid.selectWallet(api);
      setApi(api);
      setActiveWalletName(name);
      setLucid(newLucid);

      const my_wallet_address = await newLucid.wallet.address();
      console.log("my_wallet_address", my_wallet_address)
      // const my_wallet_address = "addr1qyjufrz7xw877xeelt2nr9pnqx2gsy38hhyxmmncv9ryl3xrq0sxngknhm0c43x3x9ln4vd0rrqlnp6afaceyh7quhgshsvfm5"
      //
      setMyWalletAddress(my_wallet_address);

    } catch (error) {
      // infoAlert("You are not authorized!!!")
    }
  };
  useEffect(() => {
    console.log("here")
    const initializeWallet = async () => {
      if (activeWalletName) {
        if (typeof window === "undefined") return;
        const isEnabled = await window.cardano[activeWalletName].isEnabled();

        if (isEnabled) {
          enableWallet(activeWalletName);
        }
      }
    };

    initializeWallet();
  }, [activeWalletName]);


  useEffect(() => {
    console.log("myWalletAddress", myWalletAddress)
  }, [myWalletAddress])

  return (
    <WalletConnectContext.Provider
      value={{
        api,
        lucid,
        activeWallet: activeWalletName ?? '',
        enableWallet,
        accumulating,
        myWalletAddress,
        disableWalletAddress,
        setMyWalletAddress
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};

export const useWalletConnect = () => useContext(WalletConnectContext);