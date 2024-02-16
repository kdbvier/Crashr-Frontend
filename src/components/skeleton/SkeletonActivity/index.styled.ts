import styled from 'styled-components'
const Card = styled.div`
  position: relative;
  max-width: 256px;
  width: 100%;
  cursor: pointer;
  text-decoration: none;
  background-color: #f6f6f6;
  -webkit-box-shadow: 0 0 transparent, 0 0 transparent, 0 0.375rem 0.375rem -0.125rem rgba(168, 179, 207, 0.4);
  box-shadow: 0 0 transparent, 0 0 transparent, 0 0.375rem 0.375rem -0.125rem rgba(168, 179, 207, 0.4);
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(82, 88, 102, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

interface Props {
  bgColor?: string;
}
const Image = styled.div<Props>`
  max-width: 64px;
  width: 100%;
  background-color: ${props => props.bgColor};
  height: 64px;
  border-radius: 0.75rem;
`
const Text = styled.div<Props>`
  background-color: ${props => props.bgColor};
  width: 100%;
  height: 30px;
  border-radius: 0.75rem;
`
export {
  Card,
  Image,
  Text
}