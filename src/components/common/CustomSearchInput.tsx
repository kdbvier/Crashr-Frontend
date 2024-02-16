import { useGlobalContext } from '@/context/GlobalContext';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

interface CustomSearchInputType {
  placeholder?: string;
  bgColor?: string;
  input?: any;
  setInput?: any;
  maxWidth?: string;
  height?: string;
  bgPosition?: string;
  color?: string;
  boxShadow?: string;
  // borderLeft?: string;
}

const SearchInputStyle = styled.input<CustomSearchInputType>`
  width: 100%;
  max-width: ${(props) => props.maxWidth ? props.maxWidth : '440px'};
  height: ${(props) => props.height ? props.height : '48px'};
  box-sizing: border-box !important;
  border: none;
  background: ${(props) => props.bgColor};
  box-shadow: ${(props) => props.boxShadow ? props.boxShadow : '0px 2px 9px -4px rgba(0, 0, 0, 0.19)'};
  border-radius: 3px;
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.color};
  padding: 12px 16px 12px 47px !important;
  background-image: url('/assets/images/icons/search.svg');
  background-position:  ${(props) => props.bgPosition ? props.bgPosition : '12px 13px'};
  background-size: 24px 24px;
  background-repeat: no-repeat;
  ::placeholder {
    color: #9e9e9e;
  }
  &:focus {
    border: none;
    outline: none;
  }

  @media screen and (max-width: 550px) {
    height: 42px;
    font-size: 16px;
    line-height: 24px;
    background-size: 22px 22px;
    padding: 12px 12px 12px 48px !important;
    background-position: 14px 11px;
  }
`;

const CustomSearchInput: React.FC<CustomSearchInputType> = ({
  placeholder,
  bgColor,
  setInput,
  input,
  maxWidth,
  height,
  bgPosition,
  color,
  boxShadow,
  // borderLeft
}) => {
  const { colorMode } = useGlobalContext()
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <SearchInputStyle
      type="text"
      placeholder={placeholder}
      onChange={handleInputChange}
      value={input}
      bgColor={bgColor ? bgColor : (colorMode === 'light' ? '#f3f3f3' : '#4f4f4f')}
      color={color ? color : (colorMode === 'light' ? '#9e9e9e' : '#b6b6b6')}
      maxWidth={maxWidth}
      height={height}
      bgPosition={bgPosition}
      autoFocus
      boxShadow={boxShadow}
    // borderLeft={borderLeft}
    />
  );
};

export default CustomSearchInput;
