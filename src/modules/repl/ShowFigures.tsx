import { FC, useEffect, useRef } from 'react';

import { Stack, styled } from '@mui/material';

import ImagePreview from './ImagePreview';

const StyledContainer = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(1),
  marginBottom: '0px',
  paddingBottom: theme.spacing(2),
  overflowX: 'scroll',
  height: '200px',
}));

type Props = {
  figures: string[];
};

const ShowFigures: FC<Props> = ({ figures }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const figureWall = figures.map((fSrc, idx) => (
    <ImagePreview key={`fig.${idx}`} alt={`fig.${idx}`} imageSrc={fSrc} />
  ));

  // scroll to end of figure list when new figure is added
  useEffect(() => {
    if (containerRef?.current) {
      // uses "smooth" to get a nice scrolling animation
      containerRef.current.scrollTo({
        left: containerRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
  }, [figures]);

  return (
    <StyledContainer ref={containerRef} direction="row" spacing={2}>
      {figureWall}
    </StyledContainer>
  );
};

export default ShowFigures;
