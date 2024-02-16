import styled from "styled-components"

const BoldText = styled.span`
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`

const LinkText = styled.a`
  text-decoration: none;
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: #6073F6;
`
interface CommonTextStyle {
  colorMode?: string;
}
const CommonText = styled.div<CommonTextStyle>`
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: ${props => props.colorMode === 'light' ? '#9E9E9E' : 'white'};
`

export {
  BoldText,
  LinkText,
  CommonText
}