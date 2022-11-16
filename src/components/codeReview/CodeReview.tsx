import { FC } from 'react';

import { AppView } from '../../config/layout';
import { CODE_REVIEW_CONTAINER_CYPRESS } from '../../config/selectors';
import { ReviewProvider } from '../context/ReviewContext';
import { VisibilityProvider } from '../context/VisibilityContext';
import CodeReviewContainer from '../layout/CodeReviewContainer';
import CodeReviewBody from './CodeReviewBody';
import CodeReviewToolbar from './CodeReviewToolbar';

type Props = {
  setView?: (view: AppView) => void;
};

const CodeReview: FC<Props> = ({ setView }) => (
  <ReviewProvider>
    <VisibilityProvider>
      <CodeReviewContainer data-cy={CODE_REVIEW_CONTAINER_CYPRESS}>
        <CodeReviewToolbar setView={setView} />
        <CodeReviewBody />
      </CodeReviewContainer>
    </VisibilityProvider>
  </ReviewProvider>
);

export default CodeReview;
