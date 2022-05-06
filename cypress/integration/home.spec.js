import {
  LEARN_REACT_LINK_CYPRESS,
  buildDataCy,
} from '../../src/config/selectors';

describe('Renders Home', () => {
  it.skip('should render the link', () => {
    cy.visit('/');
    cy.get(buildDataCy(LEARN_REACT_LINK_CYPRESS)).should(
      'contain.text',
      'Learn React',
    );
  });
});
