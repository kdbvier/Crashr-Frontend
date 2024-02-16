import { FlexBox } from '@/components/common/FlexBox'
import { Container, PageWrapper } from '@/styles/GlobalStyles'
import AboutText from './components/AboutText'
import LearnMore from './components/LearnMore'
import OurValues from './components/OurValues'
import { useGlobalContext } from '@/context/GlobalContext'

const About = () => {
  const { colorMode } = useGlobalContext()
  return (
    <PageWrapper colorMode={colorMode}>
      <Container paddingTop='100px'>
        <FlexBox direction='column' gap="50px">
          <AboutText />
          <LearnMore />
          <OurValues />
        </FlexBox>
      </Container>
    </PageWrapper>
  )
}

export default About