import { useState, useEffect } from "react";
import { useMedia } from "react-use";
import {
  Navbar,
  Form,
  Offcanvas,
  Dropdown,
  NavbarOffcanvas,
} from "react-bootstrap";
import styled from "styled-components";

import {
  NavWrapper,
  NavContainer,
  NavFlex,
  DropdownToggle,
  DropdownMenu,
  NavBrand,
  NavImage,
  NavbarLink,
  MobileWalletIcon,
  MobileProfileImage,
  NavProfileImage,
} from "./index.styled";

import {
  CART_ICON,
  DEFAULT_NFT_IMAGE,
  NIGHT_ICON,
  NOTIFICATION_NO_ICON,
  NOTIFICATION_YES_ICON,
  SUN_ICON,
  WALLET_ICON,
} from "@/constants/image.constants";
import CustomImage from "@/components/common/CustomImage";
import { FlexBox } from "@/components/common/FlexBox";
import CustomText from "@/components/common/CustomText";
// import ConnectSuccessModal from 'components/modal/ConnectSuccessModal';
import CustomRouterLinkButton from "@/components/common/CustomRouterLinkButton";
import BRAND_IMAGE from "@/assets/logo.svg";
import BRAND_MOBILE_IMAGE from "@/assets/logo_mobile.svg";
import { useWalletConnect } from "@/context/WalletConnect";
import { useGlobalContext } from "@/context/GlobalContext";
import CustomSearchInput from "@/components/common/CustomSearchInput";
import EditProfileModal from "@/components/modal/EditProfileModal";
import ConnectWalletModal2 from "@/components/modal/ConnectWalletModal2";
import { buyCart } from "@/api/marketplace/buyCart";
import PurchaseCartModal from "@/components/modal/PurchaseCartModal";
import SuccessModal from "@/components/modal/SuccessModal";
import { useCart } from "@/context/CartContext";
import InputsExhaustedModal from "@/components/modal/InputsExhaustedModal";
import { infoAlert } from "@/hooks/alert";
import { toHex } from "lucid-cardano";
import NavigationSearch from "./NavigationSearch";

const OffcanvasHeader = styled(Offcanvas.Header)`
  flex-direction: row-reverse;
  padding-left: 49px;
  background: #202020;
  width: 100vw;
  .btn-close {
    --bs-btn-close-bg: url("/assets/images/icons/white-close.svg");
  }
  @media screen and (max-width: 768px) {
    flex-direction: row;
    padding-left: 25px;
  }
`;
const OffcanvasBody = styled(Offcanvas.Body)`
  background: #202020;
  &.offcanvas-body {
    padding-left: 49px;
    &.nav-link {
      font-family: Inconsolata;
      font-size: 28px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.42px;
    }
  }
`;

