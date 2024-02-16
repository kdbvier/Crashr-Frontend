import styled from "styled-components";
import { device } from "@/styles/Breakpoints";

export const Font24 = styled.p`
  font-size: 24px;
  font-family: Inconsolata;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 1.92px;
  text-transform: uppercase;
  @media ${device.sm} {
    font-size: 18px;
    letter-spacing: 1.44px;
  }
`

interface H1Props {
  color?: string;
  fontSize?: string;
  smFontSize?: string;
}

export const H1 = styled.h1<H1Props>`
  font-size: ${props => props.fontSize ? props.fontSize : '41px'};
  font-family: Inconsolata;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -1.025px;
  color: ${props => props.color ? props.color : 'black'};
  text-align: left;
  @media ${device.sm} {
    font-size: ${props => props.smFontSize ? props.smFontSize : '33px'};
    letter-spacing: -0.66px;
    /* margin-top: -40px; */
  }
`
interface H2Props {
  color?: string;
}
export const H2 = styled.h2<H2Props>`
  font-family: Inconsolata;
  font-size: 33px;
  font-style: normal;
  font-weight: 600;
line-height: 120%; /* 39.6px */
letter-spacing: -0.825px;
  color: ${props => props.color ? props.color : 'black'};
  @media ${device.sm} {
    font-size: 25px;
    letter-spacing: -1px;
  }
`
interface H3Props {
  color?: string;
}
export const H3 = styled.h3<H3Props>`
  font-size: 38px;
  font-family: Inconsolata;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  color: ${props => props.color ? props.color : 'black'};
  @media ${device.sm} {
    font-size: 38px;
    letter-spacing: -0.57px;
  }
`


interface H6Style {
  color?: string;
}
export const H6 = styled.h6<H6Style>`
  font-family: Open Sans;
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.color ? props.color : 'black'};
  @media ${device.sm} {
    font-size: 15px;
  }
`

interface H7Style {
  color?: string;
}
export const H7 = styled.h6<H7Style>`
  font-family: Open Sans;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: ${(props) => props.color ? props.color : 'black'};
  @media ${device.sm} {
    font-size: 14px;
  }
`
export const H8 = styled.h6<H7Style>`
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: ${(props) => props.color ? props.color : 'black'};
  @media ${device.sm} {
    font-size: 14px;
  }
`