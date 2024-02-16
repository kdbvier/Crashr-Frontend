import { useWalletConnect } from '@/context/WalletConnect';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdContentCopy, MdCheckCircleOutline } from 'react-icons/md';
import styled from 'styled-components';
import CustomImage from './common/CustomImage';
import { COPY_ICON } from '@/constants/image.constants';

interface CopyBoardType {
  addr?: string;
  maxWidth?: string;
}

const ClipboardPanel = styled.div<CopyBoardType>`
  width: default;
  height: 35px;
  color: black !important;
  background: none;
  border-radius: 5px;
  display: flex;
  gap: 6px;
  
  padding: 4px 16px 4px 1px;
  align-items: center;
  .address {
    max-width: ${(props) => props.maxWidth ? props.maxWidth : 'default'};
    width: 100%;
    padding: 0px !important;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
    font-family: Open Sans;
    font-size: 17px;
    font-style: normal;
    font-weight: 600;
    color: #6073f6;
    line-height: 130%;
    white-space: nowrap;
    overflow: hidden!important;
    text-overflow: ellipsis;
  }
  .click-icon {
    cursor: pointer;
  }
  @media screen and (max-width: 768px) {
    width: 100px;
    height: 20px;
    .address{
      font-size: 16px;
    }
  }
`;

const CopyBoard = (
  { addr, maxWidth }: CopyBoardType
) => {
  const [copyValue, setCopyValue] = useState(addr);
  const [copied, setCopied] = useState(false);

  const { myWalletAddress } = useWalletConnect();

  useEffect(() => {
    if (copied === true) {
      setTimeout(() => {
        setCopied(false)
      }, 1000)
    }
  }, [copied]);

  return (
    <ClipboardPanel maxWidth={maxWidth}>
      <div className="address">
        {addr && addr}
      </div>
      <div className="click-icon">
        <CopyToClipboard text={copyValue || ''} onCopy={() => setCopied(true)}>
          {myWalletAddress &&
            copied ?
            <MdCheckCircleOutline size={24} />
            :
            <CustomImage
              image={COPY_ICON}
              width='28px'
              height='28px'
              smWidth='13px'
              smHeight='18px'
            />}
        </CopyToClipboard>
      </div>
    </ClipboardPanel>
  );
};

export default CopyBoard;
