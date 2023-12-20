import { AppView } from '../../config/layout';
import { CODE_REVIEW_CONTAINER_CYPRESS } from '../../config/selectors';
import { ReviewProvider } from '../context/ReviewContext';
import { VisibilityProvider } from '../context/VisibilityContext';
import CodeReviewContainer from '../layout/CodeReviewContainer';
import CodeReviewBody from './CodeReviewBody';
import CodeReviewToolbar from './CodeReviewToolbar';

type Props = {
  setView?: (view: AppView) => void;
  isPreset?: boolean;
};

const CodeReview = ({ setView, isPreset }: Props): JSX.Element => (
  <ReviewProvider>
    <VisibilityProvider>
      <CodeReviewContainer data-cy={CODE_REVIEW_CONTAINER_CYPRESS}>
        <CodeReviewToolbar setView={setView} />
        <CodeReviewBody isPreset={isPreset} />
      </CodeReviewContainer>
    </VisibilityProvider>
  </ReviewProvider>
);

export default CodeReview;