function Navigation() {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showExhaustedModal, setShowExhaustedModal] = useState(false);
  const [showSuccessPurchaseModal, setShowSuccessPurchaseModal] =
    useState(false);
  const [show, setShow] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const isMobile = useMedia("(max-width: 650px)");

  const { removeAllCart, cartData } = useCart();

  const { myWalletAddress, lucid, disableWalletAddress } = useWalletConnect();
  const { userData, colorMode, setColorMode } = useGlobalContext();
  useEffect(() => {
    if (search !== "") {
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  }, [search]);

  const sign = async () => {
    try {
      const address = myWalletAddress;
      if (!address) return;
      let utf8Encode = new TextEncoder();
      const payload = toHex(utf8Encode.encode("Hello from Crashr!"));
      console.log("payload", payload);
      // @ts-ignore
      const signedMessage = await lucid.newMessage(address, payload).sign();

      // Verify the message
      // @ts-ignore
      const hasSigned: boolean = await lucid?.verifyMessage(
        address,
        payload,
        signedMessage
      );
      console.log("hasSigned", hasSigned);

      if (hasSigned === true) {
        setShowEditModal(true);
      } else {
        infoAlert("Your signature is not correct!");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const purchaseCarts = async () => {
    if (!myWalletAddress) return;
    const utxoArray = cartData.map((item: any) => item.utxo);
    const res = await buyCart(lucid, myWalletAddress, utxoArray);
    if (res) {
      if (res.result === "success") {
        removeAllCart();
        setShowPurchaseModal(false);
        setShowSuccessPurchaseModal(true);
      }
      if (res.result === "fail" && res.error === "InputsExhaustedError") {
        setShowPurchaseModal(false);
        setShowExhaustedModal(true);
      }
    }
  };

  const disconnectWallet = () => {
    disableWalletAddress();
    window.location.href = "/";
    setAlertMessage("Your wallet has been successfully logged out.");
    setShowSuccessModal(true);
  };

  useEffect(() => {
    if (connected) {
      setAlertMessage("Your wallet has been successfully connected.");
      setShowSuccessModal(true);
    }
  }, [connected]);

  return (
    <>
      {["sm"].map((expand) => (
        // @ts-ignore
        <NavWrapper key={expand} expand={expand} className="bg-body-tertiary">
          <NavContainer fluid>
            <NavBrand href="/">
              <NavImage
                src={isMobile ? BRAND_MOBILE_IMAGE.src : BRAND_IMAGE.src}
              />
            </NavBrand>
            {myWalletAddress ? (
              <>
                {isMobile && (
                  <MobileProfileImage
                    src={
                      userData && userData?.bomber_avatar
                        ? userData?.bomber_avatar
                        : userData?.avatar
                    }
                    width="40px"
                    height="40px"
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                    }}
                    // @ts-ignore
                    onMouseOver={() => {
                      setShowDropdown(true);
                    }}
                  />
                )}
              </>
            ) : (
              <>
                {isMobile && (
                  <MobileWalletIcon
                    src={WALLET_ICON}
                    onClick={() => {
                      setShowConnectModal(true);
                    }}
                  />
                )}
              </>
            )}
            <Navbar.Toggle
              aria-controls={`offcanvasNavbar-expand-${expand}`}
              onClick={() => {
                setShow(true);
              }}
            />
            {!isMobile && (
              <NavbarOffcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
              >
                <OffcanvasHeader closeButton></OffcanvasHeader>
                <OffcanvasBody>
                  <NavFlex>
                    <Dropdown>
                      <DropdownToggle>Marketplace</DropdownToggle>
                      <DropdownMenu>
                        <CustomRouterLinkButton
                          link="/marketplace"
                          text="Marketplace"
                          fontSize="21px"
                          padding="20px 12px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          width="181px"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/collections"
                          text="All Collections"
                          fontSize="21px"
                          padding="20px 12px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          width="181px"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/nfts"
                          text="All NFTs"
                          padding="20px 12px"
                          fontSize="21px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                      </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                      <DropdownToggle>Community</DropdownToggle>

                      <DropdownMenu>
                        <CustomRouterLinkButton
                          link="/raffle"
                          text="Raffle"
                          padding="20px 12px"
                          fontSize="21px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/polls"
                          text="Polls"
                          fontSize="21px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          padding="20px 12px"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/leaderboard"
                          text="Leaderboard"
                          fontSize="21px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          padding="20px 12px"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/ispo"
                          text="ISPO"
                          fontSize="21px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          padding="20px 12px"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                      </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                      <DropdownToggle>About</DropdownToggle>

                      <DropdownMenu>
                        <CustomRouterLinkButton
                          link="/about"
                          text="Crashr"
                          fontSize="21px"
                          fontWeight="700"
                          padding="20px 12px"
                          smFontSize="21px"
                          smFontWeight="700"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/fee-structure"
                          text="Fee Structure"
                          fontSize="21px"
                          fontWeight="700"
                          padding="20px 12px"
                          smFontSize="21px"
                          smFontWeight="700"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/faq"
                          text="FAQ"
                          fontSize="21px"
                          fontWeight="700"
                          padding="20px 12px"
                          smFontSize="21px"
                          smFontWeight="700"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                      </DropdownMenu>
                    </Dropdown>

                    <NavbarLink
                      href="https://bombers.crashr.io"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      Bombers
                    </NavbarLink>
                    {isMobile && (
                      <NavbarLink
                        href="/my-profile"
                        onClick={() => {
                          setShow(false);
                        }}
                      >
                        My Profile
                      </NavbarLink>
                    )}
                  </NavFlex>
                  {!isMobile && (
                    <Form className="d-flex align-items-center gap-3">
                      {colorMode === "light" ? (
                        <CustomImage
                          image={SUN_ICON}
                          width="32px"
                          height="32px"
                          cursor="pointer"
                          onClick={() => {
                            setColorMode("dark");
                          }}
                        />
                      ) : (
                        <CustomImage
                          image={NIGHT_ICON}
                          width="32px"
                          height="32px"
                          cursor="pointer"
                          onClick={() => {
                            setColorMode("light");
                          }}
                        />
                      )}

                      <div>
                        <CustomSearchInput
                          bgColor="#4f4f4f"
                          maxWidth="184px"
                          height="33px"
                          placeholder="Search"
                          bgPosition="5px 5px"
                          input={search}
                          setInput={setSearch}
                        // onClick={() => {
                        //   console.log("here")
                        //   setShowDropdown(!showDropdown)
                        // }}
                        // @ts-ignore
                        // onMouseOver={() => {
                        //   setShowResult(true);
                        // }}
                        />
                        {showResult && (
                          <NavigationSearch
                            search={search}
                            onMouseLeave={() => {
                              setSearch("");
                              setShowResult(false);
                            }}
                          />
                        )}
                      </div>
                      {!myWalletAddress ? (
                        <CustomImage
                          image={WALLET_ICON}
                          width="63px"
                          height="48px"
                          onClick={() => {
                            setShowConnectModal(true);
                          }}
                          cursor="pointer"
                        />
                      ) : (
                        <div>
                          <img
                            src={
                              userData && userData?.avatar
                                ? userData?.avatar
                                : DEFAULT_NFT_IMAGE
                            }
                            alt="avatar"
                            onClick={() => {
                              console.log("here");
                              setShowDropdown(!showDropdown);
                            }}
                            // @ts-ignore
                            onMouseOver={() => {
                              setShowDropdown(true);
                            }}
                            style={{
                              width: "48px",
                              height: "48px",
                              cursor: "pointer",
                              borderRadius: "3px",
                            }}
                          />
                          {/* ************ wallet dropdown ************** */}
                          {showDropdown && (
                            <FlexBox
                              // @ts-ignore
                              onMouseLeave={() => {
                                setShowDropdown(false);
                              }}
                              bgColor="#202020"
                              position="absolute"
                              justifyContent="start"
                              right="165px"
                              maxWidth="252px"
                              height="87px"
                              padding="18px 25px"
                              gap="12px"
                              zIndex={1000}
                              boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
                            >
                              <NavProfileImage
                                src={
                                  userData &&
                                  userData?.avatar &&
                                  userData?.avatar
                                }
                              />

                              <FlexBox direction="column" gap="8px">
                                <CustomRouterLinkButton
                                  hoverBgColor="none"
                                  text={
                                    userData &&
                                      userData.username &&
                                      userData.username.length > 15
                                      ? userData?.username.slice(0, 15) + "..."
                                      : userData?.username
                                  }
                                  fontSize="16px"
                                  fontWeight="600"
                                  fontFamily="Open Sans"
                                  lineHeight="100%"
                                  justifyContent="start"
                                  link="/my-profile"
                                  height="22px"
                                  color="white"
                                />
                                <FlexBox
                                  justifyContent="start"
                                  alignItems="center"
                                  gap="8px"
                                >
                                  <CustomRouterLinkButton
                                    hoverBgColor="none"
                                    color="#af89fa"
                                    text="Edit Profile"
                                    fontSize="12px"
                                    fontWeight="600"
                                    lineHeight="100%"
                                    justifyContent="start"
                                    onClick={() => {
                                      sign();
                                    }}
                                    // link="/edit-profile"
                                    width="default"
                                    fontFamily="Open Sans"
                                    padding="4px 0px"
                                  />
                                  <CustomText
                                    lineHeight="100%"
                                    text="Log Out"
                                    cursor="pointer"
                                    fontSize="12px"
                                    fontWeight="600"
                                    fontFamily="Open Sans"
                                    color="#af89fa"
                                    padding="4px 0px"
                                    onClick={() => {
                                      disconnectWallet();
                                    }}
                                  />
                                </FlexBox>
                              </FlexBox>
                            </FlexBox>
                          )}
                        </div>
                      )}
                      <CustomImage
                        width="55px"
                        height="48px"
                        image={
                          cartData && cartData.length > 0
                            ? NOTIFICATION_YES_ICON
                            : NOTIFICATION_NO_ICON
                        }
                        cursor="pointer"
                        onClick={() => {
                          setShowPurchaseModal(true);
                        }}
                      />
                    </Form>
                  )}
                </OffcanvasBody>
              </NavbarOffcanvas>
            )}
            {isMobile && show && (
              <NavbarOffcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
              >
                <OffcanvasHeader closeButton>
                  {colorMode === "light" ? (
                    <CustomImage
                      image={SUN_ICON}
                      width="32px"
                      height="32px"
                      cursor="pointer"
                      onClick={() => {
                        setColorMode("dark");
                      }}
                    />
                  ) : (
                    <CustomImage
                      image={NIGHT_ICON}
                      width="32px"
                      height="32px"
                      cursor="pointer"
                      onClick={() => {
                        setColorMode("light");
                      }}
                    />
                  )}
                </OffcanvasHeader>
                <OffcanvasBody>
                  <NavFlex>
                    <Dropdown>
                      <DropdownToggle>Marketplace</DropdownToggle>
                      <DropdownMenu>
                        <CustomRouterLinkButton
                          link="/marketplace"
                          text="Marketplace"
                          fontSize="21px"
                          padding="20px 12px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          width="181px"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/collections"
                          text="All Collections"
                          fontSize="21px"
                          padding="20px 12px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          width="181px"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/nfts"
                          text="All NFTs"
                          padding="20px 12px"
                          fontSize="21px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                      </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                      <DropdownToggle>Community</DropdownToggle>

                      <DropdownMenu>
                        <CustomRouterLinkButton
                          link="/raffle"
                          text="Raffle"
                          padding="20px 12px"
                          fontSize="21px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/polls"
                          text="Polls"
                          fontSize="21px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          padding="20px 12px"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/leaderboard"
                          text="Leaderboard"
                          fontSize="21px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          padding="20px 12px"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/ispo"
                          text="ISPO"
                          fontSize="21px"
                          fontWeight="700"
                          smFontSize="21px"
                          smFontWeight="700"
                          padding="20px 12px"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                      </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                      <DropdownToggle>About</DropdownToggle>

                      <DropdownMenu>
                        <CustomRouterLinkButton
                          link="/about"
                          text="Crashr"
                          fontSize="21px"
                          fontWeight="700"
                          padding="20px 12px"
                          smFontSize="21px"
                          smFontWeight="700"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/fee-structure"
                          text="Fee Structure"
                          fontSize="21px"
                          fontWeight="700"
                          padding="20px 12px"
                          smFontSize="21px"
                          smFontWeight="700"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                        <CustomRouterLinkButton
                          link="/faq"
                          text="FAQ"
                          fontSize="21px"
                          fontWeight="700"
                          padding="20px 12px"
                          smFontSize="21px"
                          smFontWeight="700"
                          hoverColor="black"
                          hoverBgColor="#CECECE"
                          borderRadius="0px"
                          onClick={() => {
                            setShow(false);
                          }}
                        />
                      </DropdownMenu>
                    </Dropdown>

                    <NavbarLink
                      href="https://bombers.crashr.io"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      Bombers
                    </NavbarLink>
                    {isMobile && (
                      <NavbarLink
                        href="/my-profile"
                        onClick={() => {
                          setShow(false);
                        }}
                      >
                        My Profile
                      </NavbarLink>
                    )}
                  </NavFlex>
                  {!isMobile && (
                    <Form className="d-flex align-items-center gap-3">
                      <div>
                        <CustomSearchInput
                          bgColor="#4f4f4f"
                          maxWidth="184px"
                          height="33px"
                          placeholder="Search"
                          bgPosition="5px 5px"
                          input={search}
                          setInput={setSearch}
                        />
                      </div>
                      {!myWalletAddress ? (
                        <div>
                          <CustomImage
                            image={WALLET_ICON}
                            width="63px"
                            height="48px"
                            onClick={() => {
                              setShowConnectModal(true);
                            }}
                            cursor="pointer"
                          />
                        </div>
                      ) : (
                        <div>
                          <img
                            src={
                              userData && userData?.avatar
                                ? userData?.avatar
                                : DEFAULT_NFT_IMAGE
                            }
                            alt="avatar"
                            onClick={() => {
                              console.log("here");
                              setShowDropdown(!showDropdown);
                            }}
                            // @ts-ignore
                            onMouseOver={() => {
                              setShowDropdown(true);
                            }}
                            style={{
                              width: "48px",
                              height: "48px",
                              cursor: "pointer",
                              borderRadius: "3px",
                            }}
                          />
                          {/* ************ wallet dropdown ************** */}
                          {showDropdown && (
                            <FlexBox
                              // @ts-ignore
                              onMouseLeave={() => {
                                setShowDropdown(false);
                              }}
                              bgColor="#202020"
                              position="absolute"
                              justifyContent="start"
                              right="165px"
                              maxWidth="252px"
                              height="87px"
                              padding="18px 25px"
                              gap="12px"
                              zIndex={1000}
                              boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
                            >
                              <NavProfileImage
                                src={
                                  userData &&
                                  userData?.avatar &&
                                  userData?.avatar
                                }
                              />

                              <FlexBox direction="column" gap="8px">
                                <CustomRouterLinkButton
                                  hoverBgColor="none"
                                  text={
                                    userData && userData?.username
                                      ? userData?.username.slice(0, 10) + "..."
                                      : "undefined"
                                  }
                                  fontSize="16px"
                                  fontWeight="600"
                                  fontFamily="Open Sans"
                                  lineHeight="100%"
                                  justifyContent="start"
                                  link="/my-profile"
                                  height="22px"
                                  color="white"
                                />
                                <FlexBox
                                  justifyContent="start"
                                  alignItems="center"
                                  gap="8px"
                                >
                                  <CustomRouterLinkButton
                                    hoverBgColor="none"
                                    color="#af89fa"
                                    text="Edit Profile"
                                    fontSize="12px"
                                    fontWeight="600"
                                    lineHeight="100%"
                                    justifyContent="start"
                                    onClick={() => {
                                      setShowEditModal(true);
                                    }}
                                    // link="/edit-profile"
                                    width="default"
                                    fontFamily="Open Sans"
                                    padding="4px 0px"
                                  />
                                  <CustomText
                                    lineHeight="100%"
                                    text="Log Out"
                                    cursor="pointer"
                                    fontSize="12px"
                                    fontWeight="600"
                                    fontFamily="Open Sans"
                                    color="#af89fa"
                                    padding="4px 0px"
                                    onClick={() => {
                                      disconnectWallet();
                                    }}
                                  />
                                </FlexBox>
                              </FlexBox>
                            </FlexBox>
                          )}
                        </div>
                      )}
                      <CustomImage
                        width="55px"
                        height="48px"
                        image={
                          cartData.length > 0
                            ? NOTIFICATION_YES_ICON
                            : NOTIFICATION_NO_ICON
                        }
                        cursor="pointer"
                        onClick={() => {
                          setShowPurchaseModal(true);
                        }}
                      />
                    </Form>
                  )}
                </OffcanvasBody>
              </NavbarOffcanvas>
            )}
          </NavContainer>
          {showConnectModal && (
            <ConnectWalletModal2
              show={showConnectModal}
              onClose={() => {
                setShowConnectModal(false);
              }}
            />
          )}
          {showEditModal && (
            <EditProfileModal
              show={showEditModal}
              onClose={() => {
                setShowEditModal(false);
              }}
            />
          )}
          {showSuccessPurchaseModal && (
            <SuccessModal
              show={showSuccessPurchaseModal}
              onClose={() => {
                setShowSuccessPurchaseModal(false);
              }}
              message="You have successfully made your purchase."
            />
          )}
          {showPurchaseModal && (
            <PurchaseCartModal
              show={showPurchaseModal}
              onClose={() => {
                setShowPurchaseModal(false);
              }}
              purchaseCarts={purchaseCarts}
            />
          )}
        </NavWrapper>
      ))}
      <InputsExhaustedModal
        show={showExhaustedModal}
        onClose={() => {
          setShowExhaustedModal(false);
        }}
      />
    </>
  );
}

export default Navigation;
