import { loginUser } from 'cypress/support/utils.cy';
import * as userData from '../fixtures/user.json';
const user = userData;

describe('XSS Vulnerability Tests', () => {
  it('should not execute XSS payload', () => {
    const payload = `<script>window.location.href='https://www.google.com'</script>`;
    cy.intercept({
      method: 'POST',
      url: `${Cypress.env('API_URL')}/reviews`,
    }).as('APIReviewPost');

    loginUser(user);
    cy.visit('/reviews');
    cy.url().should('include', '/reviews');
    cy.url().then((currentUrl) => {
      cy.wrap(currentUrl).as('reviewUrl');
    });

    // Inject payload into a search input field
    cy.getByData('review-input-rating-images').children().first().click();
    cy.getByData('review-input-title').type(payload);
    cy.getByData('review-input-comment').type(payload);

    cy.getByData('review-submit').click();
    cy.wait('@APIReviewPost')
      .its('response.statusCode')
      .should('eq', 200)
      .then(() => {
        // Check that no XSS redirection has occurred
        cy.get('@reviewUrl').then((reviewUrl) => {
          cy.url().should('eq', reviewUrl);
        });
      });
  });
});
