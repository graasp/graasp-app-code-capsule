import {
  buildDataCy,
  LEARN_REACT_LINK_CYPRESS,
} from '../../src/config/selectors';

describe('Renders Home', () => {
  it('should render the link', () => {
    cy.visit('/');
    cy.get(buildDataCy(LEARN_REACT_LINK_CYPRESS)).should(
      'contain.text',
      'Learn React',
    );
  });
});
