import { prefix } from '../../utils/index';

describe('@momentum-ui/react', () => {
  it('snapshot of list-item', () => {
    cy.visit(`${Cypress.env('BASE_URL')}/list-item`)
      .get(`.${prefix}-list-item`)
      .should('be.visible')
      .percySnapshot();
  });
});
