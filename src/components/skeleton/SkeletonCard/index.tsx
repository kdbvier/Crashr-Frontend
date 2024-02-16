import * as S from './index.styled';
import { useEffect, useState } from 'react';

const placeholderImage = `https://imagesstorag.s3.eu-west-2.amazonaws.com/default_collection.png`;

const ceil = 96;
const floor = 86;

const SkeletonCard: React.FC = () => {
  const [number, setNumber] = useState(floor);
  const [increasing, setIncreasing] = useState<boolean>(true)

  useEffect(() => {
    const interval = setInterval(() => {
      if (increasing) {
        if (number < ceil) {
          setNumber(number + 0.1);
        } else {
          setIncreasing(false);
        }
      } else {
        if (number > floor) {
          setNumber(number - 0.1);
        } else {
          setIncreasing(true);
        }
      }
    }, 10);

    return () => clearInterval(interval);
  }, [number, increasing]);


  return (
    <S.Card>
      <S.Image bgColor={`hsl(0, 0%, ${number}%)`} />
      <S.Text bgColor={`hsl(0, 0%, ${number}%)`} />
      <S.Text bgColor={`hsl(0, 0%, ${number}%)`} />
    </S.Card>
  );
};

export default SkeletonCard;
