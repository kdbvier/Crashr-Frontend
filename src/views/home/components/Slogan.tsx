import React from 'react'
import styled from 'styled-components'
const SloganBG = styled.div`
  background-color: #f73737;
  min-width: 100%;
  color: #FFF;
  text-align: center;
  /* 🖥️Desktop/Heading/H3 */
  font-family: Inconsolata;
  font-size: 33px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 39.6px */
  letter-spacing: -0.825px;
  padding: 8px 0;
  cursor: pointer;
  text-decoration: none;
  @media screen and (max-width: 768px) {
  font-size: 19px;
  }
`
const Slogan = () => {
  return (
    <SloganBG
      onClick={() => {
        if (typeof window === "undefined") return;
        window.location.href = "/ispo"
      }}
    >
      $CRASH ISPO IS LIVE
    </SloganBG>
  )
}

export default Slogan