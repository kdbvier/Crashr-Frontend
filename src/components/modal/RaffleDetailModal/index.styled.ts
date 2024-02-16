import styled from "styled-components";

const RemainingTime = styled.div`
  color: var(--crashr-red-500, #F73737);
  font-family: Inconsolata;
  font-size: 21px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.105px;
  &.ended{
    color: #1878af;
  }
`

const ShareNow = styled.div`
  color: var(--periwinkle-500, #6073F6);
  font-family: Inconsolata;
  font-size: 21px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.105px;
`

const TicketEntriesTable = styled.div`
  max-width: 505px;
  width: 100%;
  border: #8896f8 1px solid;
  border-radius: 3px;
  margin-top: 13px;
  max-height: 248px;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 9px; /* set width of scrollbar */
    // height: 28px;
  }
  
  ::-webkit-scrollbar-track {
    background:none; /* set background color of track */
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: black; /* set background color of thumb */
    border-radius: 10px; /* set border radius of thumb */
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* set background color of thumb on hover */
  }
`
interface ITicketEntriesTableRowProps {
  color?: string;
}
const TicketEntriesTableRow = styled.div<ITicketEntriesTableRowProps>`
  color: ${props => props.color};
  padding: 4px 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  &:not(:last-child){
    border-bottom: 1px solid #8896f8;
  }
`

const TicketTableAddress = styled.div`
  max-width: 147px;
  width: 100%;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  white-space: nowrap;
  overflow: hidden!important;
  text-overflow: ellipsis;
  text-decoration: none;
`

const TicketEntriesNumber = styled.div`
  text-align: right;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

interface IRaffleStatsProps {
  color?: string;
}

const RaffleStats = styled.div<IRaffleStatsProps>`
  border-bottom: 1px #cecece solid;
  display: flex;
  padding-bottom: 26px;
  margin-top: 24px;
  color: ${props => props.color};
`

interface RaffleStatGroupStyle {
  isBorder?: boolean;
}

const RaffleStatGroup = styled.div<RaffleStatGroupStyle>`
  display: flex;
  flex-direction: column;
  margin: auto;
  gap: 10px;
  padding: 0px 24px;
  border-right:  ${props => props.isBorder && '1px solid #cecece'};  
`

const RaffleStatSubject = styled.div`
  text-align: center;
  font-family: Open Sans;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

const RaffleStatValue = styled.div`
  text-align: center;
  font-family: Open Sans;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

const CommonText = styled.div`
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

const TicketControl = styled.div`
  display: flex;
  padding: 5px 11px;
  align-items: center;
  gap: 39px;
`
const TicketQuantity = styled.div`
  text-align: center;
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

const TotalPriceValue = styled.div`
  color: var(--periwinkle-500, #6073F6);
  text-align: center;
  font-family: Open Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

export {
  CommonText,
  RaffleStatGroup,
  RaffleStatSubject,
  RaffleStatValue,
  RaffleStats,
  RemainingTime,
  ShareNow,
  TicketControl,
  TicketEntriesNumber,
  TicketEntriesTable,
  TicketEntriesTableRow,
  TicketQuantity,
  TicketTableAddress,
  TotalPriceValue
}
