import styled from 'styled-components';
import { Modal } from 'react-bootstrap';

import { device } from '@/styles/Breakpoints';
import { FlexBox } from '@/components/common/FlexBox';
import CustomText from '@/components/common/CustomText';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { getExactImageFormat } from '@/hooks/function';

interface IStyledModalProps {
  colorMode?: string;
}
const StyledModal = styled(Modal) <IStyledModalProps>`
  background: rgba(50, 50, 50, 0.4);
  box-shadow: 0px 5px 50px 9px #242424;
  .modal-dialog{
    margin: auto;
    max-width: 842px;
    width: 100%;
    
    background: transparent;
    border-radius: 16px;
    @media screen and (max-width: 550px) {
      max-width: 100%;
      min-height: 100vh;
    }
  }
  .modal-header{
    border-bottom: none;
  }
  .connect-success-content {
    background: ${props => props.colorMode === 'light' ? '#e7e7e7' : '#202020'};
    border-radius: 3px;
    border-radius: 3px;
    width: 100%;
    overflow: hidden;
    border: none;
    @media screen and (max-width: 550px) {
      height: 100%;
    }
  }
`;

const ModalBody = styled(Modal.Body)`
  padding: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 51px;
  background-color: #cfcfcf;
  @media ${device.sm} {
  }
  &.modal-body{

  }
`


const SearchInput = styled.input`
  padding: 16px 16px 16px 40px;
  background-color: #e7e7e7;
  background-image: url('/assets/images/icons/search.svg');
  width: 100%;
  background-position: 15px 15px;
  background-size: 25px 25px;
  background-repeat: no-repeat;
  border: none;
`
interface SelectImageProps {
  selected: boolean;
}
const SelectImage = styled.img<SelectImageProps>`
  width: 120px;
  height: 120px;
  cursor: pointer;
  border-radius: 3px;
  border: ${props => props.selected && '2px solid red'};
`
const SelectImageBox = styled.div`
    border-top: 3px #9e9e9e solid;
    max-height: 466px;
    width: 100%;

    overflow: auto;
    /* padding-bottom: 13.5px; */
    background-color: #F3F3F3;
    // padding: 0px 5px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 11px 18px;
    align-items: center;
    justify-content: center;
    ::-webkit-scrollbar {
      width: 9px; /* set width of scrollbar */
      // height: 28px;
    }
    
    ::-webkit-scrollbar-track {
      background:none; /* set background color of track */
    }
    
    ::-webkit-scrollbar-thumb {
      background-color: black; /* set background color of thumb */
      border-radius: 5px; /* set border radius of thumb */
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background-color: #555; /* set background color of thumb on hover */
    }

`

interface Props {
  show: boolean;
  onClose: () => void;
  formData: any;
  setFormData: any;
}
const SelectNFTModal = (
  { show, onClose, formData, setFormData
  }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const { myNFTs, colorMode } = useGlobalContext()

  return (
    <StyledModal show={show} onHide={onClose} centered contentClassName="connect-success-content" colorMode={colorMode}>
      <ModalBody>
        <FlexBox
          height='69px' bgColor='#cfcfcf' paddingLeft='18px' alignItems='center' justifyContent='start'>
          <CustomText
            text={`Select from wallet`}
            fontSize='21px'
            fontFamily='Open Sans'
            fontWeight='600'
            color='#767676'
          />
        </FlexBox>
        <SearchInput
          type="text"
          onChange={(e) => {
            setSearchInput(e.target.value)
          }}
          value={searchInput}
          autoFocus
        />
        <SelectImageBox>
          {
            myNFTs.map((nft: NFTDataProps, index: number) => {

              return (
                <SelectImage
                  key={index}
                  src={getExactImageFormat(nft.image)}
                  selected={formData.includes(nft)}
                  onClick={() => {
                    setFormData([nft])
                    onClose()
                    // // remove nft from selected list if it's already added
                    // if (formData.includes(nft)) {
                    //   let newArray: NFTDataProps[] = formData;
                    //   const index = newArray.indexOf(nft);
                    //   newArray.splice(index, 1);
                    //   console.log("newArray", newArray)
                    //   setFormData(newArray);

                    // } else {
                    //   // check if number of selected nfts is over 10 (if not, add that nft to selected list)
                    //   if (formData.length > 3) {
                    //   } else {
                    //     let newArray: NFTDataProps[] = formData;
                    //     newArray.push(nft);
                    //     console.log("newArray", newArray)
                    //     setFormData(newArray);
                    //   }
                    // }

                  }}
                />
              )

            })
          }
        </SelectImageBox>



      </ModalBody>
    </StyledModal>
  )
}

export default SelectNFTModal