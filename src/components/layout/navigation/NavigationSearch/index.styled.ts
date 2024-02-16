import styled from "styled-components";
interface ITab {
    active?: boolean;
}
const Container = styled.div`
    margin-top: 2px;
    max-width: 450px;
    width: 100%;
    background: '#4f4f4f';
    z-index: 1001;
    position: absolute;
    right: 230px;
    border-radius: 3px;
`

const TabFlex = styled.div`
    display: flex;
    border-radius: 3px 3px 0px 0px;
    background-color: #4f4f4f;
`

const Tab = styled.div<ITab>`
    color: ${(props) => props.active ? '#AFB9FB' : '#B6B6B6'};
    border-bottom: ${(props) => props.active ? '3px solid #AFB9FB' : ' 1px solid #B6B6B6'};
    font-family: Open Sans;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    width: 225px;
    height: 40px;
    
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 3px;
`

const Body = styled.div`
    max-height: 432px;
    border-radius: 0px 0px 3px 3px;
    background-color: #4f4f4f;
`

const Row = styled.div`
    padding: 13px 16px;
    display: flex;
    justify-content: space-between;
    background-color: #4f4f4f;
    cursor: pointer;
    border-radius: 3px;
    text-decoration: none;
    span{

    }
    &:hover{
        background-color: #767676;
    }
`

const RowLeft = styled.div`

    display: flex;
    align-items:center;
    span{
        color: var(--crashr-brand-true-white, #FFF);
        /* 📱Mobile/medium/regular */
        font-family: Open Sans;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        margin-left: 8px;
        margin-right: 4px;
        white-space: nowrap;
        overflow: hidden!important;
        text-overflow: ellipsis;
        max-width: 300px;
    }
`

const RowRight = styled.div`
    color: var(--periwinkle-300, #afb9fb);

    font-family: Open Sans;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;    
`

export {
    Container,
    TabFlex,
    Tab,
    Body,
    Row,
    RowLeft,
    RowRight
}