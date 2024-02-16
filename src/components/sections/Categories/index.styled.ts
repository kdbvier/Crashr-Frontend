import styled from "styled-components";

const ComBox = styled.div`
    display: flex;
    gap: 16px;
    position: relative;
`

const Select = styled.div`
    position: relative;
    color: #000;

    font-family: Open Sans;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`
interface IActiveOption {
    color?: string;
    bgColor?: string;
}
const ActiveOption = styled.div<IActiveOption>`
    display: flex;
    width: 154px;
    height: 52px;
    padding: 7px 12px;
    align-items: center;
    justify-content: space-between;
    border-radius: 3px 3px 0px 0px;
    border: 2px solid #6073f6;
    cursor: pointer;
    color: ${props => props.color};
    background-color: ${props => props.bgColor};
`

const OptionBox = styled.div<IOptionBox>`
    display: flex;
    width: 154px;
    flex-direction: column;
    background-color: #e7e7e7;
    border-radius: 0px 0px 3px 3px;
    border: 2px solid #6073f6;
    position: absolute;
    z-index: 100;
    margin-top: 50px;
   
    right: 0px;
`
interface IOptionBox {
    color?: string;
    bgColor?: string;
}
const Option = styled.div<IOptionBox>`
    padding: 7px 12px;
    font-family: Open Sans;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    cursor: pointer;
    color: ${props => props.color};
    background-color: ${props => props.bgColor};
    &:hover{
        background-color: #aaaaaa;
    }
`


export {
    Select,
    ActiveOption,
    OptionBox,
    Option,
    ComBox
}