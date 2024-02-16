import CustomImage from '@/components/common/CustomImage'
import { FlexBox } from '@/components/common/FlexBox'
import { H1 } from '@/components/typography'
import { useEffect, useState } from 'react'
import { Container, PageWrapper } from '@/styles/GlobalStyles'
import { LeaderboardTab, TableHeader, TableRow } from './index.styled'
import { getUserPoints } from '@/api/api'
import { ThreeDots } from 'react-loader-spinner'
import { useMedia } from 'react-use'
import { useGlobalContext } from '@/context/GlobalContext'
import { COLORS } from '@/constants/colors.constants'
import SkeletonCollectionStat from '@/components/skeleton/SkeletonCollectionStat'



const tabData = ["Season", "All Time"];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<string>("Season");
  const [pointsData, setPointsData] = useState();
  const [loading, setLoading] = useState<boolean>(false)
  const isMobile = useMedia('(max-width: 768px)');
  const { colorMode } = useGlobalContext()

  const getLeaderboardData = async () => {
    setLoading(true)
    const data = await getUserPoints()
    if (data) {
      setLoading(false)
      setPointsData(data)
    }
  }

  useEffect(() => {
    getLeaderboardData()
  }, [])

  return (
    <PageWrapper colorMode={colorMode}>
      <Container paddingTop='92px' smPaddingTop='40px'>
        <FlexBox direction='column' gap="44px" marginBottom='33px'>
          <H1 color={COLORS[colorMode].mainTextColor}>
            Leaderboard
          </H1>
          <FlexBox justifyContent='start' gap="12px" padding='6px' borderRadius='3px'
            border='2px solid #8896F8' width='default' smDirection='row' smPadding='6px' smGap='0px' smWidth='100%'>
            {
              tabData.map((tab, j) => {
                return (
                  <LeaderboardTab
                    active={tab === activeTab}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </LeaderboardTab>
                )

              })
            }
          </FlexBox>
        </FlexBox>

        <TableHeader color={COLORS[colorMode].mainTextColor} >
          <div>Rank</div>
          <div>Wallet</div>
          <div>Points</div>
        </TableHeader>
        {
          loading ?
            <FlexBox direction='column' maxWidth='1302px' gap="5px">
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
              <SkeletonCollectionStat />
            </FlexBox>
            :
            <>
              {
                // @ts-ignore
                pointsData && pointsData.map((item, index) => {
                  return (
                    <TableRow>
                      <div>
                        {
                          index + 1
                        }
                      </div>
                      <div>
                        {
                          !isMobile &&
                          <CustomImage
                            image={item.avatar}
                            width='50px'
                            height='50px'
                            borderRadius='3px'
                          />
                        }
                        <a href={`/users/` + item.id} target='_blank' rel="noreferrer">{item.id === item.username ? item.id : (item.username === '' ? item.id : item.username)}</a>
                      </div>
                      <div>{item.points + ` pts`}</div>
                    </TableRow>
                  )
                })
              }
            </>

        }

      </Container>
    </PageWrapper>
  )
}

export default Leaderboard