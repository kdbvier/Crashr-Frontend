import CustomImage from '@/components/common/CustomImage'
import CustomText from '@/components/common/CustomText'
import { ARROW_DOWN_ICON, ARROW_UP_ICON, BLACK_DOWN_ICON, BLACK_UP_ICON } from '@/constants/image.constants'
import React, { useState } from 'react'
import * as S from './index.styled'
import { COLORS } from '@/constants/colors.constants'
import { useGlobalContext } from '@/context/GlobalContext'
const categories = [
    {
        text: "All",
        tag: "all"
    },
    {
        text: "New",
        tag: "new"
    },
    {
        text: "Ending Soon",
        tag: "ending"
    },
    {
        text: "Processing",
        tag: "processing"
    },
    {
        text: "Winners",
        tag: "winners"
    },
    {
        text: "Refunded",
        tag: "refund"
    }
]

interface ICategories {
    setActive: any;
    active: any;
}

const Categories = ({
    active, setActive
}: ICategories) => {

    const [isDropdown, setIsDropdown] = useState(false);
    const { colorMode } = useGlobalContext()
    return (
        <S.ComBox>
            <CustomText
                text={`Categories:`}
                fontSize='18px'
                fontWeight='600'
                color={COLORS[colorMode].mainTextColor}
            />
            <S.Select>
                <S.ActiveOption
                    color={COLORS[colorMode].mainTextColor}
                    bgColor={colorMode === 'light' ? '' : '#4f4f4f'}
                    onClick={() => {
                        setIsDropdown(!isDropdown)
                    }}>
                    {categories[active].text}
                    <CustomImage
                        image={
                            isDropdown ? BLACK_DOWN_ICON[colorMode] : BLACK_UP_ICON[colorMode]
                        }
                        width='12px'
                        height='9px'
                    />
                </S.ActiveOption>
            </S.Select>
            {
                isDropdown &&
                <S.OptionBox>
                    {
                        categories.map((category: any, index: number) => {
                            if (index === active) return false;
                            return (
                                <S.Option

                                    color={COLORS[colorMode].mainTextColor}
                                    bgColor={colorMode === 'light' ? '' : '#4f4f4f'}
                                    onClick={() => {
                                        setActive(index)
                                        setIsDropdown(false)
                                    }}>
                                    {
                                        category.text
                                    }
                                </S.Option>
                            )
                        })
                    }
                </S.OptionBox>
            }

        </S.ComBox>
    )
}

export default Categories