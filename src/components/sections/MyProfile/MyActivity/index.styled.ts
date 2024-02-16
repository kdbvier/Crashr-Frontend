import styled from "styled-components"

const BoldText = styled.span`
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
`

const LinkText = styled.a`
  text-decoration: none;
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: #6073F6;
  white-space: nowrap;
`

const CommonText = styled.span`
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: #9E9E9E;
  white-space: nowrap;
`

const ActivityFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export {
  BoldText,
  LinkText,
  CommonText,
  ActivityFlex
}