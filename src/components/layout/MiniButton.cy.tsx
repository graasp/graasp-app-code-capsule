import { Edit } from '@mui/icons-material';

import MiniButton from './MiniButton';

const testId = 'test-id';
const testText = 'Test Label';

describe('MiniButton.cy.ts', () => {
  it('Large screen', () => {
    cy.viewport(700, 200);
    cy.mount(
      <MiniButton
        id={testId}
        text={testText}
        icon={<Edit />}
        tooltip="Test button"
        // eslint-disable-next-line no-console
        onClick={() => console.log('clicked')}
      />,
    );
    cy.get(`#${testId}`).should('contain.text', testText);
  });

  it('Small screen', () => {
    cy.viewport(400, 200);

    cy.mount(
      <MiniButton
        id={testId}
        text={testText}
        icon={<Edit />}
        // eslint-disable-next-line no-console
        tooltip="Test button"
        onClick={() => console.log('clicked')}
      />,
    );
    cy.get(`#${testId}`).should('not.contain.text', testText);
  });
});
