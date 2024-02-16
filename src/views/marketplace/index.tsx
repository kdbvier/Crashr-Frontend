import { H1 } from '@/components/typography'
import { Container, PageWrapper } from '@/styles/GlobalStyles'
import { FlexBox } from '@/components/common/FlexBox'
import { MARKETPLACE_HEADER_IMAGE } from '@/constants/image.constants'
import HeaderBanner from '@/components/HeaderBanner'
import CustomSearchInput from '@/components/common/CustomSearchInput'
// import UpcomingMints from './components/UpcomingMints'
import NewCollections from './components/NewCollections'
import { useState } from 'react'
import { useGlobalContext } from '@/context/GlobalContext'
import { COLORS } from '@/constants/colors.constants'
import NewNFTs from './components/NewNFTs'
import RecentTransactions from './components/RecentTransactions'
import TopCollections from '@/components/sections/TopCollections'

const Marketplace = () => {
  const [search, setSearch] = useState<string>('');
  const { colorMode } = useGlobalContext()
  return (
    <PageWrapper colorMode={colorMode}>
      <HeaderBanner
        image={MARKETPLACE_HEADER_IMAGE}
      />
      <Container paddingTop='12px' smMarginTop='-30px'>
        <H1 color={COLORS[colorMode].mainTextColor}>
          Marketplace
        </H1>
        <FlexBox justifyContent='start' marginTop='16px' marginBottom='24px' smMarginTop='12px'>
          <CustomSearchInput
            placeholder='Search'
            input={search}
            setInput={setSearch}
          />
        </FlexBox>
        <FlexBox gap="54px" direction='column'>
          <RecentTransactions />
          <TopCollections />
          {/* <UpcomingMints /> */}
          <NewCollections />
          <NewNFTs />
        </FlexBox>
      </Container>
    </PageWrapper>
  )
}

export default Marketplace